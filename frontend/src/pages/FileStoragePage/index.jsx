import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFiles, 
  fetchFilesInFolder,
  uploadFile 
} from '../../features/files/filesSlice';
import { fetchFolders } from '../../features/folders/foldersSlice';
import FileList from '../../components/files/FileList';
import UploadForm from '../../components/files/UploadForm';
import FolderList from '../../components/folders/FolderList';
import CreateFolderForm from '../../components/folders/CreateFolderForm';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const FileStoragePage = () => {
  const dispatch = useDispatch();
  const { 
    files, 
    currentFolderFiles, 
    loading: filesLoading 
  } = useSelector((state) => state.files);
  const { 
    folders, 
    currentFolder, 
    loading: foldersLoading 
  } = useSelector((state) => state.folders);

  useEffect(() => {
    dispatch(fetchFolders());
    dispatch(fetchFiles());
  }, [dispatch]);

  const handleUpload = async (file, comment) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);
    if (currentFolder) {
      formData.append('folder', currentFolder.id);
    }
    await dispatch(uploadFile(formData));
    
    if (currentFolder) {
      dispatch(fetchFilesInFolder(currentFolder.id));
    } else {
      dispatch(fetchFiles());
    }
  };

  if (filesLoading || foldersLoading) return <LoadingSpinner />;

  const filesToDisplay = currentFolder ? currentFolderFiles : files;

  return (
    <div className="file-storage-page">
      <PageHeader 
        title={currentFolder ? `Folder: ${currentFolder.name}` : "Моё хранилище"} 
        subtitle="Управление файлами и папками" 
      />
      
      <div className="storage-layout">
        <aside className="sidebar">
          <Card>
            <CreateFolderForm />
          </Card>
          <Card>
            <FolderList />
          </Card>
        </aside>
        
        <main className="content">
          <Card>
            <UploadForm onUpload={handleUpload} />
          </Card>
          
          <Card>
            <FileList files={filesToDisplay} />
          </Card>
        </main>
      </div>
    </div>
  );
};

export default FileStoragePage;