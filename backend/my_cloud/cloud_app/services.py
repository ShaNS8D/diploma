import os
from django.core.exceptions import ValidationError
from django.conf import settings
from .exceptions import ServiceError
from .models import File, Folder
import logging


logger = logging.getLogger(__name__)

def upload_file(user, uploaded_file, folder_name=None):
    folder = None
    if folder_name:
        folder = Folder.objects.get_or_create(name=folder_name, owner=user)
    
    try:
        return File.create_from_upload(user, uploaded_file, folder=folder)
    except ValidationError as e:
        raise ServiceError(str(e))

def delete_file(file_id):
    """Удаление файла с обработкой ФС и событий."""
    file = File.objects.get(id=file_id)
    file_path = file.file_path.name
    file.delete()
    
    try:
        os.remove(os.path.join(settings.MEDIA_ROOT, file_path))
    except OSError as e:
        logger.error(f"Failed to delete file {file_path}: {e}")
