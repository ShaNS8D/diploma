import logging
from rest_framework import viewsets, permissions, status
from django.http import FileResponse
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from .models import File
from .serializers import (
    FileListSerializer,
    FileUploadSerializer,
    FileUpdateSerializer,
    FileShareSerializer,
    FileDownloadSerializer
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
        # elif self.action == 'download':
        #     return FileDownloadSerializer
        elif self.action == 'share':
            return FileShareSerializer
        return FileListSerializer

    def get_queryset(self):
        try:
            queryset = super().get_queryset()
            if not self.request.user.is_staff:
                queryset = queryset.filter(owner=self.request.user)
            
            user_id = self.request.query_params.get('user_id')
            if user_id and self.request.user.is_staff:
                queryset = queryset.filter(owner_id=user_id)
            
            logger.info(f"File list retrieved by user {self.request.user.id}")
            return queryset
        except Exception as e:
            logger.error(f"Error getting files: {str(e)}")
            raise

    def perform_create(self, serializer):
        file = serializer.validated_data.get('file')
        try:
            validate_file_extension(file)
            serializer.save(owner=self.request.user)
            logger.info(f"File uploaded by user {self.request.user.id}")
        except Exception as e:
            logger.error(f"File upload failed by user {self.request.user.id}: {str(e)}")
            raise

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        try:
            file_obj = self.get_object()
            file_obj.update_last_download()            
            logger.info(f"File {file_obj.id} downloaded by user {request.user.id}")
            file_handle = file_obj.file.open('rb')            
            response = FileResponse(
                file_handle,
                content_type='application/octet-stream',
                as_attachment=True,
                filename=file_obj.original_name
            )
            return response        
        except Exception as e:
            logger.error(f"File download failed: {str(e)}")
            return Response(
                {"error": "File download failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def share(self, request, pk=None):
        try:
            file_obj = self.get_object()
            serializer = self.get_serializer(file_obj)
            logger.info(f"Share link accessed for file {file_obj.id} by user {request.user.id}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Share link access failed: {str(e)}")
            return Response(
                {"error": "Failed to get share link", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        try:
            file_obj = self.get_object()
            file_obj.delete()
            logger.info(f"File {file_obj.id} deleted by user {request.user.id}")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"File deletion failed: {str(e)}")
            return Response(
                {"error": "File deletion failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FileShareDownloadViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, share_link=None):
        try:
            file_obj = get_object_or_404(File, share_link=share_link)
            file_obj.update_last_download()
            
            logger.info(f"File {file_obj.id} downloaded via share link")

            file_handle = file_obj.file.open('rb')
            return FileResponse(
                file_handle,
                as_attachment=True,
                filename=file_obj.original_name,
                content_type='application/octet-stream'
            )
            
        except Exception as e:
            logger.error(f"Share link download failed: {str(e)}")
            return Response(
                {"error": "File not found or access denied", "details": str(e)},
                status=status.HTTP_404_NOT_FOUND if isinstance(e, File.DoesNotExist) 
                else status.HTTP_500_INTERNAL_SERVER_ERROR
            )