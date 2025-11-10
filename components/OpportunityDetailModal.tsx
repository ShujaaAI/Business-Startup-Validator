// components/OpportunityDetailModal.tsx
import React from 'react';
import { OpportunityDetailModalProps } from '../types';
import Button from './Button';

const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({ isOpen, onClose, opportunity }) => {
  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity duration-300" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform scale-100 opacity-100 transition-all duration-300 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">{opportunity.category}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{opportunity.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-semibold mb-1 flex items-center"><span className="text-blue-500 mr-2">📈</span> Monthly Search Volume:</p>
            <p className="ml-5">{opportunity.monthlySearchVolume}</p>
          </div>
          <div>
            <p className="font-semibold mb-1 flex items-center"><span className="text-purple-500 mr-2">📊</span> Competitors Analyzed:</p>
            <p className="ml-5">{opportunity.competitorsAnalyzed}</p>
          </div>
          <div>
            <p className="font-semibold mb-1 flex items-center"><span className="text-green-500 mr-2">🌐</span> Platform Mentioned:</p>
            <p className="ml-5">{opportunity.platformMentioned}</p>
          </div>
          <div>
            <p className="font-semibold mb-1 flex items-center"><span className="text-yellow-500 mr-2">🚀</span> Growth Potential:</p>
            <p className="ml-5">{opportunity.growthPotential}</p>
          </div>
          <div>
            <p className="font-semibold mb-1 flex items-center"><span className="text-red-500 mr-2">🚪</span> Ease of Entry:</p>
            <p className="ml-5">{opportunity.easeOfEntry}</p>
          </div>
          <div>
            <p className="font-semibold mb-1 flex items-center"><span className="text-orange-500 mr-2">⭐</span> Overall Score:</p>
            <p className="ml-5">{opportunity.score}/100</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Trend Impact:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            {opportunity.trendImpact.map((trend, i) => (
              <li key={i}>{trend}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Key Players:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            {opportunity.keyPlayers.map((player, i) => (
              <li key={i}>{player}</li>
            ))}
          </ul>
        </div>

        <div className="text-center mt-6">
          <Button onClick={onClose} className="!bg-blue-600 dark:!bg-blue-500 hover:!bg-blue-700 dark:hover:!bg-blue-600">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailModal;