'use client';

import React, { useState } from 'react';

export default function StudioCustomizePage() {
  const [activeTab, setActiveTab] = useState('colors');
  const [theme, setTheme] = useState({
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    backgroundColor: '#1F2937',
    textColor: '#FFFFFF',
    accentColor: '#10B981',
    customCSS: '',
  });
  const [previewMode, setPreviewMode] = useState(false);

  const colorPresets = [
    { name: 'Purple Pink', primary: '#8B5CF6', secondary: '#EC4899' },
    { name: 'Blue Green', primary: '#3B82F6', secondary: '#10B981' },
    { name: 'Orange Red', primary: '#F59E0B', secondary: '#EF4444' },
    { name: 'Teal Purple', primary: '#14B8A6', secondary: '#8B5CF6' },
    { name: 'Pink Yellow', primary: '#EC4899', secondary: '#F59E0B' },
    { name: 'Green Blue', primary: '#10B981', secondary: '#3B82F6' },
  ];

  const backgroundPresets = [
    { name: 'Dark', value: '#1F2937' },
    { name: 'Darker', value: '#111827' },
    { name: 'Navy', value: '#1E3A8A' },
    { name: 'Purple', value: '#581C87' },
    { name: 'Custom', value: 'custom' },
  ];

  const handleColorChange = (property: string, value: string) => {
    setTheme((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const applyPreset = (preset: { primary: string; secondary: string }) => {
    setTheme((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
    }));
  };

  const getPreviewStyles = () =>
    ({
      '--primary-color': theme.primaryColor,
      '--secondary-color': theme.secondaryColor,
      '--background-color': theme.backgroundColor,
      '--text-color': theme.textColor,
      '--accent-color': theme.accentColor,
    }) as React.CSSProperties;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Studio Customization
              </h1>
              <p className="text-gray-300 mt-1">
                Make your studio uniquely yours
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-lg transition ${
                  previewMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {previewMode ? 'Exit Preview' : 'Preview'}
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition">
                Save Theme
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customization Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700 sticky top-8">
              {/* Tabs */}
              <div className="border-b border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6">
                  <button
                    onClick={() => setActiveTab('colors')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'colors'
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Colors
                  </button>
                  <button
                    onClick={() => setActiveTab('backgrounds')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'backgrounds'
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Backgrounds
                  </button>
                  <button
                    onClick={() => setActiveTab('advanced')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'advanced'
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Advanced
                  </button>
                </nav>
              </div>

              {/* Color Customization */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Color Presets
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => applyPreset(preset)}
                          className="p-3 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.primary }}
                            ></div>
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.secondary }}
                            ></div>
                            <span className="text-sm text-gray-300">
                              {preset.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Custom Colors
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={theme.primaryColor}
                            onChange={(e) =>
                              handleColorChange('primaryColor', e.target.value)
                            }
                            className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.primaryColor}
                            onChange={(e) =>
                              handleColorChange('primaryColor', e.target.value)
                            }
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={theme.secondaryColor}
                            onChange={(e) =>
                              handleColorChange(
                                'secondaryColor',
                                e.target.value
                              )
                            }
                            className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.secondaryColor}
                            onChange={(e) =>
                              handleColorChange(
                                'secondaryColor',
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Accent Color
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={theme.accentColor}
                            onChange={(e) =>
                              handleColorChange('accentColor', e.target.value)
                            }
                            className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.accentColor}
                            onChange={(e) =>
                              handleColorChange('accentColor', e.target.value)
                            }
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Background Customization */}
              {activeTab === 'backgrounds' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Background Presets
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {backgroundPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleColorChange('backgroundColor', preset.value)
                          }
                          className="p-3 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{
                                backgroundColor:
                                  preset.value === 'custom'
                                    ? '#1F2937'
                                    : preset.value,
                              }}
                            ></div>
                            <span className="text-sm text-gray-300">
                              {preset.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Custom Background
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Background Color
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={theme.backgroundColor}
                            onChange={(e) =>
                              handleColorChange(
                                'backgroundColor',
                                e.target.value
                              )
                            }
                            className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.backgroundColor}
                            onChange={(e) =>
                              handleColorChange(
                                'backgroundColor',
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Background Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Customization */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Custom CSS
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Add your own CSS to completely customize your
                      studio&apos;s appearance
                    </p>
                    <textarea
                      value={theme.customCSS}
                      onChange={(e) =>
                        handleColorChange('customCSS', e.target.value)
                      }
                      rows={8}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm font-mono resize-none"
                      placeholder="/* Your custom CSS here */"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Layout Options
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
                        />
                        <span className="ml-2 text-gray-300">
                          Enable sidebar
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
                        />
                        <span className="ml-2 text-gray-300">
                          Show featured content
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
                        />
                        <span className="ml-2 text-gray-300">
                          Enable animations
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2">
            <div
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
              style={getPreviewStyles()}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Studio Preview
                </h2>
                <p className="text-gray-300">
                  See how your customizations will look
                </p>
              </div>

              {/* Mock Studio Layout */}
              <div className="space-y-6">
                {/* Header */}
                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        My Awesome Studio
                      </h3>
                      <p className="text-white opacity-80">@myawesome</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="px-4 py-2 rounded text-white text-sm"
                        style={{ backgroundColor: theme.secondaryColor }}
                      >
                        Tune-In
                      </button>
                      <button className="px-4 py-2 bg-white bg-opacity-20 rounded text-white text-sm">
                        Message
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: theme.backgroundColor }}
                  >
                    <h4 className="font-semibold text-white mb-2">
                      Latest Video
                    </h4>
                    <div
                      className="w-full h-32 rounded mb-3"
                      style={{ backgroundColor: theme.accentColor }}
                    ></div>
                    <p className="text-gray-300 text-sm">
                      Amazing content that showcases your creativity!
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: theme.backgroundColor }}
                  >
                    <h4 className="font-semibold text-white mb-2">Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Crew</span>
                        <span className="text-white">1.2K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Videos</span>
                        <span className="text-white">47</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Views</span>
                        <span className="text-white">89.5K</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    className="px-6 py-3 rounded-lg text-white font-medium"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Upload Video
                  </button>
                  <button
                    className="px-6 py-3 rounded-lg text-white font-medium"
                    style={{ backgroundColor: theme.secondaryColor }}
                  >
                    Go Live
                  </button>
                  <button
                    className="px-6 py-3 rounded-lg text-white font-medium"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    Create Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
