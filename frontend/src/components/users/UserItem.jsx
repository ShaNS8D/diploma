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
      <span className="list-header-span_1">{user.username}</span>
      <span className="list-header-span_3">{user.full_name}</span>
      <span className="list-header-span_3">{user.email}</span>
      <span className="list-header-span_2">
        <input
          type="checkbox"
          checked={user.is_admin}
          onChange={handleToggleAdmin}
        />
      </span>
      <span className="list-header-span_1">{user.countFiles}</span>
      <span className="list-header-span_2">{user.sizeFiles}</span>
      <div className="user-actions">
        <Link to={`/storage/?user_id=${user.id}`}>Посмотреть</Link>
        <button onClick={handleDelete}>Удалить</button>
      </div>
    </div>
  );
};

export default UserItem;