import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = true,
  bordered = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
        bordered ? 'border border-slate-200/80' : ''
      } ${
        hover
          ? 'hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1'
          : 'shadow-sm'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
