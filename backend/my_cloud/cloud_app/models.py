import os
import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.conf import settings


def user_directory_path(instance, filename):
    return 'user_{0}/{1}/{2}/{3}/{4}'.format(
        instance.owner.username, 
        timezone.now().year,
        timezone.now().month,
        timezone.now().day,
        filename
    )


class File(models.Model):
    original_name = models.CharField(max_length=255)
    size = models.PositiveIntegerField()
    upload_date = models.DateTimeField(auto_now_add=True)
    last_download = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True, null=True, max_length=500)    
    share_link = models.UUIDField(default=uuid.uuid4, unique=True)
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE)
    file = models.FileField(upload_to=user_directory_path)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['owner', 'original_name'],
                name='unique_owner_filename'
            )
        ]
        indexes = [
            models.Index(fields=['owner']),
            models.Index(fields=['-upload_date']),
        ]

    def __str__(self):
        return f"{self.original_name} (owner: {self.owner.username})"

    def save(self, *args, **kwargs):
        if self.file:
            if self.file.size > settings.MAX_FILE_SIZE:
                raise ValidationError(
                    f"Файл слишком большой. Максимальный размер: {settings.MAX_FILE_SIZE} байт"
                )
            
            if not self.pk:
                self.size = self.file.size
                self.original_name = os.path.basename(self.file.name)
        
        super().save(*args, **kwargs)

    def update_last_download(self):
        self.last_download = timezone.now()
        self.save(update_fields=['last_download'])
    
    def delete(self, *args, **kwargs):
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path) 
        super().delete(*args, **kwargs)  