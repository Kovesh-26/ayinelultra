'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function VideoUploadPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: '',
    visibility: 'public',
    studioId: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    'Other',
  ];

  const studios = [
    { id: '1', name: 'My Gaming Studio' },
    { id: '2', name: 'Music Channel' },
    { id: '3', name: 'Tech Reviews' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setStep(3);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // TODO: Implement actual upload logic
    console.log('Video upload:', { formData, file: selectedFile });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">
              Upload your video
            </h3>
            <p className="text-gray-400">Drag and drop or click to browse</p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Choose File
          </button>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-gray-400 text-sm">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Video Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          placeholder="Enter your video title"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
          placeholder="Tell people about your video..."
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          placeholder="Enter tags separated by commas"
        />
        <p className="text-sm text-gray-400 mt-1">
          Tags help people discover your video
        </p>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="studioId"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Upload to Studio
        </label>
        <select
          id="studioId"
          name="studioId"
          value={formData.studioId}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        >
          <option value="">Select a studio</option>
          {studios.map((studio) => (
            <option key={studio.id} value={studio.id}>
              {studio.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Visibility
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={formData.visibility === 'public'}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
            />
            <div className="ml-3">
              <div className="text-white font-medium">Public</div>
              <div className="text-gray-400 text-sm">
                Anyone can search for and view
              </div>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              value="unlisted"
              checked={formData.visibility === 'unlisted'}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
            />
            <div className="ml-3">
              <div className="text-white font-medium">Unlisted</div>
              <div className="text-gray-400 text-sm">
                Anyone with the link can view
              </div>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={formData.visibility === 'private'}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
            />
            <div className="ml-3">
              <div className="text-white font-medium">Private</div>
              <div className="text-gray-400 text-sm">Only you can view</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Video Uploaded!
        </h3>
        <p className="text-gray-400">
          Your video &quot;{formData.title}&quot; is now processing.
        </p>
      </div>
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/upload/video"
          className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition"
        >
          Upload Another Video
        </Link>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Upload Video';
      case 2:
        return 'Video Details';
      case 3:
        return 'Upload Complete!';
      default:
        return 'Upload Video';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return 'Select the video file you want to upload';
      case 2:
        return 'Add details and settings for your video';
      case 3:
        return 'Your video is being processed and will be available soon.';
      default:
        return 'Select the video file you want to upload';
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
          <h2 className="text-2xl font-semibold text-white mb-2">
            {getStepTitle()}
          </h2>
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

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
          {step < 3 ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {step > 1 && !isUploading && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition"
                  >
                    Back
                  </button>
                )}
                {step === 1 && selectedFile && (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="ml-auto px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition"
                  >
                    Continue
                  </button>
                )}
                {step === 2 && (
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="ml-auto px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isUploading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </div>
                    ) : (
                      'Upload Video'
                    )}
                  </button>
                )}
              </div>
            </form>
          ) : (
            renderStep3()
          )}
        </div>

        {/* Back to Dashboard */}
        {step < 3 && (
          <div className="text-center mt-6">
            <Link
              href="/dashboard"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              ← Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
