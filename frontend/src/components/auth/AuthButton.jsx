const AuthButton = ({ type = 'submit', disabled = false, children }) => {
  return (
    <button 
      type={type} 
      className="auth-button" 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default AuthButton;