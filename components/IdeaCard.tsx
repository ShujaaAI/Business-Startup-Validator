// components/IdeaCard.tsx
import React, { useState } from 'react';
import { StartupIdea } from '../types';
import Button from './Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IdeaCardProps {
  idea: StartupIdea;
  onSaveFavorite: (idea: StartupIdea) => void;
  isFavorite: boolean;
  onGenerateBusinessPlan: (ideaTitle: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onSaveFavorite, isFavorite, onGenerateBusinessPlan }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Prepare data for the trends chart - assigning a dummy 'relevance' score
  const trendsChartData = idea.currentTrends.map(trendObj => ({
    name: trendObj.trend.length > 20 ? trendObj.trend.substring(0, 17) + '...' : trendObj.trend, // Truncate long names for chart
    relevance: 50, // Arbitrary relevance score for visualization
  }));

  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{title}</h3>
      <div className="text-gray-700 dark:text-gray-300">{content}</div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-transform duration-200 hover:scale-[1.01]">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{idea.title}</h2>
        <Button
          onClick={() => onSaveFavorite(idea)}
          className={`
            !px-3 !py-1 !text-sm flex items-center gap-1
            ${isFavorite ? 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
          `}
        >
          {isFavorite ? (
            <>
              <span role="img" aria-label="star">⭐</span> Saved
            </>
          ) : (
            <>
              <span role="img" aria-label="star">⭐</span> Save
            </>
          )}
        </Button>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{idea.description}</p>

      {renderSection(
        `Market Opportunity Score: ${idea.marketOpportunityScore}/10`,
        <p>{idea.marketOpportunityExplanation}</p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button onClick={() => setIsExpanded(!isExpanded)} className="w-full sm:w-auto !bg-gray-300 dark:!bg-gray-700 !text-gray-800 dark:!text-gray-100 hover:!bg-gray-400 dark:hover:!bg-gray-600">
          {isExpanded ? 'Show Less' : 'Read More'}
        </Button>
        <Button onClick={() => onGenerateBusinessPlan(idea.title)} className="w-full sm:w-auto !bg-green-600 dark:!bg-green-500 hover:!bg-green-700 dark:hover:!bg-green-600">
          Generate Mini Business Plan
        </Button>
      </div>

      {isExpanded && (
        <>
          {renderSection('Target Market Size', <p>{idea.targetMarketSize}</p>)}
          {renderSection(
            'Key Competitors',
            <ul className="list-disc list-inside space-y-1">
              {idea.keyCompetitors.map((comp, i) => (
                <li key={i}>
                  <span className="font-medium">{comp.name}:</span> {comp.description}
                </li>
              ))}
            </ul>
          )}
          {renderSection(
            'Current Trends',
            <>
              <div className="h-48 w-full mt-2 mb-4"> {/* Increased height for better chart visibility */}
                {trendsChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trendsChartData}
                      margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-600" />
                      <XAxis dataKey="name" tick={{ fill: 'var(--text-color-primary)' }} axisLine={{ stroke: 'var(--border-color)' }} tickLine={{ stroke: 'var(--border-color)' }} />
                      <YAxis tick={{ fill: 'var(--text-color-primary)' }} axisLine={{ stroke: 'var(--border-color)' }} tickLine={{ stroke: 'var(--border-color)' }} />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} contentStyle={{ backgroundColor: 'var(--background-color-card)', borderColor: 'var(--border-color)', color: 'var(--text-color-primary)' }} />
                      <Legend wrapperStyle={{ color: 'var(--text-color-primary)' }} />
                      <Bar dataKey="relevance" fill="#8884d8" name="Trend Relevance" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No specific trends identified.</p>
                )}
              </div>
              <ul className="list-disc list-inside space-y-1">
                {idea.currentTrends.map((trendObj, i) => (
                  <li key={i}>
                    <span className="font-medium">{trendObj.trend}:</span> {trendObj.insight}
                  </li>
                ))}
              </ul>
            </>
          )}
          {renderSection('Estimated Startup Costs', <p>{idea.estimatedStartupCosts}</p>)}
          {renderSection('Revenue Potential', <p>{idea.revenuePotential}</p>)}
          {renderSection(
            `Risk Analysis: ${idea.riskAnalysis}`,
            <ul className="list-disc list-inside space-y-1">
              {idea.riskFactors.map((factor, i) => <li key={i}>{factor}</li>)}
            </ul>
          )}
          {renderSection(
            'Next Steps',
            <ol className="list-decimal list-inside space-y-1">
              {idea.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          )}
          {renderSection(
            'Required Resources',
            <div className="space-y-1">
              <p><span className="font-medium">Team:</span> {idea.requiredResources.team.join(', ')}</p>
              <p><span className="font-medium">Tools:</span> {idea.requiredResources.tools.join(', ')}</p>
              <p><span className="font-medium">Technology:</span> {idea.requiredResources.technology.join(', ')}</p>
            </div>
          )}
          {renderSection('Time to Market', <p>{idea.timeToMarket}</p>)}
          {idea.successStories && idea.successStories.length > 0 && renderSection(
            'Success Stories',
            <ul className="list-disc list-inside space-y-1">
              {idea.successStories.map((story, i) => (
                <li key={i}><a href={story.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{story.title}</a></li>
              ))}
            </ul>
          )}
          {idea.resourceLinks && idea.resourceLinks.length > 0 && renderSection(
            'Resource Links',
            <ul className="list-disc list-inside space-y-1">
              {idea.resourceLinks.map((link, i) => (
                <li key={i}><a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{link.title}</a></li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default IdeaCard;