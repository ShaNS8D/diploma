import os
from django.core.exceptions import ValidationError
from django.conf import settings
import logging


logger = logging.getLogger(__name__)

def validate_file_extension(uploaded_file):
    allowed_extensions = settings.ALLOWED_EXTENSIONS
    ext = os.path.splitext(uploaded_file.name)[1].lower()
    if ext not in allowed_extensions:
        raise ValidationError(f"Недопустимое расширение файла: {ext}")
    

