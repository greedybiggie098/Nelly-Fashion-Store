import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  gradient = false,
  glass = false,
  padding = 'md',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'card-padding-sm',
    md: 'card-padding-md',
    lg: 'card-padding-lg',
  };

  const classes = [
    'ui-card',
    hover && 'ui-card-hover',
    gradient && 'ui-card-gradient',
    glass && 'ui-card-glass',
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
