import { useSelector } from 'react-redux';
import HomeContent from './HomeContent';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="home-page">
      <PageHeader 
        title="Cloud Storage" 
        subtitle="Secure and reliable file storage solution" 
      />
      
      <Card>
        <HomeContent isAuthenticated={isAuthenticated} />
      </Card>
    </div>
  );
};

export default HomePage;