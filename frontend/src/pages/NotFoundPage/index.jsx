import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <PageHeader title="404 - Страница не найдена!" />      
      <Card>
        <p>Страница, которую вы ищете, не существует.</p>
        <Link to="/" className="btn primary">
          Вернуться на домашнюю страницу
        </Link>
      </Card>
    </div>
  );
};

export default NotFoundPage;