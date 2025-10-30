import uuid
import os
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import URLValidator, FileExtensionValidator
from django.core.exceptions import ValidationError
from django.conf import settings

User = get_user_model()


def validate_file_size(file):
    if file.size > settings.MAX_UPLOAD_SIZE:
        raise ValidationError(f"File size cannot exceed {settings.MAX_UPLOAD_SIZE} bytes")


class Application(models.Model):
    KIND_CHOICES = [
        ("job", "Job"),
        ("scholarship", "Scholarship"),
    ]
    
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("interview", "Interview"),
        ("offer", "Offer"),
        ("rejected", "Rejected"),
        ("withdrawn", "Withdrawn"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="applications"
    )
    kind = models.CharField(max_length=20, choices=KIND_CHOICES)
    title = models.CharField(max_length=255)
    organization = models.CharField(max_length=255)
    location_country = models.CharField(max_length=100, blank=True)
    source_url = models.URLField(blank=True, validators=[URLValidator()])
    applied_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    priority = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "applications"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["owner", "deadline"]),
        ]

    def __str__(self):
        return f"{self.title} at {self.organization}"


def attachment_upload_path(instance, filename):
    return f"attachments/{instance.application.id}/{uuid.uuid4()}{os.path.splitext(filename)[1]}"


class Attachment(models.Model):
    DOC_TYPE_CHOICES = [
        ("cv", "CV"),
        ("transcript", "Transcript"),
        ("cover_letter", "Cover Letter"),
        ("other", "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="attachments"
    )
    file = models.FileField(
        upload_to=attachment_upload_path,
        validators=[
            FileExtensionValidator(allowed_extensions=settings.ALLOWED_FILE_TYPES),
            validate_file_size,
        ],
    )
    filename = models.CharField(max_length=255)
    file_size = models.IntegerField()
    content_type = models.CharField(max_length=100)
    doc_type = models.CharField(max_length=20, choices=DOC_TYPE_CHOICES)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "attachments"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.filename


class StatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="status_history"
    )
    from_status = models.CharField(max_length=20)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    note = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "status_history"
        ordering = ["-timestamp"]


class Reminder(models.Model):
    CHANNEL_CHOICES = [
        ("email", "Email"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="reminders"
    )
    remind_at = models.DateTimeField()
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default="email")
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_task_id = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "reminders"
        ordering = ["remind_at"]