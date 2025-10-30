import pytest
from django.urls import reverse
from rest_framework import status
from apps.applications.models import Application


@pytest.mark.django_db
class TestApplications:
    def test_create_application(self, authenticated_client):
        url = reverse("application-list")
        data = {
            "kind": "job",
            "title": "Software Engineer",
            "organization": "Tech Corp",
            "location_country": "USA",
            "status": "draft",
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "Software Engineer"

    def test_list_own_applications(self, authenticated_client, create_user):
        # Create applications for current user
        Application.objects.create(
            owner=authenticated_client.user,
            kind="job",
            title="My Job",
            organization="My Corp",
        )
        
        # Create application for another user
        other_user = create_user(email="other@example.com")
        Application.objects.create(
            owner=other_user,
            kind="job",
            title="Other Job",
            organization="Other Corp",
        )
        
        url = reverse("application-list")
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["title"] == "My Job"

    def test_update_application(self, authenticated_client):
        app = Application.objects.create(
            owner=authenticated_client.user,
            kind="job",
            title="Original Title",
            organization="Corp",
        )
        url = reverse("application-detail", kwargs={"pk": app.id})
        data = {"title": "Updated Title"}
        response = authenticated_client.patch(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Updated Title"