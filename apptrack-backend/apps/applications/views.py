from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import Application, Attachment, StatusHistory, Reminder
from .serializers import (
    ApplicationListSerializer,
    ApplicationDetailSerializer,
    AttachmentSerializer,
    AttachmentUploadSerializer,
    StatusHistorySerializer,
    ReminderSerializer,
)
from .permissions import IsOwner
from .tasks import schedule_reminder


class ApplicationViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        queryset = Application.objects.filter(owner=self.request.user)
        
        # Filters
        status = self.request.query_params.get("status")
        kind = self.request.query_params.get("kind")
        tags = self.request.query_params.get("tags")
        
        if status:
            queryset = queryset.filter(status=status)
        if kind:
            queryset = queryset.filter(kind=kind)
        if tags:
            tag_list = tags.split(",")
            queryset = queryset.filter(tags__contains=tag_list)
            
        return queryset
    
    def get_serializer_class(self):
        if self.action == "list":
            return ApplicationListSerializer
        return ApplicationDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        old_status = instance.status
        updated_instance = serializer.save()
        
        # Create status history if status changed
        if old_status != updated_instance.status:
            StatusHistory.objects.create(
                application=updated_instance,
                from_status=old_status,
                to_status=updated_instance.status,
                changed_by=self.request.user,
            )


class AttachmentUploadView(generics.CreateAPIView):
    serializer_class = AttachmentUploadSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["application_id"] = self.kwargs["application_id"]
        return context


class AttachmentDetailView(generics.DestroyAPIView):
    queryset = Attachment.objects.all()
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_object(self):
        application_id = self.kwargs["application_id"]
        attachment_id = self.kwargs["attachment_id"]
        return get_object_or_404(
            Attachment,
            id=attachment_id,
            application_id=application_id,
            application__owner=self.request.user,
        )


class StatusHistoryListView(generics.ListAPIView):
    serializer_class = StatusHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        application_id = self.kwargs["application_id"]
        return StatusHistory.objects.filter(
            application_id=application_id,
            application__owner=self.request.user,
        )


class ReminderListCreateView(generics.ListCreateAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if "application_id" in self.kwargs:
            return Reminder.objects.filter(
                application_id=self.kwargs["application_id"],
                application__owner=self.request.user,
            )
        return Reminder.objects.filter(application__owner=self.request.user)
    
    def perform_create(self, serializer):
        reminder = serializer.save()
        # Schedule the reminder task
        task = schedule_reminder.apply_async(
            args=[reminder.id], eta=reminder.remind_at
        )
        reminder.scheduled_task_id = task.id
        reminder.save()


class ReminderDetailView(generics.DestroyAPIView):
    queryset = Reminder.objects.all()
    permission_classes = [IsAuthenticated, IsOwner]
    
    def perform_destroy(self, instance):
        # Cancel the scheduled task
        if instance.scheduled_task_id:
            from celery.result import AsyncResult
            AsyncResult(instance.scheduled_task_id).revoke()
        super().perform_destroy(instance)


class DashboardSummaryView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        now = timezone.now()
        seven_days = now + timedelta(days=7)
        
        # Upcoming deadlines
        upcoming_deadlines = Application.objects.filter(
            owner=user,
            deadline__gte=now.date(),
            deadline__lte=seven_days.date(),
        ).values("id", "title", "organization", "deadline")
        
        # Status counts
        status_counts = (
            Application.objects.filter(owner=user)
            .values("status")
            .annotate(count=Count("status"))
        )
        
        # Monthly submissions
        thirty_days_ago = now - timedelta(days=30)
        submissions = Application.objects.filter(
            owner=user,
            created_at__gte=thirty_days_ago,
            status="submitted",
        ).count()
        
        # Conversion rate
        total = Application.objects.filter(owner=user).count()
        offers = Application.objects.filter(owner=user, status="offer").count()
        conversion_rate = (offers / total * 100) if total > 0 else 0
        
        return Response({
            "upcoming_deadlines": upcoming_deadlines,
            "status_counts": {item["status"]: item["count"] for item in status_counts},
            "monthly_submissions": submissions,
            "conversion_rate": round(conversion_rate, 2),
        })