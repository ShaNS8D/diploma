import FileItem from './FileItem';

const FileList = ({ files }) => {
  if (files.length === 0) {
    return <div className="no-files">Файлы еще не загружены</div>;
  }

  return (
    <div className="file-list">
      <div className="file-list-header">
        <span>Имя</span>
        <span>Размер</span>
        <span>Загружено</span>
        <span>Действия</span>
      </div>
      
      {files.map(file => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
};

export default FileList;