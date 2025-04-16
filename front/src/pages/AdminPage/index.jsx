import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/users/usersSlice';
import UserList from '../../components/users/UserList';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminPage = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <PageHeader 
        title="Admin Dashboard" 
        subtitle="Manage users and system settings" 
      />
      
      <Card>
        <h2>Users Management</h2>
        <UserList users={users} />
      </Card>
    </div>
  );
};

export default AdminPage;