import React from 'react';
import { cn } from './utils';

interface BadgeProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Badge({ variant = 'default', children, className = '', onClick }: BadgeProps) {
  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80': variant === 'default',
          'text-foreground': variant === 'outline',
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80': variant === 'destructive',
        },
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
