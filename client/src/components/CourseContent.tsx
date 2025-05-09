import { Link } from "wouter";

interface NextVideo {
  id: number;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
}

interface CourseContentProps {
  title: string;
  description: string;
  keyPoints?: string[];
  additionalResources?: { title: string; url: string }[];
  nextVideos?: NextVideo[];
}

export default function CourseContent({
  title,
  description,
  keyPoints = [],
  additionalResources = [],
  nextVideos = []
}: CourseContentProps) {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      <div className="prose max-w-none">
        <p className="mb-3">{description}</p>
        
        {keyPoints.length > 0 && (
          <>
            <h4 className="text-lg font-medium mt-6 mb-2">Key Concepts</h4>
            <ul className="list-disc pl-5 space-y-1">
              {keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </>
        )}
        
        {additionalResources.length > 0 && (
          <>
            <h4 className="text-lg font-medium mt-6 mb-2">Additional Resources</h4>
            <ul className="list-disc pl-5 space-y-1">
              {additionalResources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource.url}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      
      {/* Next Videos in Series */}
      {nextVideos.length > 0 && (
        <div className="mt-8">
          <h4 className="font-medium text-lg mb-3">Next in this Series</h4>
          
          {nextVideos.map((video) => (
            <Link key={video.id} href={`/lessons/${video.id}`}>
              <a className="flex items-center gap-3 mb-3 p-2 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                <div className="relative flex-shrink-0">
                  <img 
                    src={video.thumbnailUrl || `https://i3.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg`} 
                    alt={video.title} 
                    className="w-24 h-14 object-cover rounded" 
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white px-1 text-xs rounded">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <h5 className="font-medium text-sm line-clamp-2">{video.title}</h5>
                  <p className="text-xs text-gray-500">Lesson {video.id} • {Math.floor(Math.random() * 5) + 1}.{Math.floor(Math.random() * 9)}K views</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
