import React from 'react';
import { Play } from 'lucide-react'; // Ensure you have lucide-react or remove/replace with SVG

const VideoPlayer = ({ videoUrl, title, onComplete }) => {
  
  // Helper: Determine how to render the video based on the URL
  const renderPlayer = () => {
    if (!videoUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-500">
          <div className="p-4 rounded-full bg-stone-800 mb-2">
            <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12L3 12M3 5H21M3 19H21M5 12L5 5M5 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-sm font-medium">Select a lesson to start watching</p>
        </div>
      );
    }

    // 1. Handle Direct Files (.mp4, .webm)
    if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm')) {
      return (
        <video 
          controls 
          className="w-full h-full object-contain bg-black"
          onEnded={onComplete}
          src={videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    // 2. Handle YouTube (Convert standard URL to Embed URL if necessary)
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    // 3. Render Iframe (YouTube, Vimeo, etc.)
    return (
      <iframe
        src={embedUrl}
        title={title || "Video player"}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  };

  return (
    <div className="bg-white p-1 rounded-xl border border-stone-200 shadow-lg">
      
      {/* --- Video Container (16:9 Aspect Ratio) --- */}
      <div className="relative w-full pt-[56.25%] bg-stone-900 rounded-lg overflow-hidden shadow-inner">
        <div className="absolute top-0 left-0 w-full h-full">
          {renderPlayer()}
        </div>
      </div>

      {/* --- Title Bar --- */}
      <div className="px-2 py-3 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-stone-800 leading-tight">
            {title || "Select a video"}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Video Playback
          </p>
        </div>

        {/* Optional Action (e.g., Mark Complete) usually handled by parent, but UI placeholder here */}
        {videoUrl && (
           <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
             <div className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></div>
             Now Playing
           </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;