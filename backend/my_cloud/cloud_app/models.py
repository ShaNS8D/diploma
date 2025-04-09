import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _

class File(models.Model):

    original_name = models.CharField(
        _("Оригинпльное имя"),
        max_length=255,
        help_text=_("Исходное имя файла, загруженного пользователем")
    )

    size = models.PositiveIntegerField(
        _("Размер"),
        help_text=_("Размер файла в байтах")
    )

    upload_date = models.DateTimeField(
        _("Дата загрузки"),
        auto_now_add=True,
        help_text=_("Дата и время, когда файл был загружен")
    )

    last_download_date = models.DateTimeField(
        _("Дата последнего скачивания"),
        blank=True,
        null=True,
        help_text=_("Дата и время последней загрузки файла")
    )

    comment = models.TextField(
        _("Комментарий"),
        blank=True,
        null=True,
        help_text=_("Комментарий к файлу")
    )

    file_path = models.FileField(
        _("Путь к файлу"),
        upload_to='uploads/',
        help_text=_("Путь к файлу на сервере")
    )

    public_link = models.UUIDField(
        _("Публичная ссылка"),
        default=uuid.uuid4,
        editable=False,
        unique=True,
        help_text=_("Уникальная ссылка для внешнего доступа к файлу")
    )

    owner = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="files",
        verbose_name=_("Owner"),
        help_text=_("Пользователь, которому принадлежит этот файл")
    )

    def __str__(self):
        return self.original_name

    class Meta:
        verbose_name = _("File")
        verbose_name_plural = _("Files")