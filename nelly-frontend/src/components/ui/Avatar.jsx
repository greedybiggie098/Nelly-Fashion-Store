import './Avatar.css';

const Avatar = ({ 
  src, 
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = '',
  ...props 
}) => {
  const classes = [
    'ui-avatar',
    `ui-avatar-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {src ? (
        <img src={src} alt={alt} className="ui-avatar-image" />
      ) : (
        <div className="ui-avatar-fallback">
          {fallback || alt?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
