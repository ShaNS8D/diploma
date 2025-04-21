import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/users/usersSlice';
import { fetchFiles } from '../../features/files/filesSlice';
import UserList from '../../components/users/UserList';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminPage = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const { files } = useSelector((state) => state.files);  
  const usersStats = {};
  files.forEach(file => {
    const username = file.owner.username;
    if (!usersStats[username]) {
      usersStats[username] = {
        username: username,
        countFiles: 0,
        sizeFiles: 0
      };
    }
    usersStats[username].countFiles += 1;
    usersStats[username].sizeFiles += file.size;
  });
  const filesStats = Object.values(usersStats);
  const statsMap = new Map();
  filesStats.forEach(stat => {
    statsMap.set(stat.username, {
      countFiles: stat.countFiles,
      sizeFiles: stat.sizeFiles
    });
  });
  const result = users.map(user => {
    const userStats = statsMap.get(user.username);
    return {
      ...user,
      countFiles: userStats ? userStats.countFiles : 0,
      sizeFiles: userStats ? userStats.sizeFiles : 0
    };
  });
    

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <PageHeader 
        title="Панель администрирования" 
        subtitle="Управление пользователями и системными настройками" 
      />
      
      <Card>
        <h2>Управление пользователями</h2>
        <UserList users={result} />
      </Card>
    </div>
  );
};

export default AdminPage;