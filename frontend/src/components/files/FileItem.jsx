import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { deleteFile, generatePublicLink } from '../../features/files/filesSlice';

const FileItem = ({ file }) => {
  const dispatch = useDispatch();  
  // console.log("Download URL:", file.download_url);
  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      dispatch(deleteFile(file.id));
    }
  };

  const handleCopyLink = async (id) => {
    try {
      const result = await dispatch(generatePublicLink(id));

      if (result.success) {
        console.log("Пытаюсь скопировать ссылку:", result.link);
        await navigator.clipboard.writeText(result.link);
        alert('Ссылка скопирована в буфер обмена');
      } else {
        console.error("Ошибка в ответе сервера:", result);
        alert('Ошибка при получении ссылки');
      }
    } catch (error) {
      console.error("Общая ошибка:", error);
      alert('Произошла ошибка');
    }
  };


  return (
    <div className="file-item">
      <span className='list-header-span_3'>{file.original_name}</span>
      <span className='list-header-span_4'>{file.comment}</span>
      <span className='list-header-span_2'>{formatFileSize(file.size)}</span>

      <span className='list-header-span_1'>{new Date(file.upload_date).toLocaleDateString()}</span>
      <span className='list-header-span_1'>{new Date(file.last_download).toLocaleDateString()}</span>

      <div className="file-actions">
        <Link to={`/storage/edit/${file.id}`}>Редактировать</Link>
        <a href={file.view_url} target="_blank" rel="noopener noreferrer">
          Посмотреть
        </a>
        <a href={file.download_url} download>Скачать</a>
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
