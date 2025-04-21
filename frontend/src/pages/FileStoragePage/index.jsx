import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import { fetchFiles, uploadFile } from '../../features/files/filesSlice';
import FileList from '../../components/files/FileList';
import UploadForm from '../../components/files/UploadForm';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const FileStoragePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { 
    files, loading 
  } = useSelector((state) => state.files);
  useEffect(() => {
    const strParams = location.search.substring(1);
    const [key, value] = strParams.split("=");
    dispatch(fetchFiles({[key]: value}));
  }, [dispatch, location.search]);
  

  const handleUpload = async (file, comment) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);    
    await dispatch(uploadFile(formData));
    dispatch(fetchFiles());    
  };

  if ( loading ) return <LoadingSpinner />;  

  return (
    <div className="file-storage-page">
      <PageHeader 
        title="Моё хранилище"
        subtitle="Управление файлами" 
      />
      <div className="storage-layout">
        <main className="content">
          <Card>
            <UploadForm onUpload={handleUpload} />
          </Card>
          <Card>
            <FileList files={files} />
          </Card>
        </main>
      </div>
    </div>
  );
};

export default FileStoragePage;