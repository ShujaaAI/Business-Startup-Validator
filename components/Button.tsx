// components/Button.tsx
import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg font-semibold
        bg-blue-600 text-white
        hover:bg-blue-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400
        transition-colors duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
