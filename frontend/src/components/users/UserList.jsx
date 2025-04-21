import UserItem from './UserItem';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <span className="list-header-span_1">Логин</span>
        <span className="list-header-span_3">Полное имя</span>
        <span className="list-header-span_3">Почта</span>
        <span className='list-header-span_2'>Админ</span>
        <span className="list-header-span_1">Количество</span>
        <span className='list-header-span_2'>Размер</span>
        <span className='list-header-span_5'>Дейтсвия</span>
      </div>
      
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;