import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDataFile } from '../../features/files/filesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import EditFileForm from '../../components/files/EditFileForm';
import EditFileInput from '../../components/files/EditFileInput';
import EditFileButton from '../../components/files/EditFileButton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditFilePage = () => {
  const { fileId } = useParams();  
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { files, loading } = useSelector((state) => state.files);

  const selectedFile = files.find((file) => file.id === Number(fileId));
  const [fileData, setFileData] = useState({
    id: fileId,
    original_name: selectedFile?.original_name || "",
    comment: selectedFile?.comment || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = {
      original_name: fileData.original_name.trim(),
      comment: fileData.comment.trim(),
    };
    const result = await dispatch(updateDataFile(fileId, newData));

    if (!result.success) {
      setErrors({ form: result.error.message });
    } else {
      navigate('/storage');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="file-page">
      <EditFileForm title="Редактирование файла" onSubmit={handleSubmit}>
        <EditFileInput
          name="original_name"
          value={fileData.original_name}
          onChange={handleChange}
          placeholder="название"
          error={errors.original_name}
          label="Название файла"
        />
        <EditFileInput
          type="comment"
          name="comment"
          value={fileData.comment}
          onChange={handleChange}
          placeholder="комментарий"
          error={errors.comment}
          label="Описание"
        />
        {errors.form && <div className="form-error">{errors.form}</div>}
        <EditFileButton disabled={loading}>
          Сохранить
        </EditFileButton>
      </EditFileForm>
    </div>
  );
};

export default EditFilePage;