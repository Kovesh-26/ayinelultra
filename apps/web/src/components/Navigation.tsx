"use client";
import { Bell, Upload, Search, ChevronDown, Image, Video, Music } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navigation() {
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-700/60 bg-gray-900/70 backdrop-blur">
      <div className="mx-auto max-w-[1200px] px-5 h-16 flex items-center gap-4">
        {/* LEFT: brand */}
        <Logo withWordmark size={32} />

        {/* CENTER: search */}
        <div className="flex-1 max-w-[640px]">
          <div className="relative">
            <input
              placeholder="Search Ayinel..."
              className="w-full bg-gray-800 border border-gray-600 rounded-xl h-10 pl-10 pr-4 outline-none focus:ring-2 focus:ring-cyan-400/40 text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* RIGHT: actions */}
        <nav className="flex items-center gap-2">
          <Link
            href="/create"
            className="inline-flex items-center px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] hover:from-[#6d28d9] hover:to-[#0891b2] transition-all duration-200"
          >
            Create
          </Link>
          
          {/* Upload Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className="h-10 w-10 grid place-items-center rounded-xl bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              <Upload className="h-5 w-5" />
            </button>
            
            {showUploadMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-50">
                <div className="py-2">
                  <Link
                    href="/upload/image"
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setShowUploadMenu(false)}
                  >
                    <Image className="h-5 w-5 mr-3 text-purple-400" />
                    <div>
                      <div className="font-medium">Upload Image</div>
                      <div className="text-sm text-gray-400">Share your photos and artwork</div>
                    </div>
                  </Link>
                  <Link
                    href="/upload/video"
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setShowUploadMenu(false)}
                  >
                    <Video className="h-5 w-5 mr-3 text-blue-400" />
                    <div>
                      <div className="font-medium">Upload Video</div>
                      <div className="text-sm text-gray-400">Share your video content</div>
                    </div>
                  </Link>
                  <div className="flex items-center px-4 py-3 text-gray-500 cursor-not-allowed">
                    <Music className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <div className="font-medium">Upload Music</div>
                      <div className="text-sm text-gray-500">Coming soon</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="h-10 w-10 grid place-items-center rounded-xl bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gray-800 border border-gray-600 grid place-items-center text-white">
            🧑
          </div>
        </nav>
      </div>
      
      {/* Overlay to close dropdown */}
      {showUploadMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUploadMenu(false)}
        />
      )}
    </header>
  );
}
