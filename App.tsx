// App.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import InputForm from './components/InputForm';
import IdeaList from './components/IdeaList';
import Button from './components/Button';
import Input from './components/Input';
import LoadingSpinner from './components/LoadingSpinner';
import IdeaCard from './components/IdeaCard';
import { generateStartupIdeas, generateMiniBusinessPlan } from './services/geminiService';
import { UserInput, StartupIdea, GeminiIdeaResponse } from './types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


function App() {
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<StartupIdea[]>([]);
  const [favoriteIdeas, setFavoriteIdeas] = useState<StartupIdea[]>(() => {
    const savedFavorites = localStorage.getItem('favoriteIdeas');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [groundingLinks, setGroundingLinks] = useState<{ uri: string; title: string; }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [businessPlanLoading, setBusinessPlanLoading] = useState<boolean>(false);
  const [miniBusinessPlan, setMiniBusinessPlan] = useState<string | null>(null);
  const [currentIdeaTitleForPlan, setCurrentIdeaTitleForPlan] = useState<string | null>(null);

  const ideaListRef = useRef<HTMLDivElement>(null); // Ref for the content to be exported to PDF
  const ideaSectionRef = useRef<HTMLDivElement>(null); // Ref for the Idea section to scroll to

  useEffect(() => {
    localStorage.setItem('favoriteIdeas', JSON.stringify(favoriteIdeas));
  }, [favoriteIdeas]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Use useCallback to memoize the API call handler
  const handleGenerateIdeas = useCallback(async (input: UserInput) => {
    setUserInput(input); // Store the last submitted input
    setIsLoading(true);
    setError(null);
    setGeneratedIdeas([]);
    setGroundingLinks([]);
    setMiniBusinessPlan(null); // Clear any previous business plan
    setCurrentIdeaTitleForPlan(null);

    try {
      const response: GeminiIdeaResponse = await generateStartupIdeas(input);
      setGeneratedIdeas(response.ideas);
      setGroundingLinks(response.groundingLinks || []);
      // After generating ideas, scroll to the idea list
      setTimeout(() => {
        ideaListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100); // Small delay to allow ideas to render
    } catch (err) {
      console.error("Error in handleGenerateIdeas:", err);
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  const handleSaveFavorite = useCallback((idea: StartupIdea) => {
    setFavoriteIdeas((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.title === idea.title)) {
        return prevFavorites.filter((fav) => fav.title !== idea.title); // Remove if already favorite
      }
      return [...prevFavorites, idea]; // Add if not favorite
    });
  }, []);

  const handleGenerateBusinessPlan = useCallback(async (ideaTitle: string) => {
    setBusinessPlanLoading(true);
    setMiniBusinessPlan(null);
    setCurrentIdeaTitleForPlan(ideaTitle);
    setError(null);
    try {
      const plan = await generateMiniBusinessPlan(ideaTitle);
      setMiniBusinessPlan(plan);
      setTimeout(() => {
        document.getElementById('business-plan-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error("Error generating business plan:", err);
      setError((err as Error).message || "Failed to generate business plan.");
    } finally {
      setBusinessPlanLoading(false);
    }
  }, []);

  const handleExportPdf = useCallback(() => {
    if (ideaListRef.current) {
      setIsLoading(true); // Indicate that PDF generation is in progress
      html2canvas(ideaListRef.current, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Required for images from external sources
        windowWidth: ideaListRef.current.scrollWidth,
        windowHeight: ideaListRef.current.scrollHeight,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('Startup_Ideas_Validation.pdf');
        setIsLoading(false);
      }).catch((err) => {
        console.error("Error exporting to PDF:", err);
        setError("Failed to export to PDF.");
        setIsLoading(false);
      });
    } else {
      setError("No content to export for PDF.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="py-4 shadow-md bg-white dark:bg-gray-800 sticky top-0 z-20">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">Startup Validator</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#home" onClick={() => scrollToSection('home')} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Home</a></li>
              <li><a href="#idea" onClick={() => scrollToSection('idea')} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Idea</a></li>
              <li><a href="#pricing" onClick={() => scrollToSection('pricing')} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Pricing</a></li>
              <li><a href="#newsletter" onClick={() => scrollToSection('newsletter')} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Newsletter</a></li>
            </ul>
          </nav>
          <Button
            onClick={() => setDarkMode(!darkMode)}
            className="!bg-gray-200 !text-gray-800 hover:!bg-gray-300 dark:!bg-gray-700 dark:!text-gray-100 dark:hover:!bg-gray-600 !px-4 !py-2"
          >
            {darkMode ? (
              <span role="img" aria-label="sun">☀️ Light Mode</span>
            ) : (
              <span role="img" aria-label="moon">🌙 Dark Mode</span>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section id="home" className="relative min-h-[60vh] flex items-center overflow-hidden mb-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-900 shadow-xl p-6">
          <div className="absolute inset-0 bg-pattern-light dark:bg-pattern-dark opacity-10"></div> {/* Background pattern */}

          <div className="container mx-auto max-w-6xl px-4 flex flex-col lg:flex-row items-center justify-between z-10 py-10">
            {/* Left Side: Text Content */}
            <div className="max-w-2xl lg:max-w-xl text-center lg:text-left lg:w-1/2 pr-0 lg:pr-8 mb-8 lg:mb-0">
              <h2 className="text-5xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up">
                Turn Your Vision into a Validated Business Idea
              </h2>
              <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 animate-fade-in-up delay-100">
                Get AI-powered market analysis, competitor insights, and trend data to launch your startup with confidence.
              </p>
              <Button
                onClick={() => scrollToSection('idea')}
                className="px-10 py-4 text-xl bg-blue-800 text-white dark:bg-blue-700 dark:text-white hover:bg-blue-900 dark:hover:bg-blue-800 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-up delay-200"
              >
                Get Started for Free
              </Button>
              <p className="mt-3 text-sm text-gray-200 dark:text-gray-300 animate-fade-in-up delay-300">
                No credit card required
              </p>
            </div>

            {/* Right Side: Floating Images Container */}
            <div className="relative w-full lg:w-1/2 h-[300px] lg:h-[400px] flex items-center justify-center">
              {/* Floating Images - positions relative to this new container */}
              <div className="absolute top-[10%] left-[20%] w-32 h-20 bg-blue-300 dark:bg-blue-600 rounded-lg shadow-md flex items-center justify-center text-white text-lg font-bold animate-float delay-100" style={{'--tw-animate-delay': '0s'} as React.CSSProperties}>📈 85% Viability</div>
              <div className="absolute bottom-[5%] right-[5%] w-40 h-24 bg-purple-300 dark:bg-purple-600 rounded-lg shadow-md flex items-center justify-center text-white text-xl font-bold animate-float delay-200" style={{'--tw-animate-delay': '0.5s'} as React.CSSProperties}>💰 $1.2M Potential</div>
              <div className="absolute top-[40%] right-[25%] w-28 h-16 bg-pink-300 dark:bg-pink-600 rounded-lg shadow-md flex items-center justify-center text-white text-md font-bold animate-float delay-300" style={{'--tw-animate-delay': '1s'} as React.CSSProperties}>📊 +30% Growth</div>
            </div>
          </div>
        </section>

        {/* How We Validate Business Ideas Section */}
        <section id="how-it-works" className="py-12 bg-gray-50 dark:bg-gray-850 rounded-xl shadow-inner mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-10">How We Validate Business Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 border-t-4 border-blue-500">
              <div className="text-5xl text-blue-600 dark:text-blue-400 mb-4">💡</div> {/* Placeholder Icon */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">1. Collect Ideas from the Internet</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our AI continuously scans vast amounts of online data, including news, social media, forums, and market research reports, to identify emerging trends and nascent business concepts.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 border-t-4 border-purple-500">
              <div className="text-5xl text-purple-600 dark:text-purple-400 mb-4">🔍</div> {/* Placeholder Icon */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">2. Analyze Market Signals</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We employ sophisticated algorithms to analyze market demand, competitive landscape, growth potential, and consumer sentiment, providing a data-driven score for each idea.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 border-t-4 border-green-500">
              <div className="text-5xl text-green-600 dark:text-green-400 mb-4">🧠</div> {/* Placeholder Icon */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">3. AI Intelligence + Human Expertise</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Combining the power of advanced AI models with insights from seasoned human business strategists, we refine and enrich each idea, ensuring both innovation and practicality.
              </p>
            </div>
          </div>
        </section>

        {/* Idea Generation Section */}
        <section id="idea" ref={ideaSectionRef} className="py-12">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 text-center mb-10">Generate Your Next Big Idea</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 self-start sticky lg:top-28 z-10">
              <InputForm onSubmit={handleGenerateIdeas} isLoading={isLoading} />
            </div>

            <div className="lg:col-span-2">
              {isLoading && (
                <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                    Thinking big! Generating ideas and performing deep market analysis...
                    This might take a moment as the AI leverages real-time data.
                  </p>
                  <img
                    src="https://picsum.photos/400/250?random=1"
                    alt="AI thinking"
                    className="mt-6 mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-8" role="alert">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline ml-2">{error}</span>
                </div>
              )}

              {generatedIdeas.length > 0 && (
                <div ref={ideaListRef} className="printable-content">
                  <IdeaList
                    ideas={generatedIdeas}
                    groundingLinks={groundingLinks}
                    onSaveFavorite={handleSaveFavorite}
                    favoriteIdeas={favoriteIdeas}
                    onGenerateBusinessPlan={handleGenerateBusinessPlan}
                    onExportPdf={handleExportPdf}
                  />
                </div>
              )}

              {favoriteIdeas.length > 0 && (
                <div className="mt-12 py-8 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <span role="img" aria-label="star">⭐</span> Your Favorite Ideas
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteIdeas.map((idea, index) => (
                      <IdeaCard
                        key={idea.title + index}
                        idea={idea}
                        onSaveFavorite={handleSaveFavorite}
                        isFavorite={true}
                        onGenerateBusinessPlan={handleGenerateBusinessPlan}
                      />
                    ))}
                  </div>
                </div>
              )}

              {businessPlanLoading && (
                <div className="mt-12 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                    Crafting a mini business plan for "{currentIdeaTitleForPlan}"...
                  </p>
                </div>
              )}

              {miniBusinessPlan && (
                <div id="business-plan-section" className="mt-12 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Mini Business Plan Outline for "{currentIdeaTitleForPlan}"</h2>
                  <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    <p className="whitespace-pre-wrap">{miniBusinessPlan}</p>
                  </div>
                  <Button onClick={() => setMiniBusinessPlan(null)} className="mt-6 !bg-red-600 dark:!bg-red-500 hover:!bg-red-700 dark:hover:!bg-red-600">
                    Close Business Plan
                  </Button>
                </div>
              )}

              {!isLoading && !error && generatedIdeas.length === 0 && favoriteIdeas.length === 0 && !miniBusinessPlan && (
                <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ready to Innovate?</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Start by filling out your preferences on the left to generate validated startup ideas with AI-powered insights.
                  </p>
                  <img
                    src="https://picsum.photos/400/250?random=2"
                    alt="Startup inspiration"
                    className="mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Section (Placeholder) */}
        <section id="pricing" className="py-16 bg-gray-50 dark:bg-gray-850 rounded-xl shadow-inner mt-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">Our Plans</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12">
            Choose the plan that fits your startup journey. All plans include AI idea validation and market analysis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border-t-4 border-blue-500 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Basic</h3>
              <p className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">$0<span className="text-lg font-normal text-gray-500 dark:text-gray-400">/month</span></p>
              <ul className="text-gray-700 dark:text-gray-300 text-left mb-8 space-y-2">
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> 5 Idea Generations/month</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Basic Market Trends</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Competitor Overview</li>
                <li className="flex items-center"><span className="text-red-500 mr-2">✖</span> Export to PDF</li>
                <li className="flex items-center"><span className="text-red-500 mr-2">✖</span> Mini Business Plans</li>
              </ul>
              <Button onClick={() => alert('Start Free Plan clicked!')} className="w-full">
                Get Started
              </Button>
            </div>
            {/* Pro Plan */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border-t-4 border-purple-500 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">Pro</h3>
              <p className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">$29<span className="text-lg font-normal text-gray-500 dark:text-gray-400">/month</span></p>
              <ul className="text-gray-700 dark:text-gray-300 text-left mb-8 space-y-2">
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Unlimited Idea Generations</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Advanced Market Trends</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Detailed Competitor Analysis</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Export to PDF</li>
                <li className="flex items-center"><span className="text-red-500 mr-2">✖</span> Mini Business Plans</li>
              </ul>
              <Button onClick={() => alert('Upgrade to Pro clicked!')} className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                Upgrade to Pro
              </Button>
            </div>
            {/* Business Plan */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border-t-4 border-green-500 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Business</h3>
              <p className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">$79<span className="text-lg font-normal text-gray-500 dark:text-gray-400">/month</span></p>
              <ul className="text-gray-700 dark:text-gray-300 text-left mb-8 space-y-2">
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> All Pro Features</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Unlimited Mini Business Plans</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Priority Support</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Team Collaboration</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Custom Integrations</li>
              </ul>
              <Button onClick={() => alert('Contact Sales clicked!')} className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section (Placeholder) */}
        <section id="newsletter" className="py-16 bg-blue-50 dark:bg-blue-950 rounded-xl shadow-inner mt-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">Stay Updated with Our Newsletter!</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Get the latest startup trends, validation tips, and platform updates delivered straight to your inbox.
          </p>
          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
              <Input
                id="newsletter-email"
                label="" // Label intentionally empty as it's part of the hero message
                type="email"
                value="" // Controlled by state in a real app
                onChange={() => {}} // Controlled by state in a real app
                placeholder="Enter your email"
                className="flex-grow !mb-0"
              />
              <Button onClick={() => alert('Subscribe clicked!')} className="!px-8 !py-3 !text-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-white dark:bg-gray-800 mt-12 shadow-inner">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Startup Validator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;