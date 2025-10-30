from django.contrib import admin
from .models import Application, Attachment, StatusHistory, Reminder


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ["title", "organization", "kind", "status", "deadline", "owner"]
    list_filter = ["kind", "status", "created_at"]
    search_fields = ["title", "organization", "owner__email"]
    date_hierarchy = "created_at"


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ["filename", "doc_type", "application", "uploaded_by", "uploaded_at"]
    list_filter = ["doc_type", "uploaded_at"]


@admin.register(StatusHistory)
class StatusHistoryAdmin(admin.ModelAdmin):
    list_display = ["application", "from_status", "to_status", "changed_by", "timestamp"]
    list_filter = ["timestamp"]


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ["application", "remind_at", "channel", "is_sent", "created_at"]
    list_filter = ["is_sent", "channel", "remind_at"]