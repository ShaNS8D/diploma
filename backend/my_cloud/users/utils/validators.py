import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_username(value):
    if not re.match(r'^[a-zA-Z][a-zA-Z0-9]{3,19}$', value):
        raise ValidationError(
            _("Логин должен начинаться с буквы, содержать только латинские буквы и цифры, длина 4-20 символов")
        )

def validate_email(value):
    if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', value):
        raise ValidationError(_("Некорректный формат email"))

def validate_password(value):
    if len(value) < 6:
        raise ValidationError(_("Пароль должен содержать минимум 6 символов"))
    if not any(c.isupper() for c in value):
        raise ValidationError(_("Пароль должен содержать хотя бы одну заглавную букву"))
    if not any(c.isdigit() for c in value):
        raise ValidationError(_("Пароль должен содержать хотя бы одну цифру"))
    if not any(not c.isalnum() for c in value):
        raise ValidationError(_("Пароль должен содержать хотя бы один специальный символ"))