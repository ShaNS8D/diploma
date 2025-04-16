import UserItem from './UserItem';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <span>Login</span>
        <span>Full Name</span>
        <span>Email</span>
        <span>Admin</span>
        <span>Actions</span>
      </div>
      
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;