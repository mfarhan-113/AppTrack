from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ApplicationViewSet,
    AttachmentUploadView,
    AttachmentDetailView,
    StatusHistoryListView,
    ReminderListCreateView,
    ReminderDetailView,
    DashboardSummaryView,
)

router = DefaultRouter()
router.register("applications", ApplicationViewSet, basename="application")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "applications/<uuid:application_id>/attachments/",
        AttachmentUploadView.as_view(),
        name="attachment-upload",
    ),
    path(
        "applications/<uuid:application_id>/attachments/<uuid:attachment_id>/",
        AttachmentDetailView.as_view(),
        name="attachment-detail",
    ),
    path(
        "applications/<uuid:application_id>/history/",
        StatusHistoryListView.as_view(),
        name="status-history",
    ),
    path(
        "applications/<uuid:application_id>/reminders/",
        ReminderListCreateView.as_view(),
        name="reminder-list-create",
    ),
    path("reminders/", ReminderListCreateView.as_view(), name="all-reminders"),
    path("reminders/<uuid:pk>/", ReminderDetailView.as_view(), name="reminder-detail"),
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
]