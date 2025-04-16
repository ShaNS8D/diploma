from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404
from django.core.exceptions import ValidationError
from .models import File
from .serializers import (
    FileSerializer,
    FileUpdateSerializer,
    FileDownloadSerializer,
    FileShareSerializer,
    ShareLinkDownloadSerializer
)
from utils.file_validators import validate_file_extension
import logging
import os

logger = logging.getLogger(__name__)

class FileUploadView(generics.CreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        file = serializer.validated_data.get('file')
        try:
            validate_file_extension(file)
            serializer.save(owner=self.request.user)
        except ValidationError as e:
            logger.warning(f"User {self.request.user} tried to upload invalid file type: {file.name}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(owner=self.request.user).order_by('-upload_date')

class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return FileUpdateSerializer
        return FileSerializer

    def get_object(self):
        queryset = self.get_queryset()
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        obj = get_object_or_404(queryset, **filter_kwargs)
        return obj

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response(
                {'error': 'File not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class FileDownloadView(generics.RetrieveAPIView):
    serializer_class = FileDownloadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(owner=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        obj = get_object_or_404(queryset, **filter_kwargs)
        return obj

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.update_last_download()
            
            response = FileResponse(instance.file.open('rb'), as_attachment=True, filename=instance.original_name)
            response['Content-Length'] = instance.size
            return response
        except Http404:
            return Response(
                {'error': 'File not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error downloading file: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class FileShareView(generics.RetrieveAPIView):
    serializer_class = FileShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(owner=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        obj = get_object_or_404(queryset, **filter_kwargs)
        return obj

class ShareLinkAccessView(generics.RetrieveAPIView):
    serializer_class = ShareLinkDownloadSerializer
    lookup_field = 'share_link'
    lookup_url_kwarg = 'share_link'

    def get_queryset(self):
        return File.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        obj = get_object_or_404(queryset, **filter_kwargs)
        return obj

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            return Response(
                {'error': 'Shared file not found or link is invalid'},
                status=status.HTTP_404_NOT_FOUND
            )

class ShareLinkDownloadView(generics.RetrieveAPIView):
    serializer_class = ShareLinkDownloadSerializer
    lookup_field = 'share_link'
    lookup_url_kwarg = 'share_link'

    def get_queryset(self):
        return File.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        obj = get_object_or_404(queryset, **filter_kwargs)
        return obj

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.update_last_download()            
            response = FileResponse(instance.file.open('rb'), as_attachment=True, filename=instance.original_name)
            response['Content-Length'] = instance.size
            return response
        except Http404:
            return Response(
                {'error': 'Shared file not found or link is invalid'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error downloading shared file: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )