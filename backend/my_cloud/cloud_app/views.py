import os
import logging
from rest_framework import viewsets, permissions, status
from django.http import FileResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from django.shortcuts import get_object_or_404
from .models import File
from .serializers import (
    FileListSerializer,
    FileUploadSerializer,
    FileUpdateSerializer,
    FileShareSerializer
)
from users.permissions import IsAdminOrOwner
from .utils.file_validators import validate_file_extension

logger = logging.getLogger(__name__)

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    def get_serializer_class(self):
        if self.action == 'create':
            return FileUploadSerializer
        elif self.action in ['update', 'partial_update']:
            return FileUpdateSerializer
        elif self.action == 'share':
            return FileShareSerializer
        return FileListSerializer

    def get_queryset(self):
        try:
            queryset = super().get_queryset()
            if not self.request.user.is_admin:
                queryset = queryset.filter(owner=self.request.user)
            
            user_id = self.request.query_params.get('user_id')
            if user_id and self.request.user.is_admin:
                queryset = queryset.filter(owner_id=user_id)
            
            logger.info(f"Список файлов, извлеченных пользователем {self.request.user.id}")
            return queryset
        except Exception as e:
            logger.error(f"Ошибка при получении файлов: {str(e)}")
            raise

    def perform_create(self, serializer):
        file = serializer.validated_data.get('file')
        try:
            validate_file_extension(file)
            serializer.save(owner=self.request.user)
            logger.info(f"Файл, загруженный пользователем {self.request.user.id}")
        except Exception as e:
            logger.error(f"Ошибка загрузки файла пользователем {self.request.user.id}: {str(e)}")
            raise

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        try:
            file_obj = self.get_object()
            file_obj.update_last_download()            
            logger.info(f"Файл {file_obj.id} скачан пользователем {request.user.id}")
            file_handle = file_obj.file.open('rb')            
            response = FileResponse(
                file_handle,
                content_type='application/octet-stream',
                as_attachment=True,
                filename=file_obj.original_name
            )
            return response        
        except Exception as e:
            logger.error(f"Не удалось загрузить файл: {str(e)}")
            return Response(
                {"error": "Не удалось загрузить файл", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def share(self, request, pk=None):
        try:
            file_obj = self.get_object()
            serializer = self.get_serializer(file_obj)
            logger.info(f"Поделитесь ссылкой, по которой пользователь {request.user.id} получил доступ к файлу {file_obj.id}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Не удалось получить доступ к общей ссылке: {str(e)}")
            return Response(
                {"error": "Не удалось получить ссылку для обмена", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        try:
            file_obj = self.get_object()
            file_path = file_obj.file.path
            file_dir = os.path.dirname(file_path)
            file_obj.delete()
            logger.info(f"Файл {file_obj.id} удален пользователем {request.user.id}")
            
            self._remove_empty_dirs(file_dir)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Не удалось удалить файл: {str(e)}")
            return Response(
                {"error": "Не удалось удалить файл", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _remove_empty_dirs(self, current_dir):
        media_root = settings.MEDIA_ROOT
        current_dir = os.path.abspath(current_dir)
        media_root = os.path.abspath(media_root)
        if not current_dir.startswith(media_root):
            return        
        while current_dir != media_root:
            try:
                if not os.listdir(current_dir):
                    os.rmdir(current_dir)
                    logger.info(f"Удален пустой каталог: {current_dir}")
                    current_dir = os.path.dirname(current_dir)
                else:
                    break
            except OSError as e:
                logger.warning(f"Не удалось удалить каталог {current_dir}: {str(e)}")
                break


class FileShareDownloadViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, share_link=None):
        try:
            file_obj = get_object_or_404(File, share_link=share_link)
            file_obj.update_last_download()
            
            logger.info(f"Файл {file_obj.id} загружен по общей ссылке")

            file_handle = file_obj.file.open('rb')
            return FileResponse(
                file_handle,
                as_attachment=True,
                filename=file_obj.original_name,
                content_type='application/octet-stream'
            )
            
        except Exception as e:
            logger.error(f"Не удалось загрузить ссылку для общего доступа: {str(e)}")
            return Response(
                {"error": "Файл не найден или доступ к нему запрещен", "details": str(e)},
                status=status.HTTP_404_NOT_FOUND if isinstance(e, File.DoesNotExist) 
                else status.HTTP_500_INTERNAL_SERVER_ERROR
            )