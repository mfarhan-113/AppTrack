#!/usr/bin/env python
import os
import django
from datetime import date, timedelta
from random import choice, randint

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from apps.applications.models import Application

User = get_user_model()

# Create test user
user, created = User.objects.get_or_create(
    email="demo@apptrack.com",
    defaults={
        "username": "demo",
        "first_name": "Demo",
        "last_name": "User",
    }
)
if created:
    user.set_password("demo123")
    user.save()

# Create sample applications
statuses = ["draft", "submitted", "interview", "offer", "rejected"]
kinds = ["job", "scholarship"]

for i in range(20):
    Application.objects.create(
        owner=user,
        kind=choice(kinds),
        title=f"Position {i+1}",
        organization=f"Company {i+1}",
        location_country=choice(["USA", "UK", "Canada", "Germany", "Pakistan"]),
        deadline=date.today() + timedelta(days=randint(1, 60)),
        status=choice(statuses),
        priority=randint(0, 5),
        tags=["remote", "full-time"] if i % 2 == 0 else ["onsite", "part-time"],
    )

print("Seed data created successfully!")