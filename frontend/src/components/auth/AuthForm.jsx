import Card from '../ui/Card';
import PageHeader from '../ui/PageHeader';
const AuthForm = ({ title, onSubmit, children }) => {
  return (
    <Card className="auth-form">
      <PageHeader title={title} />
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </Card>
  );
};

export default AuthForm;