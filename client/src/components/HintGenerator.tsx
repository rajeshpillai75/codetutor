import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiPost } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";

interface HintGeneratorProps {
  exerciseId?: string;
  currentCode: string;
  language: string;
  difficulty?: string;
  selectedModel?: "openai" | "llama3";
}

type MascotEmotion = "thinking" | "happy" | "excited" | "confused" | "celebrating" | "idle";

const MascotImage = ({ emotion }: { emotion: MascotEmotion }) => {
  // Enhanced SVG mascot with more emotions and animations
  const fills = {
    thinking: "#FFD166", // warm yellow
    happy: "#06D6A0",    // bright green
    excited: "#118AB2",  // vibrant blue
    confused: "#EF476F", // soft pink
    celebrating: "#8A2BE2", // purple
    idle: "#98C1D9"      // light blue
  };
  
  // Dynamic animation properties based on emotion
  const getAnimationProps = () => {
    switch(emotion) {
      case "thinking":
        return {
          scale: [1, 1.05, 1],
          rotate: 0,
          y: [0, -3, 0],
          transition: {
            scale: { repeat: Infinity, repeatType: "reverse", duration: 1.5 },
            y: { repeat: Infinity, repeatType: "reverse", duration: 1.5 }
          }
        };
      case "confused":
        return {
          scale: 1,
          rotate: [-5, 5, -5, 0],
          transition: { 
            rotate: { repeat: Infinity, repeatType: "reverse", duration: 0.3 } 
          }
        };
      case "excited":
        return {
          scale: [1, 1.1, 1],
          y: [0, -10, 0],
          transition: {
            y: { repeat: Infinity, repeatType: "mirror", duration: 0.6 },
            scale: { repeat: Infinity, repeatType: "mirror", duration: 0.6 }
          }
        };
      case "celebrating":
        return {
          scale: [1, 1.2, 1],
          rotate: [-10, 10, -10, 0],
          transition: {
            scale: { repeat: Infinity, repeatType: "reverse", duration: 0.8 },
            rotate: { repeat: Infinity, repeatType: "reverse", duration: 0.4 }
          }
        };
      case "happy":
        return {
          scale: [1, 1.05, 1],
          rotate: [-2, 2, -2, 0],
          transition: {
            scale: { repeat: Infinity, repeatType: "reverse", duration: 1 },
            rotate: { repeat: Infinity, repeatType: "reverse", duration: 2 }
          }
        };
      default: // idle
        return {
          scale: [1, 1.02, 1],
          y: [0, -2, 0],
          transition: {
            scale: { repeat: Infinity, repeatType: "reverse", duration: 2 },
            y: { repeat: Infinity, repeatType: "reverse", duration: 2 }
          }
        };
    }
  };
  
  const animationProps = getAnimationProps();
  
  return (
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 100 100"
      initial={{ scale: 0.8 }}
      animate={{
        scale: animationProps.scale,
        rotate: animationProps.rotate,
        y: animationProps.y
      }}
      transition={animationProps.transition}
    >
      {/* Body with dynamic shadow */}
      <motion.ellipse 
        cx="50" 
        cy="95" 
        rx="30" 
        ry="5" 
        fill="rgba(0,0,0,0.1)" 
        animate={{ 
          rx: emotion === "excited" || emotion === "celebrating" ? [30, 25, 30] : 30,
          opacity: emotion === "excited" || emotion === "celebrating" ? [0.1, 0.2, 0.1] : 0.1
        }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }}
      />
      
      {/* Main body */}
      <circle cx="50" cy="50" r="40" fill={fills[emotion]} />
      
      {/* Face expressions */}
      {emotion === "thinking" && (
        <>
          {/* Blinking eyes */}
          <motion.circle 
            cx="35" cy="40" r="5" fill="#333" 
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 0.15 }}
          />
          <motion.circle 
            cx="65" cy="40" r="5" fill="#333" 
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 0.15 }}  
          />
          <path d="M40 65 Q50 60 60 65" stroke="#333" strokeWidth="3" fill="none" />
          
          {/* Thinking bubble */}
          <motion.path 
            d="M75 30 Q85 25 90 35" 
            stroke="#333" 
            strokeWidth="3" 
            fill="none"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}  
          />
          <motion.circle 
            cx="95" 
            cy="40" 
            r="3" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          />
        </>
      )}
      
      {emotion === "happy" && (
        <>
          {/* Happy face with blinking eyes */}
          <motion.circle 
            cx="35" cy="40" r="5" fill="#333" 
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.15 }}
          />
          <motion.circle 
            cx="65" cy="40" r="5" fill="#333" 
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.15 }}
          />
          <path d="M35 65 Q50 75 65 65" stroke="#333" strokeWidth="3" fill="none" />
          
          {/* Small hearts */}
          <motion.path 
            d="M85 40 l5 -5 l5 5 l-5 5 z" 
            fill="#FF6B6B" 
            animate={{ y: [0, -10, -20], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          />
          <motion.path 
            d="M20 35 l5 -5 l5 5 l-5 5 z" 
            fill="#FF6B6B" 
            animate={{ y: [0, -10, -20], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </>
      )}
      
      {emotion === "excited" && (
        <>
          {/* Excited face with animated elements */}
          <motion.circle 
            cx="35" cy="40" r="5" fill="#333" 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
          <motion.circle 
            cx="65" cy="40" r="5" fill="#333" 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
          <motion.path 
            d="M35 65 Q50 80 65 65" 
            stroke="#333" 
            strokeWidth="3" 
            fill="none"
            animate={{ d: ["M35 65 Q50 80 65 65", "M35 65 Q50 85 65 65", "M35 65 Q50 80 65 65"] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          
          {/* Sparkles */}
          <motion.path 
            d="M20 25 L30 15" 
            stroke="#FFF" 
            strokeWidth="2"
            animate={{ opacity: [1, 0.5, 1], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.path 
            d="M80 25 L70 15" 
            stroke="#FFF" 
            strokeWidth="2"
            animate={{ opacity: [1, 0.5, 1], rotate: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.circle 
            cx="15" cy="40" r="3" 
            fill="#FFF"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <motion.circle 
            cx="85" cy="40" r="3" 
            fill="#FFF"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.5 }}
          />
        </>
      )}
      
      {emotion === "confused" && (
        <>
          {/* Confused face with animated elements */}
          <motion.circle 
            cx="35" cy="40" r="5" fill="#333" 
            animate={{ y: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.circle 
            cx="65" cy="40" r="5" fill="#333" 
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <path d="M40 65 Q45 60 60 65" stroke="#333" strokeWidth="3" fill="none" />
          
          {/* Confusion symbol */}
          <motion.path 
            d="M70 30 Q80 25 75 35" 
            stroke="#333" 
            strokeWidth="2" 
            fill="none"
            animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <motion.text 
            x="75" y="25" 
            fill="#333" 
            fontSize="12"
            fontWeight="bold"
            animate={{ opacity: [0, 1, 0], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ?
          </motion.text>
        </>
      )}
      
      {emotion === "celebrating" && (
        <>
          {/* Celebrating face with animated elements */}
          <motion.circle 
            cx="35" cy="40" r="5" fill="#333" 
            animate={{ scale: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, repeatDelay: 1.5 }}
          />
          <motion.circle 
            cx="65" cy="40" r="5" fill="#333" 
            animate={{ scale: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, repeatDelay: 1.5 }}
          />
          <motion.path 
            d="M35 65 Q50 85 65 65" 
            stroke="#333" 
            strokeWidth="3" 
            fill="none"
            animate={{ d: ["M35 65 Q50 85 65 65", "M35 65 Q50 90 65 65", "M35 65 Q50 85 65 65"] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          
          {/* Celebration sparkles */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.circle 
              key={angle}
              cx={50 + 45 * Math.cos(angle * Math.PI / 180)} 
              cy={50 + 45 * Math.sin(angle * Math.PI / 180)} 
              r="2"
              fill="#FFD700"
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1.5, 0],
                cx: [
                  50 + 45 * Math.cos(angle * Math.PI / 180),
                  50 + 55 * Math.cos(angle * Math.PI / 180),
                  50 + 45 * Math.cos(angle * Math.PI / 180)
                ],
                cy: [
                  50 + 45 * Math.sin(angle * Math.PI / 180),
                  50 + 55 * Math.sin(angle * Math.PI / 180),
                  50 + 45 * Math.sin(angle * Math.PI / 180)
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                delay: i * 0.2 % 0.8
              }}
            />
          ))}
        </>
      )}
      
      {emotion === "idle" && (
        <>
          {/* Idle face with subtle animations */}
          <motion.circle 
            cx="35" cy="40" r="5" fill="#333" 
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.15 }}
          />
          <motion.circle 
            cx="65" cy="40" r="5" fill="#333" 
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.15 }}
          />
          <motion.path 
            d="M40 60 Q50 65 60 60" 
            stroke="#333" 
            strokeWidth="3" 
            fill="none"
            animate={{ d: ["M40 60 Q50 65 60 60", "M40 60 Q50 67 60 60", "M40 60 Q50 65 60 60"] }}
            transition={{ repeat: Infinity, duration: 3, repeatDelay: 1 }}
          />
        </>
      )}
    </motion.svg>
  );
};

export default function HintGenerator({ 
  exerciseId, 
  currentCode, 
  language, 
  difficulty = "beginner",
  selectedModel = "openai" 
}: HintGeneratorProps) {
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>("idle");
  const [hintLevel, setHintLevel] = useState<number>(1);
  
  // Initialize with idle mascot that transitions to thinking when interacted with
  useEffect(() => {
    // Start with idle mascot
    const idleTimer = setTimeout(() => {
      if (!hint && !loading) {
        setMascotEmotion("idle");
      }
    }, 5000);
    
    return () => clearTimeout(idleTimer);
  }, [hint, loading]);
  
  const generateHint = async () => {
    if (!currentCode) return;
    
    setLoading(true);
    setMascotEmotion("thinking");
    setHint(null);
    
    try {
      const data = await apiPost("/api/ai/generate-hint", {
        code: currentCode,
        language: language === "html-css" ? "html" : language === "react" ? "javascript" : language,
        exerciseId,
        hintLevel,
        difficulty,
        model: selectedModel
      });
      
      setHint(data.hint);
      
      // Different emotions based on hint level for more variety
      if (hintLevel === 3) {
        setMascotEmotion("celebrating"); // Final hint shows celebration
      } else if (hintLevel === 2) {
        setMascotEmotion("excited"); // Second level shows excitement
      } else {
        setMascotEmotion("happy"); // First level shows happiness
      }
    } catch (error) {
      console.error("Error generating hint:", error);
      setMascotEmotion("confused");
    } finally {
      setLoading(false);
    }
  };
  
  const nextHintLevel = () => {
    if (hintLevel < 3) {
      // Show brief thinking animation before getting next hint
      setMascotEmotion("thinking");
      setHintLevel(hintLevel + 1);
      
      // Add small delay for the thinking animation to be visible
      setTimeout(() => {
        generateHint();
      }, 300);
    }
  };
  
  const resetHints = () => {
    setHintLevel(1);
    setHint(null);
    setMascotEmotion("idle");
  };
  
  return (
    <Card className="overflow-hidden relative p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-100 dark:border-blue-900 shadow-md hover:shadow-lg transition-all">
      {/* Animated background elements for added visual interest */}
      <motion.div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200/20 to-blue-200/30 dark:from-yellow-500/10 dark:to-blue-500/10 blur-xl" 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{ repeat: Infinity, duration: 8, repeatType: "mirror" }}
      />
      
      <div className="flex gap-4 items-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={mascotEmotion}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <MascotImage emotion={mascotEmotion} />
            
            {/* Shadow beneath mascot */}
            <motion.div 
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/10 dark:bg-black/20 rounded-full blur-sm" 
              animate={{ 
                width: mascotEmotion === "excited" || mascotEmotion === "celebrating" ? ["4rem", "3rem", "4rem"] : "4rem",
                opacity: mascotEmotion === "excited" || mascotEmotion === "celebrating" ? [0.1, 0.2, 0.1] : 0.1
              }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="flex-1">
          <div className="font-medium mb-1 flex items-center bg-white/50 dark:bg-black/10 p-1.5 rounded-t-lg">
            <motion.div 
              animate={{ rotate: mascotEmotion === "thinking" ? [0, 15, -5, 0] : 0 }}
              transition={{ repeat: mascotEmotion === "thinking" ? Infinity : 0, duration: 1.5 }}
            >
              <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
            </motion.div>
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
              Coding Assistant
            </span>
            
            {!loading && hint && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="ml-auto h-7 text-xs group"
                  onClick={nextHintLevel}
                  disabled={hintLevel >= 3}
                >
                  <span>Next hint</span>
                  <motion.div
                    animate={{ rotate: hintLevel < 3 ? [0, 15, -15, 0] : 0 }}
                    transition={{ repeat: hintLevel < 3 ? Infinity : 0, repeatDelay: 2, duration: 0.5 }}
                  >
                    <Sparkles className="ml-1 h-3 w-3 text-yellow-500 group-hover:text-yellow-400" />
                  </motion.div>
                </Button>
              </motion.div>
            )}
          </div>
          
          <div className="bg-white/70 dark:bg-gray-900/60 p-2 rounded-b-lg min-h-[60px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                  <span>Thinking of a hint...</span>
                </motion.div>
              ) : hint ? (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm"
                >
                  <div className="flex gap-2 items-start mb-2">
                    <motion.div 
                      className="bg-yellow-100 dark:bg-yellow-900/50 rounded-full p-1 text-yellow-700 dark:text-yellow-300"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: 5, repeatDelay: 3, duration: 0.3 }}
                    >
                      <Star className="h-3 w-3" />
                    </motion.div>
                    <span className="text-xs bg-gradient-to-r from-amber-600 to-red-600 dark:from-amber-400 dark:to-red-400 text-transparent bg-clip-text font-medium">
                      Hint level {hintLevel}/3
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {hint}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <motion.div 
                      animate={{ y: [0, -2, 0] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <span className="inline-block text-lg">💡</span>
                    </motion.div>
                    <span>Need help? Get a hint without spoiling the solution.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-3 flex justify-end space-x-2">
            {hint ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 border-gray-200 dark:border-gray-700"
                  onClick={resetHints}
                >
                  Reset
                </Button>
              </motion.div>
            ) : null}
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                variant={hint ? "secondary" : "default"}
                className={`text-xs h-7 ${!hint ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600' : ''}`}
                onClick={generateHint}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Loading...
                  </>
                ) : hint ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    New Hint
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Get Hint
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  );
}