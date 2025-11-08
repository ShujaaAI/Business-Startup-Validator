// components/Slider.tsx
import React from 'react';
import { SliderProps } from '../types';

const Slider: React.FC<SliderProps> = ({ id, label, value, onChange, options, className = '' }) => {
  const currentIndex = options.indexOf(value);
  const maxIndex = options.length - 1;

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(event.target.value, 10);
    onChange(options[newIndex]);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        {label}: <span className="font-semibold text-blue-600 dark:text-blue-400">{value}</span>
      </label>
      <input
        id={id}
        type="range"
        min="0"
        max={maxIndex}
        value={currentIndex}
        onChange={handleSliderChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        {options.map((option, index) => (
          <span key={option} className={index === 0 || index === maxIndex ? 'block' : 'hidden sm:block'}>
            {option}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
