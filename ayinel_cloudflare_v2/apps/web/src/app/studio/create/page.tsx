'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, endpoints } from '@/lib/api';

export default function CreateStudioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    about: '',
    bannerUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Studio name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Studio name must be at least 3 characters';
    }

    if (!formData.handle.trim()) {
      newErrors.handle = 'Studio handle is required';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.handle)) {
      newErrors.handle = 'Handle can only contain letters, numbers, hyphens, and underscores';
    } else if (formData.handle.length < 3) {
      newErrors.handle = 'Handle must be at least 3 characters';
    }

    if (formData.about.length > 500) {
      newErrors.about = 'About section must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(endpoints.studios.create, formData);
      const { studio } = response.data;
      
      // Redirect to the new studio
      router.push(`/studio/${studio.handle}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to create studio. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-white mb-2 block">
            Ayinel
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Studio</h1>
          <p className="text-purple-200">Start sharing your content with the world</p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Studio Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Studio Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.name ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="Enter your studio name"
                maxLength={50}
              />
              {errors.name && (
                <p className="mt-1 text-red-400 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Studio Handle */}
            <div>
              <label htmlFor="handle" className="block text-sm font-medium text-white mb-2">
                Studio Handle *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-200">
                  ayinel.com/studio/
                </span>
                <input
                  id="handle"
                  type="text"
                  value={formData.handle}
                  onChange={(e) => handleInputChange('handle', e.target.value.toLowerCase())}
                  className={`w-full pl-32 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.handle ? 'border-red-400' : 'border-white/20'
                  }`}
                  placeholder="your-studio"
                  maxLength={30}
                />
              </div>
              {errors.handle && (
                <p className="mt-1 text-red-400 text-sm">{errors.handle}</p>
              )}
              <p className="mt-1 text-purple-200 text-sm">
                This will be your unique URL: ayinel.com/studio/{formData.handle || 'your-studio'}
              </p>
            </div>

            {/* About */}
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-white mb-2">
                About Your Studio
              </label>
              <textarea
                id="about"
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  errors.about ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="Tell people about your studio and the content you create..."
                maxLength={500}
              />
              {errors.about && (
                <p className="mt-1 text-red-400 text-sm">{errors.about}</p>
              )}
              <p className="mt-1 text-purple-200 text-sm">
                {formData.about.length}/500 characters
              </p>
            </div>

            {/* Banner URL */}
            <div>
              <label htmlFor="bannerUrl" className="block text-sm font-medium text-white mb-2">
                Banner Image URL
              </label>
              <input
                id="bannerUrl"
                type="url"
                value={formData.bannerUrl}
                onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/banner.jpg"
              />
              <p className="mt-1 text-purple-200 text-sm">
                Optional: Add a banner image for your studio (recommended size: 1200x400px)
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-500/20 border border-red-400 rounded-lg">
                <p className="text-red-200 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Studio'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-300 hover:bg-white hover:text-purple-900"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <p className="text-purple-200 text-sm">
            Already have a studio?{' '}
            <Link href="/dashboard" className="text-white hover:underline font-medium">
              Go to Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
