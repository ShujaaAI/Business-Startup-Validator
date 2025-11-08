// components/Select.tsx
import React from 'react';
import { SelectProps } from '../types';

const Select: React.FC<SelectProps> = ({ id, label, value, onChange, options, className = '' }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`
          mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
          focus:ring-blue-500 focus:border-blue-500
          dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
          ${className}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
