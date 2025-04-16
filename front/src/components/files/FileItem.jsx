import { useDispatch } from 'react-redux';
import { deleteFile, downloadFile } from '../../features/files/filesSlice';

const FileItem = ({ file }) => {
  const dispatch = useDispatch();

  const handleDownload = () => {
    dispatch(downloadFile(file.id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      dispatch(deleteFile(file.id));
    }
  };

  return (
    <div className="file-item">
      <span>{file.name}</span>
      <span>{formatFileSize(file.size)}</span>
      <span>{new Date(file.upload_date).toLocaleDateString()}</span>
      <div className="file-actions">
        <button onClick={handleDownload}>Download</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default FileItem;