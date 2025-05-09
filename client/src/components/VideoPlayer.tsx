import { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
}

export default function VideoPlayer({ videoUrl, title, thumbnailUrl }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Reset state when video URL changes
    setIsLoading(true);
    setIsPlaying(false);
    setVideoError(false);
  }, [videoUrl]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleReady = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setVideoError(true);
  };

  // Extract video ID from YouTube URL
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(videoUrl);
  
  // Create a thumbnail URL if one isn't provided
  const defaultThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
  const displayThumbnail = thumbnailUrl || defaultThumbnail;

  return (
    <div className="aspect-video bg-dark relative">
      {isLoading && !isPlaying && (
        <>
          <img 
            src={displayThumbnail} 
            alt={title} 
            className="w-full h-full object-cover opacity-60"
            onError={() => setVideoError(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg hover:bg-opacity-100 transition-all"
              onClick={handlePlay}
            >
              <i className="ri-play-fill text-2xl text-primary"></i>
            </button>
          </div>
        </>
      )}
      
      {videoError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <i className="ri-error-warning-line text-3xl mb-2"></i>
          <p className="text-center px-4">Unable to load video. Please check your connection or try again later.</p>
        </div>
      )}
      
      {!videoError && (
        <div className={`w-full h-full ${isLoading && !isPlaying ? 'invisible' : 'visible'}`}>
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            playing={isPlaying}
            controls={isPlaying}
            onReady={handleReady}
            onError={handleError}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
