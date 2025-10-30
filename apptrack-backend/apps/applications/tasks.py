from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def schedule_reminder(self, reminder_id):
    from .models import Reminder
    
    try:
        reminder = Reminder.objects.get(id=reminder_id)
        
        if reminder.is_sent:
            return "Already sent"
        
        application = reminder.application
        user = application.owner
        
        subject = f"Reminder: {application.title} at {application.organization}"
        message = f"""
        Hi {user.first_name},
        
        This is a reminder about your application:
        
        Title: {application.title}
        Organization: {application.organization}
        Status: {application.get_status_display()}
        Deadline: {application.deadline}
        
        Notes: {application.notes}
        
        Best regards,
        AppTrack Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        reminder.is_sent = True
        reminder.save()
        
        return f"Reminder sent to {user.email}"
        
    except Reminder.DoesNotExist:
        logger.error(f"Reminder {reminder_id} not found")
        return "Reminder not found"
    except Exception as exc:
        logger.error(f"Error sending reminder: {exc}")
        raise self.retry(exc=exc, countdown=60)


@shared_task
def check_and_send_reminders():
    from .models import Reminder
    
    now = timezone.now()
    pending_reminders = Reminder.objects.filter(
        remind_at__lte=now,
        is_sent=False,
    )
    
    for reminder in pending_reminders:
        schedule_reminder.delay(reminder.id)
    
    return f"Processed {pending_reminders.count()} reminders"