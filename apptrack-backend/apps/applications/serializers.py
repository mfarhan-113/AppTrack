from rest_framework import serializers
from .models import Application, Attachment, StatusHistory, Reminder


class AttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Attachment
        fields = [
            "id",
            "filename",
            "file_size",
            "content_type",
            "doc_type",
            "uploaded_by",
            "uploaded_at",
            "file_url",
        ]
        read_only_fields = ["id", "uploaded_by", "uploaded_at", "file_url"]

    def get_file_url(self, obj):
        request = self.context.get("request")
        if request and obj.file:
            return request.build_absolute_uri(obj.file.url)
        return None


class StatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source="changed_by.get_full_name", read_only=True)

    class Meta:
        model = StatusHistory
        fields = [
            "id",
            "from_status",
            "to_status",
            "changed_by",
            "changed_by_name",
            "note",
            "timestamp",
        ]
        read_only_fields = ["id", "changed_by", "timestamp"]


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = [
            "id",
            "application",
            "remind_at",
            "channel",
            "is_sent",
            "created_at",
            "scheduled_task_id",
        ]
        read_only_fields = ["id", "is_sent", "created_at", "scheduled_task_id"]


class ApplicationListSerializer(serializers.ModelSerializer):
    attachments_count = serializers.IntegerField(source="attachments.count", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "kind",
            "title",
            "organization",
            "location_country",
            "deadline",
            "status",
            "priority",
            "tags",
            "created_at",
            "attachments_count",
        ]


class ApplicationDetailSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, read_only=True)
    status_history = StatusHistorySerializer(many=True, read_only=True)
    reminders = ReminderSerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "owner",
            "kind",
            "title",
            "organization",
            "location_country",
            "source_url",
            "applied_date",
            "deadline",
            "status",
            "priority",
            "notes",
            "tags",
            "created_at",
            "updated_at",
            "attachments",
            "status_history",
            "reminders",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)


class AttachmentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ["file", "doc_type"]

    def create(self, validated_data):
        request = self.context["request"]
        application_id = self.context["application_id"]
        
        application = Application.objects.get(id=application_id, owner=request.user)
        file = validated_data["file"]
        
        attachment = Attachment.objects.create(
            application=application,
            file=file,
            filename=file.name,
            file_size=file.size,
            content_type=file.content_type,
            doc_type=validated_data["doc_type"],
            uploaded_by=request.user,
        )
        return attachment