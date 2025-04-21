const EditFileButton = ({ type = 'submit', disabled = false, children }) => {
  return (
    <button 
      type={type} 
      className="file-button" 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default EditFileButton;