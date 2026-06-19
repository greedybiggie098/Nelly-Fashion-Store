import './StatsCard.css';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  trendValue,
  description 
}) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-header">
        <div className="stats-card-info">
          <div className="stats-card-label">{title}</div>
          <div className="stats-card-value">{value}</div>
        </div>
        <div className={`stats-card-icon stats-card-icon-${color}`}>
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
      
      {(trend || description) && (
        <div className="stats-card-footer">
          {trend && trendValue && (
            <div className={`stats-card-trend stats-card-trend-${trend}`}>
              <i className={`bi bi-arrow-${trend === 'up' ? 'up' : 'down'}`}></i>
              <span>{trendValue}</span>
            </div>
          )}
          {description && (
            <div className="stats-card-description">{description}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
