import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { deleteFile } from '../../features/files/filesSlice';

const FileItem = ({ file }) => {
  const dispatch = useDispatch();
  // console.log(file)
  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      dispatch(deleteFile(file.id));
    }
  };


  return (
    <div className="file-item">
      <span>{file.original_name}</span>
      <span>{formatFileSize(file.size)}</span>
      <span>{new Date(file.upload_date).toLocaleDateString()}</span>
      <div className="file-actions">
        <Link to={`/storage/edit/${file.id}`}>Редактировать</Link>
        <Link to={file.download_url}>Сачать</Link>
        <button name='delete' onClick={handleDelete}>Удалить</button>
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