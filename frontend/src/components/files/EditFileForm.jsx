import Card from '../ui/Card';
import PageHeader from '../ui/PageHeader';
const EditFileForm = ({ title, onSubmit, children }) => {
  return (
    <Card className="file-form">
      <PageHeader title={title} />
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </Card>
  );
};

export default EditFileForm;