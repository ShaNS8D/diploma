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
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('', FileListView.as_view(), name='file-list'),
    path('<int:pk>/download/', FileDownloadView.as_view(), name='file-download'),
    path('<int:pk>/', FileDetailView.as_view(), name='file-detail'),
    path('<int:pk>/share/', FileShareView.as_view(), name='file-share'),
    path('share/<uuid:share_link>/', ShareLinkAccessView.as_view(), name='share-link-access'),
    path('share/<uuid:share_link>/download/', ShareLinkDownloadView.as_view(), name='share-link-download'),
]
