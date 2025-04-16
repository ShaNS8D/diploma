import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <PageHeader title="404 - Page Not Found" />
      
      <Card>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn primary">
          Go to Home Page
        </Link>
      </Card>
    </div>
  );
};

export default NotFoundPage;