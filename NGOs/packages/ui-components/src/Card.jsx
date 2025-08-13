import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Reusable Card Component for NGO Management System
 * Provides consistent layout and styling for content containers
 */
const Card = ({
  children,
  title,
  subtitle,
  header,
  footer,
  variant = 'default',
  padding = 'medium',
  shadow = 'medium',
  hover = false,
  className,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg border border-slate-200 transition-all duration-200';
  
  const variantClasses = {
    default: '',
    dark: 'bg-slate-800 border-slate-700 text-white',
    success: 'border-emerald-200 bg-emerald-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50'
  };

  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg'
  };

  const cardClasses = classNames(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    shadowClasses[shadow],
    {
      'hover:shadow-lg hover:-translate-y-1': hover && shadow !== 'none',
      'cursor-pointer': hover
    },
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || header) && (
        <div className="mb-4 border-b border-slate-200 pb-3">
          {header}
          {title && (
            <h3 className="text-lg font-semibold text-slate-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="flex-1">
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'dark', 'success', 'warning', 'error']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  shadow: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  hover: PropTypes.bool,
  className: PropTypes.string
};

export default Card;