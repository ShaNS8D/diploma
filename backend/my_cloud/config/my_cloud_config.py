import os

# Базовая директория проекта
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# URL для доступа к медиа-файлам
MEDIA_URL = '/media/'

# Путь к директории для хранения загруженных файлов
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Максимальный размер файла для загрузки (в байтах)
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB

# Разрешенные типы файлов для загрузки
ALLOWED_FILE_TYPES = [
    'image/jpeg', 'image/png', 'application/pdf', 'text/plain',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]