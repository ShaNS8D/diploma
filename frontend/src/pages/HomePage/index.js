import { useSelector } from 'react-redux';
import HomeContent from './HomeContent';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="home-page">
      <PageHeader 
        title="Сервис облачного хранилища" 
        subtitle="Безопасное и надежное решение для хранения файлов" 
      />      
      <Card>
        <HomeContent isAuthenticated={isAuthenticated} />
      </Card>
    </div>
  );
};

export default HomePage;