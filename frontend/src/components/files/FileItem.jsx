import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { deleteFile, generatePublicLink } from '../../features/files/filesSlice';

const FileItem = ({ file }) => {
  const dispatch = useDispatch();  
  
  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      dispatch(deleteFile(file.id));
    }
  };

  const handleCopyLink = async (id) => {
    try {
      const result = await dispatch(generatePublicLink(id));
      if (result.success) {
        await navigator.clipboard.writeText(result.link);
        alert('Ссылка скопирована в буфер обмена');
      } else {
        alert('Ошибка при получении ссылки');
      }
    } catch (error) {
      alert('Произошла ошибка');
    }
  };


  return (
    <div className="file-item">
      <span>{file.original_name}</span>
      <span>{file.comment}</span>
      <span>{formatFileSize(file.size)}</span>

      <span>{new Date(file.upload_date).toLocaleDateString()}</span>
      <span>{new Date(file.last_download).toLocaleDateString()}</span>

      <div className="file-actions">
        <Link to={`/storage/edit/${file.id}`}>Редактировать</Link>
        <a href={file.view_url} target="_blank" rel="noopener noreferrer">
          Посмотреть
        </a>
        <Link to={file.download_url}>Сачать</Link>
        <button onClick={() => handleCopyLink(file.share_link)}>
          Получить ссылку
        </button>
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