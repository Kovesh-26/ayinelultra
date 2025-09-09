'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, endpoints } from '@/lib/api';

interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  message: string;
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'PRIVATE',
    tags: '',
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith('video/')) {
        handleFileUpload(file);
      }
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => handleFileUpload(file));
  };

  const handleFileUpload = async (file: File) => {
    const uploadId = Date.now().toString();

    // Add to uploads list
    const newUpload: UploadProgress = {
      id: uploadId,
      fileName: file.name,
      progress: 0,
      status: 'uploading',
      message: 'Starting upload...',
    };

    setUploads((prev) => [...prev, newUpload]);

    try {
      // Create FormData
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('title', formData.title || file.name);
      formDataUpload.append('description', formData.description);
      formDataUpload.append('visibility', formData.visibility);
      formDataUpload.append(
        'tags',
        JSON.stringify(formData.tags.split(',').map((tag) => tag.trim()))
      );

      // Upload file
      const response = await api.post(endpoints.uploads.video, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setUploads((prev) =>
            prev.map((upload) =>
              upload.id === uploadId
                ? { ...upload, progress, message: `Uploading... ${progress}%` }
                : upload
            )
          );
        },
      });

      const { upload } = response.data;

      // Update status to processing
      setUploads((prev) =>
        prev.map((uploadItem) =>
          uploadItem.id === uploadId
            ? {
                ...uploadItem,
                status: 'processing',
                message: 'Processing video...',
              }
            : uploadItem
        )
      );

      // Poll for processing status
      pollUploadStatus(upload.id, uploadId);
    } catch (error: any) {
      setUploads((prev) =>
        prev.map((uploadItem) =>
          uploadItem.id === uploadId
            ? {
                ...uploadItem,
                status: 'failed',
                message: error.response?.data?.message || 'Upload failed',
              }
            : uploadItem
        )
      );
    }
  };

  const pollUploadStatus = async (uploadId: string, localId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get(endpoints.uploads.status(uploadId));
        const { status, progress, message } = response.data;

        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === localId
              ? { ...upload, progress, status, message }
              : upload
          )
        );

        if (status === 'completed' || status === 'failed') {
          clearInterval(interval);
          if (status === 'completed') {
            // Redirect to video page after a delay
            setTimeout(() => {
              router.push(`/watch/${uploadId}`);
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error polling upload status:', error);
      }
    }, 2000);
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-white mb-2 block">
            Ayinel
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
          <p className="text-purple-200">Share your content with the world</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Video Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white mb-2"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter video title"
              />
            </div>

            <div>
              <label
                htmlFor="visibility"
                className="block text-sm font-medium text-white mb-2"
              >
                Visibility
              </label>
              <select
                id="visibility"
                value={formData.visibility}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    visibility: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="PRIVATE">Private</option>
                <option value="UNLISTED">Unlisted</option>
                <option value="PUBLIC">Public</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Describe your video..."
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-white mb-2"
              >
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="gaming, tutorial, entertainment"
              />
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">
            Upload Video
          </h2>

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-purple-400 bg-purple-500/10'
                : 'border-white/30 hover:border-white/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-purple-200 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              Drop your video here
            </h3>
            <p className="text-purple-200 mb-6">or click to browse files</p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Choose Files
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <p className="text-purple-200 text-sm mt-4">
              Maximum file size: 500MB. Supported formats: MP4, AVI, MOV, WMV,
              FLV, WebM
            </p>
          </div>
        </div>

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">
              Upload Progress
            </h2>

            <div className="space-y-4">
              {uploads.map((upload) => (
                <div key={upload.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium truncate">
                      {upload.fileName}
                    </span>
                    <button
                      onClick={() => removeUpload(upload.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        upload.status === 'completed'
                          ? 'bg-green-500'
                          : upload.status === 'failed'
                            ? 'bg-red-500'
                            : upload.status === 'processing'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                      }`}
                      style={{ width: `${upload.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200">{upload.message}</span>
                    <span className="text-white">{upload.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-white hover:text-purple-900"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
