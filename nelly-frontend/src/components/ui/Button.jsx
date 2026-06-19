import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props 
}) => {
  const classes = [
    'ui-button',
    `ui-button-${variant}`,
    `ui-button-${size}`,
    loading && 'ui-button-loading',
    disabled && 'ui-button-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="ui-button-spinner"></span>
      )}
      {icon && !loading && (
        <span className="ui-button-icon">{icon}</span>
      )}
      <span className="ui-button-text">{children}</span>
    </button>
  );
};

export default Button;
