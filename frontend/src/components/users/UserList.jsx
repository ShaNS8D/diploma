import UserItem from './UserItem';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <span>Login</span>
        <span>Полное имя</span>
        <span>Почта</span>
        <span>Админ</span>
        <span>Дейтсвия</span>
      </div>
      
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;