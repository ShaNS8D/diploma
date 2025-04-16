import { useDispatch } from 'react-redux';
import { deleteFolder } from '../../features/folders/foldersSlice';

const FolderItem = ({ folder, onSelect }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm(`Удалить папку "${folder.name}"?`)) {
      dispatch(deleteFolder(folder.id));
    }
  };

  return (
    <li className="folder-item">
      <span onClick={() => onSelect(folder.id)}>
        {folder.name}
      </span>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
};

export default FolderItem;