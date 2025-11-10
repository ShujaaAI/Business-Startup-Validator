// components/HotOpportunities.tsx
import React from 'react';
import { HotOpportunitiesProps } from '../types';
import Button from './Button';

const HotOpportunities: React.FC<HotOpportunitiesProps> = ({ opportunities, onViewDetails }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-transform duration-200 hover:scale-[1.01] flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{opportunity.category}</h3>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">Score: {opportunity.score}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">{opportunity.description}</p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <p className="flex items-center"><span className="text-blue-500 mr-2">📈</span> <strong>Monthly Search Volume:</strong> {opportunity.monthlySearchVolume}</p>
              <p className="flex items-center"><span className="text-purple-500 mr-2">📊</span> <strong>Competitors Analyzed:</strong> {opportunity.competitorsAnalyzed}</p>
              <p className="flex items-center"><span className="text-green-500 mr-2">🌐</span> <strong>Platform Mentioned:</strong> {opportunity.platformMentioned}</p>
            </div>
            <Button
              onClick={() => onViewDetails(opportunity)}
              className="w-full mt-auto !bg-gray-300 dark:!bg-gray-700 !text-gray-800 dark:!text-gray-100 hover:!bg-gray-400 dark:hover:!bg-gray-600"
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        {/* Placeholder for "Load More" or pagination if needed for many opportunities */}
        {/* <Button onClick={() => alert('Load More clicked!')} className="!bg-blue-600 hover:!bg-blue-700 dark:!bg-blue-500 dark:hover:!bg-blue-600">
          Load More Opportunities
        </Button> */}
      </div>
    </div>
  );
};

export default HotOpportunities;