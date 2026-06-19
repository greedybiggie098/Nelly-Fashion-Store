import { useEffect } from 'react';
import './Modal.css';

const Modal = ({ 
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
  ...props 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className="ui-modal-backdrop" onClick={handleBackdropClick}>
      <div className={`ui-modal ui-modal-${size} ${className}`} {...props}>
        {/* Header */}
        {title && (
          <div className="ui-modal-header">
            <h3 className="ui-modal-title">{title}</h3>
            <button 
              className="ui-modal-close" 
              onClick={onClose}
              aria-label="Close"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="ui-modal-body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="ui-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
