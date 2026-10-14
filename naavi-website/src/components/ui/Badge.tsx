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
    primary: 'bg-[#FFF1EE] text-[#EB4D37] border border-[#FFD5CE]',
    accent: 'bg-[#FFF4EB] text-[#FF7A00] border border-orange-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    dark: 'bg-[#121418] text-white border border-slate-800',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full tracking-wide ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
