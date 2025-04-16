import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createFolder } from '../../features/folders/foldersSlice';

const CreateFolderForm = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Folder name cannot be empty');
      return;
    }
    
    const result = await dispatch(createFolder(name));
    
    if (result.success) {
      setName('');
      setError('');
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="folder-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New folder name"
      />
      <button type="submit">Create Folder</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default CreateFolderForm;