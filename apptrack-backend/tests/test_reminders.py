import pytest
from django.urls import reverse
from rest_framework import status
from datetime import datetime, timedelta
from apps.applications.models import Application, Reminder


@pytest.mark.django_db
class TestReminders:
    def test_create_reminder(self, authenticated_client):
        app = Application.objects.create(
            owner=authenticated_client.user,
            kind="job",
            title="Test Job",
            organization="Test Corp",
        )
        url = reverse("reminder-list-create", kwargs={"application_id": app.id})
        remind_at = datetime.now() + timedelta(days=1)
        data = {
            "application": str(app.id),
            "remind_at": remind_at.isoformat(),
            "channel": "email",
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert "scheduled_task_id" in response.data