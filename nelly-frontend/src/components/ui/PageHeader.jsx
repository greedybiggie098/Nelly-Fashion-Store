import './PageHeader.css';

const PageHeader = ({ 
  title, 
  description, 
  action,
  breadcrumbs,
  className = '',
  ...props 
}) => {
  return (
    <div className={`page-header ${className}`} {...props}>
      {breadcrumbs && (
        <nav className="page-header-breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb.link ? (
                <a href={crumb.link} className="page-header-breadcrumb-link">
                  {crumb.label}
                </a>
              ) : (
                <span className="page-header-breadcrumb-current">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <i className="bi bi-chevron-right page-header-breadcrumb-separator"></i>
              )}
            </span>
          ))}
        </nav>
      )}
      
      <div className="page-header-content">
        <div className="page-header-text">
          <h1 className="page-header-title">{title}</h1>
          {description && (
            <p className="page-header-description">{description}</p>
          )}
        </div>
        
        {action && (
          <div className="page-header-action">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
