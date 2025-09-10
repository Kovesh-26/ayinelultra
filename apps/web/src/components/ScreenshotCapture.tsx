'use client';

import React, { useState, useCallback } from 'react';
import { CameraIcon, DownloadIcon, XIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Screenshot {
  id: string;
  dataUrl: string;
  timestamp: Date;
  name: string;
}

interface ScreenshotCaptureProps {
  onScreenshotTaken?: (screenshot: Screenshot) => void;
}

export default function ScreenshotCapture({ onScreenshotTaken }: ScreenshotCaptureProps) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const captureScreenshot = useCallback(async () => {
    try {
      setIsCapturing(true);
      
      // Try to use modern Screen Capture API first
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' }
        });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        video.addEventListener('loadedmetadata', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            
            const screenshot: Screenshot = {
              id: Date.now().toString(),
              dataUrl,
              timestamp: new Date(),
              name: `Screenshot ${new Date().toLocaleString()}`
            };
            
            setScreenshots(prev => [screenshot, ...prev]);
            if (onScreenshotTaken) {
              onScreenshotTaken(screenshot);
            }
          }
          
          // Stop the stream
          stream.getTracks().forEach(track => track.stop());
        });
      } else {
        // Fallback: capture current page using html2canvas-like approach
        const canvas = await captureCurrentPage();
        const dataUrl = canvas.toDataURL('image/png');
        
        const screenshot: Screenshot = {
          id: Date.now().toString(),
          dataUrl,
          timestamp: new Date(),
          name: `Page Screenshot ${new Date().toLocaleString()}`
        };
        
        setScreenshots(prev => [screenshot, ...prev]);
        if (onScreenshotTaken) {
          onScreenshotTaken(screenshot);
        }
      }
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      // Try page capture as fallback
      try {
        const canvas = await captureCurrentPage();
        const dataUrl = canvas.toDataURL('image/png');
        
        const screenshot: Screenshot = {
          id: Date.now().toString(),
          dataUrl,
          timestamp: new Date(),
          name: `Page Screenshot ${new Date().toLocaleString()}`
        };
        
        setScreenshots(prev => [screenshot, ...prev]);
        if (onScreenshotTaken) {
          onScreenshotTaken(screenshot);
        }
      } catch (fallbackError) {
        console.error('Fallback screenshot capture failed:', fallbackError);
      }
    } finally {
      setIsCapturing(false);
    }
  }, [onScreenshotTaken]);

  const captureCurrentPage = async (): Promise<HTMLCanvasElement> => {
    try {
      const canvas = await html2canvas(document.body, {
        backgroundColor: '#0a0f14',
        height: window.innerHeight,
        width: window.innerWidth,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        scale: 0.8,
        foreignObjectRendering: true,
        logging: false
      });
      return canvas;
    } catch (error) {
      console.error('html2canvas failed, using fallback:', error);
      
      // Fallback to simple canvas representation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Set canvas size to viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Fill with dark background (matching the theme)
      ctx.fillStyle = '#0a0f14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add a simple representation
      ctx.fillStyle = '#667eea';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('AYINEL Platform Screenshot', canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.fillStyle = '#764ba2';
      ctx.font = '16px Arial';
      ctx.fillText(`Captured: ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height / 2);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText('Next-gen Creator Platform', canvas.width / 2, canvas.height / 2 + 30);
      
      return canvas;
    }
  };

  const downloadScreenshot = (screenshot: Screenshot) => {
    const link = document.createElement('a');
    link.download = `${screenshot.name}.png`;
    link.href = screenshot.dataUrl;
    link.click();
  };

  const deleteScreenshot = (id: string) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="relative">
      {/* Capture Button */}
      <button
        onClick={captureScreenshot}
        disabled={isCapturing}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <CameraIcon className="w-4 h-4" />
        {isCapturing ? 'Capturing...' : 'Screenshot'}
      </button>

      {/* Gallery Toggle Button */}
      {screenshots.length > 0 && (
        <button
          onClick={() => setShowGallery(!showGallery)}
          className="ml-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-sm font-medium text-purple-300 hover:bg-purple-500/20 transition-colors"
        >
          Gallery ({screenshots.length})
        </button>
      )}

      {/* Screenshot Gallery Modal */}
      {showGallery && screenshots.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
          <div className="bg-gray-900 rounded-xl border border-white/10 p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Screenshots</h2>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screenshots.map((screenshot) => (
                <div key={screenshot.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <img
                    src={screenshot.dataUrl}
                    alt={screenshot.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-medium text-sm mb-1 truncate">
                      {screenshot.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3">
                      {screenshot.timestamp.toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadScreenshot(screenshot)}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <DownloadIcon className="w-3 h-3" />
                        Download
                      </button>
                      <button
                        onClick={() => deleteScreenshot(screenshot.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XIcon className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { Screenshot };