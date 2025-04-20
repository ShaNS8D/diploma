import { useDispatch } from 'react-redux';
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
      <div className="user-actions">
        <button onClick={handleDelete}>Удалить</button>
      </div>
    </div>
  );
};

export default UserItem;