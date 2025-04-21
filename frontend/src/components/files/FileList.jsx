import FileItem from './FileItem';

const FileList = ({ files }) => {
  if (files.length === 0) {
    return <div className="no-files">Файлы еще не загружены</div>;
  }


  return (
    <div className="file-list">
      <div className="file-list-header">
        <span className='list-header-span_3'>Имя</span>
        <span className='list-header-span_4'>Комментарий</span>
        <span className='list-header-span_2'>Размер</span>
        <span className="list-header-span_1">Загружено</span>
        <span className="list-header-span_1">Скачивали</span>        
        <span className='file-list-header-span'>Действия</span>
      </div>
      
      {files.map(file => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
};

export default FileList;