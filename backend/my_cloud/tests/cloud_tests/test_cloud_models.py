import os
import pytest
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
from cloud_app.models import File
from django.utils import timezone
from datetime import timedelta


pytestmark = pytest.mark.django_db


class TestFileModel:
    def test_file_creation(self, file_factory):
        """Тест создания файла с минимальными данными."""
        file = file_factory()
        # print(f'Проверка что создает тест {file}')
        assert file is not None
        assert file.original_name.startswith("test_file.txt"), "Имя файла должно начинаться с 'test_file.txt'"
        assert file.size < settings.MAX_FILE_SIZE, "Размер файла должен быть меньше допустимого"
        assert file.owner is not None, "Владелец файла должен быть установлен"
        assert file.share_link is not None, "Уникальная ссылка должна быть сгенерирована"
        assert file.upload_date is not None, "Дата загрузки должна быть установлена"
        assert file.last_download is None, "Дата последней загрузки должна быть пустой"
        assert file.comment == "", "Комментарий должен быть пустым"

    def test_file_str_method(self, file_factory):
        """Тест метода __str__."""
        file = file_factory(original_name="test_file.txt")
        assert str(file) == f"test_file.txt (owner: {file.owner.username})"

    def test_unique_owner_filename_constraint(self, file_factory):
        """Тест уникальности пары owner + original_name."""
        file = file_factory(original_name="duplicate.txt")
        with pytest.raises(Exception):
            file_factory(owner=file.owner, original_name="duplicate.txt")

    def test_file_size_validation(self, file_factory, settings):
        """Тест валидации размера файла."""
        settings.MAX_FILE_SIZE = 200
        file = file_factory(size=150)
        assert file.size == 150
        with pytest.raises(ValidationError):
            
            File.objects.create(
                original_name="too_large_file.txt",
                size=250,
                file=SimpleUploadedFile("too_large_file.txt", b"a" * 250),
                owner=file.owner
            )

    def test_update_last_download(self, file_factory):
        """Тест обновления last_download."""
        file = file_factory()
        assert file.last_download is None
        before_update = timezone.now()
        file.update_last_download()
        after_update = timezone.now()
        assert file.last_download is not None
        assert before_update <= file.last_download <= after_update

    def test_upload_date_auto_now_add(self, file_factory):
        """Тест автоматического присвоения upload_date."""
        file = file_factory()
        assert file.upload_date is not None
        assert (timezone.now() - file.upload_date) < timedelta(seconds=1)

    def test_share_link_uniqueness(self, file_factory):
        """Тест уникальности share_link."""
        file1 = file_factory()
        file2 = file_factory()
        assert file1.share_link != file2.share_link

    def test_file_path_generation(self, file_factory):
        """Тест генерации пути к файлу."""
        file = file_factory()
        assert file.file.name.startswith("user_files/"), "Путь к файлу должен начинаться с 'user_files/'"
        basename = os.path.basename(file.file.name)
        assert basename.startswith("test_file"), "Имя файла должно начинаться с 'test_file'"

    def test_file_deletion(self, file_factory):
        """Тест удаления файла (проверка, что файл удаляется из хранилища)."""
        file = file_factory()
        file_path = file.file.path
        assert os.path.exists(file_path), "Файл должен существовать до удаления"
        file.delete()
        assert not os.path.exists(file_path), "Файл должен быть удалён после вызова delete()"