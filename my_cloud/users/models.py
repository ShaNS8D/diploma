from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator, MinLengthValidator

class User(AbstractUser):

    full_name = models.CharField(
        _("Full Name"),
        max_length=255,
        blank=True,
        null=True
    )

    email = models.EmailField(
        _("Email Address"),
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
                message=_("Введите действительный адрес электронной почты")
            )
        ]
    )

    is_admin = models.BooleanField(
        _("Admin Status"),
        default=False,
        help_text=_("Проверка прав пользователя")
    )

    storage_path = models.CharField(
        _("Storage Path"),
        max_length=255,
        unique=True,
        blank=True,
        null=True,
        help_text=_("Относительный путь к каталогу хранилища пользователя")
    )

    password = models.CharField(
        _("Password"),
        max_length=128,
        validators=[
            MinLengthValidator(6, message=_("Длина пароля должна составлять не менее 6 символов."))
        ]
    )

    def save(self, *args, **kwargs):
        if not self.storage_path:
            self.storage_path = f"user_{self.username}_{self.pk}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")