'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CreateStudioPage() {
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    description: '',
    category: '',
    isPublic: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const categories = [
    'Gaming',
    'Music',
    'Education',
    'Entertainment',
    'Technology',
    'Lifestyle',
    'Sports',
    'News',
    'Comedy',
    'Art',
    'Cooking',
    'Travel',
    'Fitness',
    'Business',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement studio creation logic
    console.log('Studio creation attempt:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (step < 3) {
        setStep(step + 1);
      }
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Studio Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          placeholder="Enter your studio name"
        />
      </div>

      <div>
        <label htmlFor="handle" className="block text-sm font-medium text-gray-300 mb-2">
          Studio Handle (@handle) *
        </label>
        <input
          id="handle"
          name="handle"
          type="text"
          required
          value={formData.handle}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          placeholder="Choose your studio handle"
        />
        <p className="text-sm text-gray-400 mt-1">This will be your studio&apos;s unique URL</p>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
          Category *
        </label>
        <select
          id="category"
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Studio Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
          placeholder="Tell people about your studio..."
        />
        <p className="text-sm text-gray-400 mt-1">Max 1000 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Studio Visibility
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="isPublic"
              value="true"
              checked={formData.isPublic === true}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.value === 'true' })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
            />
            <div className="ml-3">
              <div className="text-white font-medium">Public Studio</div>
              <div className="text-gray-400 text-sm">Anyone can find and view your studio</div>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="isPublic"
              value="false"
              checked={formData.isPublic === false}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.value === 'true' })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
            />
            <div className="ml-3">
              <div className="text-white font-medium">Private Studio</div>
              <div className="text-gray-400 text-sm">Only you and invited members can access</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Studio Created!</h3>
        <p className="text-gray-400">Your studio &quot;{formData.name}&quot; is ready to go.</p>
      </div>
      <div className="space-y-4">
        <Link
          href={`/studio/${formData.handle}`}
          className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition"
        >
          View Your Studio
        </Link>
        <Link
          href="/upload/video"
          className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition"
        >
          Upload Your First Video
        </Link>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Create Your Studio';
      case 2: return 'Customize Your Studio';
      case 3: return 'Studio Created!';
      default: return 'Create Your Studio';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Let\'s start with the basics of your studio';
      case 2: return 'Add details and set up your studio preferences';
      case 3: return 'Your studio is ready! Start creating amazing content.';
      default: return 'Let\'s start with the basics of your studio';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2">AYINEL</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-white mb-2">{getStepTitle()}</h2>
          <p className="text-gray-400">{getStepDescription()}</p>
        </div>

        {/* Progress Bar */}
        {step < 3 && (
          <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Studio Creation Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
          {step < 3 ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {step === 1 ? 'Creating...' : 'Saving...'}
                    </div>
                  ) : (
                    step === 1 ? 'Continue' : 'Create Studio'
                  )}
                </button>
              </div>
            </form>
          ) : (
            renderStep3()
          )}
        </div>

        {/* Back to Dashboard */}
        {step < 3 && (
          <div className="text-center mt-6">
            <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 transition">
              ← Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
