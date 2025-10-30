import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestAuthentication:
    def test_user_registration(self, api_client):
        url = reverse("register")
        data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "newpass123",
            "password_confirm": "newpass123",
            "first_name": "New",
            "last_name": "User",
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert "email" in response.data

    def test_user_login(self, api_client, create_user):
        create_user(email="login@example.com", password="loginpass123")
        url = reverse("token_obtain_pair")
        data = {"email": "login@example.com", "password": "loginpass123"}
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data

    def test_token_refresh(self, api_client, create_user):
        user = create_user()
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        url = reverse("token_refresh")
        data = {"refresh": str(refresh)}
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data