import { useState } from 'react';

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file, comment);
      setFile(null);
      setComment('');
      e.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-group">
        <label>Выберите файл</label>
        <input 
          type="file" 
          onChange={handleFileChange} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Описание</label>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Необязательное описание файла"
        />
      </div>
      
      <button type="submit" disabled={!file}>
        Загрузить файл
      </button>
    </form>
  );
};

export default UploadForm;