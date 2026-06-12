
import React, { useState } from 'react';
import { classifyExpertise } from '../services/geminiService';
import { ExpertiseClassification } from '../types';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
    <p className="text-slate-400">Analyzing your brand...</p>
  </div>
);

const ResultDisplay: React.FC<{ result: ExpertiseClassification }> = ({ result }) => (
  <div className="w-full bg-slate-800/50 p-6 rounded-lg border border-slate-700 animate-fade-in">
    <h3 className="text-xl font-bold text-slate-200 mb-4">Your Brand Summary</h3>
    <p className="italic text-slate-300 mb-6">"{result.summary}"</p>
    
    <h3 className="text-xl font-bold text-slate-200 mb-4">Key Expertise Areas</h3>
    <div className="flex flex-wrap gap-3">
      {result.expertiseAreas.map((area, index) => (
        <span
          key={index}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md transform transition-transform hover:scale-105"
        >
          {area}
        </span>
      ))}
    </div>
  </div>
);

const Classifier: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<ExpertiseClassification | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleClassify = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text about your skills or experience.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const classification = await classifyExpertise(inputText);
      setResult(classification);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (error) {
        setError(null);
    }
  }

  return (
    <div className="w-full max-w-3xl flex flex-col items-center space-y-8 p-4 sm:p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <div className="w-full text-center">
          <label htmlFor="bio" className="block text-2xl font-semibold mb-3 text-slate-200">
              Describe Your Expertise
          </label>
          <p className="text-slate-400 mb-4">
              Paste your bio, resume summary, or list of skills below.
          </p>
          <textarea
              id="bio"
              value={inputText}
              onChange={handleTextareaChange}
              placeholder="e.g., Senior software engineer with 10 years of experience in full-stack development, specializing in React, Node.js, and cloud architecture..."
              className="w-full h-48 p-4 bg-slate-900 border border-slate-600 rounded-lg text-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-none"
              disabled={isLoading}
          />
      </div>

      <button
        onClick={handleClassify}
        disabled={isLoading || !inputText.trim()}
        className="w-full sm:w-auto px-8 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 shadow-lg"
      >
        {isLoading ? 'Analyzing...' : 'Classify My Expertise'}
      </button>

      <div className="w-full min-h-[150px] flex items-center justify-center">
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-red-400 text-center bg-red-900/50 p-4 rounded-md">{error}</p>}
        {result && <ResultDisplay result={result} />}
      </div>
    </div>
  );
};

export default Classifier;
