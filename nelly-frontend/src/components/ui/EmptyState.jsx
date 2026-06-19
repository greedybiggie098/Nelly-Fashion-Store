import './EmptyState.css';

const EmptyState = ({ 
  icon = 'bi-inbox',
  title = 'No data found',
  description,
  action,
  className = '',
  ...props 
}) => {
  return (
    <div className={`ui-empty-state ${className}`} {...props}>
      <div className="ui-empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h3 className="ui-empty-state-title">{title}</h3>
      {description && (
        <p className="ui-empty-state-description">{description}</p>
      )}
      {action && (
        <div className="ui-empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
