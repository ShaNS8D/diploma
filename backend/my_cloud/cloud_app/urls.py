from django.urls import path
from .views import (
    FileUploadView,
    FileListView,
    FileDetailView,
    FileDownloadView,
    FileShareView,
    ShareLinkAccessView,
    ShareLinkDownloadView
)

app_name = 'cloud'

urlpatterns = [
    path('files/upload/', FileUploadView.as_view(), name='file-upload'),
    path('files/', FileListView.as_view(), name='file-list'),
    path('files/<int:pk>/download/', FileDownloadView.as_view(), name='file-download'),
    path('files/<int:pk>/', FileDetailView.as_view(), name='file-detail'),
    path('files/<int:pk>/share/', FileShareView.as_view(), name='file-share'),
    path('files/share/<uuid:share_link>/', ShareLinkAccessView.as_view(), name='share-link-access'),
    path('files/share/<uuid:share_link>/download/', ShareLinkDownloadView.as_view(), name='share-link-download'),
]
