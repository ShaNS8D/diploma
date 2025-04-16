import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFolders, selectFolder } from '../../features/folders/foldersSlice';
import FolderItem from './FolderItem';
import LoadingSpinner from '../ui/LoadingSpinner';

const FolderList = () => {
  const dispatch = useDispatch();
  const { folders, loading } = useSelector((state) => state.folders);

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  const handleSelectFolder = (folderId) => {
    dispatch(selectFolder(folderId));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="folder-list">
      <h3>Folders</h3>
      {folders.length === 0 ? (
        <p>No folders created yet</p>
      ) : (
        <ul>
          {folders.map(folder => (
            <FolderItem 
              key={folder.id} 
              folder={folder} 
              onSelect={handleSelectFolder} 
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderList;