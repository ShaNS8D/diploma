const EditFileInput = ({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  label 
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default EditFileInput;