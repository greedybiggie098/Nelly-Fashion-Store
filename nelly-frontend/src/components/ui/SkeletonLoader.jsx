import './SkeletonLoader.css';

const SkeletonLoader = ({ 
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  ...props 
}) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const getSkeletonClass = () => {
    switch (variant) {
      case 'text':
        return 'ui-skeleton-text';
      case 'title':
        return 'ui-skeleton-title';
      case 'circle':
        return 'ui-skeleton-circle';
      case 'rect':
        return 'ui-skeleton-rect';
      case 'card':
        return 'ui-skeleton-card';
      default:
        return 'ui-skeleton-text';
    }
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  if (variant === 'card') {
    return (
      <div className={`ui-skeleton-card ${className}`} {...props}>
        <div className="ui-skeleton-card-image"></div>
        <div className="ui-skeleton-card-content">
          <div className="ui-skeleton-title"></div>
          <div className="ui-skeleton-text"></div>
          <div className="ui-skeleton-text" style={{ width: '60%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {skeletons.map((index) => (
        <div
          key={index}
          className={`ui-skeleton ${getSkeletonClass()} ${className}`}
          style={style}
          {...props}
        ></div>
      ))}
    </>
  );
};

export default SkeletonLoader;
