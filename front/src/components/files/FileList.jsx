import FileItem from './FileItem';

const FileList = ({ files }) => {
  if (files.length === 0) {
    return <div className="no-files">No files uploaded yet</div>;
  }

  return (
    <div className="file-list">
      <div className="file-list-header">
        <span>Name</span>
        <span>Size</span>
        <span>Uploaded</span>
        <span>Actions</span>
      </div>
      
      {files.map(file => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
};

export default FileList;