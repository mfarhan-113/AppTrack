import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

app = Celery("apptrack")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    "check-reminders": {
        "task": "apps.applications.tasks.check_and_send_reminders",
        "schedule": 60.0,  # Check every minute
    },
}