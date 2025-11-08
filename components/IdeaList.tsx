// components/IdeaList.tsx
import React, { useState, useMemo } from 'react';
import { StartupIdea, GroundingChunk } from '../types';
import IdeaCard from './IdeaCard';
import Button from './Button';
import Select from './Select';

interface IdeaListProps {
  ideas: StartupIdea[];
  groundingLinks?: { uri: string; title: string; }[];
  onSaveFavorite: (idea: StartupIdea) => void;
  favoriteIdeas: StartupIdea[];
  onGenerateBusinessPlan: (ideaTitle: string) => void;
  onExportPdf: () => void;
}

const IdeaList: React.FC<IdeaListProps> = ({
  ideas,
  groundingLinks = [],
  onSaveFavorite,
  favoriteIdeas,
  onGenerateBusinessPlan,
  onExportPdf,
}) => {
  const [sortBy, setSortBy] = useState<'score' | 'cost' | 'none'>('none');
  const [filterRisk, setFilterRisk] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');

  const isIdeaFavorite = (idea: StartupIdea) =>
    favoriteIdeas.some((fav) => fav.title === idea.title);

  const sortedAndFilteredIdeas = useMemo(() => {
    let filtered = ideas.filter((idea) => {
      if (filterRisk === 'All') return true;
      return idea.riskAnalysis === filterRisk;
    });

    if (sortBy === 'score') {
      filtered.sort((a, b) => b.marketOpportunityScore - a.marketOpportunityScore);
    } else if (sortBy === 'cost') {
      // Basic sorting by cost - assumes costs are strings like "$Xk - $Yk"
      filtered.sort((a, b) => {
        const parseCost = (cost: string) => {
          const match = cost.match(/\$?(\d+k|\d+)/);
          if (match) {
            const num = parseFloat(match[1].replace('k', '000').replace('$', ''));
            return isNaN(num) ? Infinity : num;
          }
          return Infinity;
        };
        return parseCost(a.estimatedStartupCosts) - parseCost(b.estimatedStartupCosts);
      });
    }
    return filtered;
  }, [ideas, sortBy, filterRisk]);

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Validated Ideas</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Select
            id="sortBy"
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'cost' | 'none')}
            options={[
              { value: 'none', label: 'None' },
              { value: 'score', label: 'Market Score' },
              { value: 'cost', label: 'Startup Cost' },
            ]}
            className="w-full sm:w-40 !mb-0"
          />
          <Select
            id="filterRisk"
            label="Filter Risk"
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value as 'All' | 'Low' | 'Medium' | 'High')}
            options={[
              { value: 'All', label: 'All Risks' },
              { value: 'Low', label: 'Low Risk' },
              { value: 'Medium', label: 'Medium Risk' },
              { value: 'High', label: 'High Risk' },
            ]}
            className="w-full sm:w-40 !mb-0"
          />
          <Button onClick={onExportPdf} className="w-full sm:w-auto !bg-purple-600 dark:!bg-purple-500 hover:!bg-purple-700 dark:hover:!bg-purple-600">
            Export to PDF
          </Button>
        </div>
      </div>

      {groundingLinks.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Sources for Grounding Data:</h3>
          <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300">
            {groundingLinks.map((link, index) => (
              <li key={index}>
                <a href={link.uri} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {link.title || link.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredIdeas.map((idea, index) => (
          <IdeaCard
            key={idea.title + index} // Unique key based on title and index
            idea={idea}
            onSaveFavorite={onSaveFavorite}
            isFavorite={isIdeaFavorite(idea)}
            onGenerateBusinessPlan={onGenerateBusinessPlan}
          />
        ))}
      </div>
      {sortedAndFilteredIdeas.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg mt-10">
          No ideas match your filters. Try adjusting your criteria.
        </p>
      )}
    </div>
  );
};

export default IdeaList;
