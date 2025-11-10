// components/InputForm.tsx
import React, { useState } from 'react';
import Select from './Select';
import Input from './Input';
import CheckboxGroup from './CheckboxGroup';
import Slider from './Slider';
import Button from './Button';
import { UserInput } from '../types';
import { INDUSTRY_OPTIONS, BUDGET_RANGE_OPTIONS, TIME_TO_MARKET_OPTIONS, SKILLS_OPTIONS } from '../constants';

interface InputFormProps {
  onSubmit: (input: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [industry, setIndustry] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>(BUDGET_RANGE_OPTIONS[0].value);
  const [timeToMarket, setTimeToMarket] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ industry, targetAudience, budgetRange, timeToMarket, skills });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Your Startup Vision</h2>

      <Select
        id="industry"
        label="Industry/Sector of Interest"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        options={INDUSTRY_OPTIONS}
      />

      <Input
        id="targetAudience"
        label="Target Audience (e.g., small businesses, Gen Z, eco-conscious consumers)"
        type="text"
        value={targetAudience}
        onChange={(e) => setTargetAudience(e.target.value)}
        placeholder="e.g., Parents of toddlers, local restaurants"
      />

      <Slider
        id="budgetRange"
        label="Budget Range for Startup"
        value={budgetRange}
        onChange={setBudgetRange}
        options={BUDGET_RANGE_OPTIONS.map(o => o.value)}
      />

      <Select
        id="timeToMarket"
        label="Preferred Time to Market"
        value={timeToMarket}
        onChange={(e) => setTimeToMarket(e.target.value)}
        options={TIME_TO_MARKET_OPTIONS}
      />

      <CheckboxGroup
        label="Available Skills"
        options={SKILLS_OPTIONS}
        selectedValues={skills}
        onChange={setSkills}
      />

      {/* Add missing 'onClick' prop to satisfy ButtonProps interface */}
      <Button
        type="submit" // Correctly setting the type to 'submit'
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Ideas...
          </span>
        ) : (
          'Generate Startup Ideas'
        )}
      </Button>
    </form>
  );
};

export default InputForm;