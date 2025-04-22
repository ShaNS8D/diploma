const AuthInput = ({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
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
      />
    </div>
  );
};

export default AuthInput;