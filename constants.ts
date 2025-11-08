// constants.ts

export const INDUSTRY_OPTIONS = [
  { value: '', label: 'Select Industry' },
  { value: 'Tech', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Food & Beverage', label: 'Food & Beverage' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Media & Entertainment', label: 'Media & Entertainment' },
  { value: 'Sustainability', label: 'Sustainability & Environment' },
  { value: 'Travel & Hospitality', label: 'Travel & Hospitality' },
  { value: 'Automotive', label: 'Automotive' },
];

export const BUDGET_RANGE_OPTIONS = [
  { value: '$0-$10k', label: '$0 - $10,000' },
  { value: '$10k-$50k', label: '$10,000 - $50,000' },
  { value: '$50k-$100k', label: '$50,000 - $100,000' },
  { value: '$100k+', label: '$100,000+' },
];

export const TIME_TO_MARKET_OPTIONS = [
  { value: '', label: 'Select Timeframe' },
  { value: '1-3 months', label: '1-3 months' },
  { value: '3-6 months', label: '3-6 months' },
  { value: '6-12 months', label: '6-12 months' },
  { value: '12+ months', label: '12+ months' },
];

export const SKILLS_OPTIONS = [
  { value: 'Technical', label: 'Technical' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Design', label: 'Design' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Customer Service', label: 'Customer Service' },
  { value: 'Content Creation', label: 'Content Creation' },
];

export const MODEL_CONFIG_PRO = {
  model: 'gemini-2.5-pro',
  config: {
    thinkingConfig: { thinkingBudget: 32768 },
    responseMimeType: "application/json",
    responseSchema: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' },
          marketOpportunityScore: { type: 'NUMBER' },
          marketOpportunityExplanation: { type: 'STRING' },
          targetMarketSize: { type: 'STRING' },
          keyCompetitors: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                description: { type: 'STRING' },
              },
              required: ['name', 'description'],
            },
          },
          currentTrends: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                trend: { type: 'STRING' },
                insight: { type: 'STRING' },
              },
              required: ['trend', 'insight'],
            },
          },
          estimatedStartupCosts: { type: 'STRING' },
          revenuePotential: { type: 'STRING' },
          riskAnalysis: { type: 'STRING', enum: ['Low', 'Medium', 'High'] },
          riskFactors: { type: 'ARRAY', items: { type: 'STRING' } },
          nextSteps: { type: 'ARRAY', items: { type: 'STRING' } },
          requiredResources: {
            type: 'OBJECT',
            properties: {
              team: { type: 'ARRAY', items: { type: 'STRING' } },
              tools: { type: 'ARRAY', items: { type: 'STRING' } },
              technology: { type: 'ARRAY', items: { type: 'STRING' } },
            },
            required: ['team', 'tools', 'technology'],
          },
          timeToMarket: { type: 'STRING' },
          successStories: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING' },
                link: { type: 'STRING' },
              },
              required: ['title', 'link'],
            },
          },
          resourceLinks: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING' },
                link: { type: 'STRING' },
              },
              required: ['title', 'link'],
            },
          },
        },
        required: [
          'title', 'description', 'marketOpportunityScore', 'marketOpportunityExplanation',
          'targetMarketSize', 'keyCompetitors', 'currentTrends', 'estimatedStartupCosts',
          'revenuePotential', 'riskAnalysis', 'riskFactors', 'nextSteps',
          'requiredResources', 'timeToMarket',
        ],
      },
    },
  },
  tools: [{ googleSearch: {} }],
};

export const SYSTEM_INSTRUCTION = `You are an expert startup idea validator and market analyst.
Your goal is to generate highly detailed and realistic business ideas based on user inputs,
providing comprehensive market analysis, competitor insights, trend data, and viability ratings.
You MUST leverage up-to-date information from Google Search for market data, trends, and competitor analysis.
Provide specific numbers, statistics, and actionable insights.

When validating ideas, consider the following criteria:
- Current market trends and demand
- Competition saturation level
- Profitability potential
- Scalability
- Required expertise match
- Market timing
- Regulatory challenges
- Technology availability

Generate 3 distinct startup ideas, each following the exact JSON structure provided in the responseSchema.
Ensure all fields are populated with specific, data-driven content based on real-world information.
For 'Estimated Startup Costs' and 'Revenue Potential', provide realistic financial figures (e.g., "$5,000 - $15,000" or "$20,000/month - $50,000/month").
For 'Target Market Size', provide estimated numbers.
For 'Key Competitors', list 3-5 actual companies with brief descriptions of their offerings.
For 'Current Trends', list 3-5 relevant and verifiable trends, and for each trend, provide a brief insight on how it directly impacts the viability or potential of the startup idea.
For 'Risk Analysis', provide 3-5 specific factors.
For 'Next Steps', provide 5 actionable items.
For 'Required Resources', provide specific examples for team roles, tools, and technologies.
For 'Time to Market', provide a realistic timeline.
If applicable, include success stories and resource links, making sure they are real and verifiable URLs.`;