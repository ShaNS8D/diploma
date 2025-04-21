import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteUser, toggleAdminStatus } from '../../features/users/usersSlice';


const UserItem = ({ user }) => {
  const dispatch = useDispatch();
  const handleToggleAdmin = () => {
    dispatch(toggleAdminStatus(user.id, !user.is_admin));
  };

  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить этого пользователя ${user.login}?`)) {
      dispatch(deleteUser(user.id));
    }
  };

  return (
    <div className="user-item">
      <span>{user.username}</span>
      <span>{user.full_name}</span>
      <span>{user.email}</span>
      <span>
        <input
          type="checkbox"
          checked={user.is_admin}
          onChange={handleToggleAdmin}
        />
      </span>
      {/* <span>{user.files_count}</span> */}
      {/* <span>{user.formatted_size}</span> */}
      <div className="user-actions">
        <Link to={`/storage/?user_id=${user.id}`}>Посмотреть</Link>
        <button onClick={handleDelete}>Удалить</button>
      </div>
    </div>
  );
};

export default UserItem;