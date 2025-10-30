from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "username", "first_name", "last_name", "is_active")
    list_filter = ("is_active", "is_staff", "created_at")
    search_fields = ("email", "username", "first_name", "last_name")
    ordering = ("-created_at",)