// components/Input.tsx
import React from 'react';
import { InputProps } from '../types';

const Input: React.FC<InputProps> = ({ id, label, type = 'text', value, onChange, placeholder, className = '', rows }) => {
  const inputClasses = `
    mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
    focus:ring-blue-500 focus:border-blue-500
    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400
    ${className}
  `;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 3}
          className={inputClasses}
        ></textarea>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
};

export default Input;
