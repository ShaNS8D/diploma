from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password

class CustomUserManager(UserManager):
    def _create_user(self, username, email, password, **extra_fields):
        if not email:
            raise ValueError('Email должен быть указан')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractUser):
    objects = CustomUserManager()

    full_name = models.CharField(_('Full Name'), max_length=255, blank=True)
    email = models.EmailField(_('Email Address'), unique=True)
    is_admin = models.BooleanField(_('Admin Status'), default=False)
    storage_path = models.CharField(_('Storage Path'), max_length=255, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.storage_path:
            self.storage_path = f"user_{self.username}"
        
        if self.password and not self.password.startswith(('pbkdf2_sha256$', 'bcrypt$', 'argon2$')):
            self.set_password(self.password)
            
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')