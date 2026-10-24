import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'neutral' | 'dark';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-slate-100 text-slate-800 border border-slate-200/80',
    accent: 'bg-[#FAF7F0] text-[#9A7B39] border border-[#EADCB9]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    neutral: 'bg-slate-50 text-slate-600 border border-slate-200',
    dark: 'bg-slate-900 text-white border border-slate-800',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1 font-medium',
    md: 'text-xs px-3 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
