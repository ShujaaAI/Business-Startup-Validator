// components/CheckboxGroup.tsx
import React from 'react';
import { CheckboxGroupProps } from '../types';

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, selectedValues, onChange, className = '' }) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter((val) => val !== value));
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="checkbox"
              id={`checkbox-${option.value}`}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-500"
            />
            <label htmlFor={`checkbox-${option.value}`} className="ml-2 text-sm text-gray-700 dark:text-gray-200">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
