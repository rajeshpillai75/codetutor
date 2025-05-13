import { useState } from "react";
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

type MascotEmotion = "thinking" | "happy" | "excited" | "confused";

const MascotImage = ({ emotion }: { emotion: MascotEmotion }) => {
  // Simple SVG mascot with different emotions
  const fills = {
    thinking: "#FFD166",
    happy: "#06D6A0",
    excited: "#118AB2", 
    confused: "#EF476F"
  };
  
  return (
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 100 100"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1, rotate: emotion === "confused" ? [-5, 5, -5, 0] : 0 }}
      transition={{ 
        duration: 0.5,
        rotate: { repeat: emotion === "confused" ? Infinity : 0, repeatType: "reverse", duration: 0.2 }  
      }}
    >
      {/* Body */}
      <circle cx="50" cy="50" r="40" fill={fills[emotion]} />
      
      {/* Face */}
      {emotion === "thinking" && (
        <>
          {/* Thinking face */}
          <circle cx="35" cy="40" r="5" fill="#333" />
          <circle cx="65" cy="40" r="5" fill="#333" />
          <path d="M40 65 Q50 60 60 65" stroke="#333" strokeWidth="3" fill="none" />
          <path d="M75 30 Q85 25 90 35" stroke="#333" strokeWidth="3" fill="none" />
        </>
      )}
      
      {emotion === "happy" && (
        <>
          {/* Happy face */}
          <circle cx="35" cy="40" r="5" fill="#333" />
          <circle cx="65" cy="40" r="5" fill="#333" />
          <path d="M35 65 Q50 75 65 65" stroke="#333" strokeWidth="3" fill="none" />
        </>
      )}
      
      {emotion === "excited" && (
        <>
          {/* Excited face */}
          <circle cx="35" cy="40" r="5" fill="#333" />
          <circle cx="65" cy="40" r="5" fill="#333" />
          <path d="M35 65 Q50 80 65 65" stroke="#333" strokeWidth="3" fill="none" />
          <path d="M20 25 L30 15" stroke="#FFF" strokeWidth="2" />
          <path d="M80 25 L70 15" stroke="#FFF" strokeWidth="2" />
        </>
      )}
      
      {emotion === "confused" && (
        <>
          {/* Confused face */}
          <circle cx="35" cy="40" r="5" fill="#333" />
          <circle cx="65" cy="40" r="5" fill="#333" />
          <path d="M40 65 Q45 60 60 65" stroke="#333" strokeWidth="3" fill="none" />
          <path d="M70 30 Q80 25 75 35" stroke="#333" strokeWidth="2" fill="none" />
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
  const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>("thinking");
  const [hintLevel, setHintLevel] = useState<number>(1);
  
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
      setMascotEmotion(hintLevel > 2 ? "excited" : "happy");
    } catch (error) {
      console.error("Error generating hint:", error);
      setMascotEmotion("confused");
    } finally {
      setLoading(false);
    }
  };
  
  const nextHintLevel = () => {
    if (hintLevel < 3) {
      setHintLevel(hintLevel + 1);
      generateHint();
    }
  };
  
  const resetHints = () => {
    setHintLevel(1);
    setHint(null);
  };
  
  return (
    <Card className="overflow-hidden relative p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-100 dark:border-blue-900">
      <div className="flex gap-4 items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={mascotEmotion}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MascotImage emotion={mascotEmotion} />
          </motion.div>
        </AnimatePresence>
        
        <div className="flex-1">
          <div className="font-medium text-sm mb-1 flex items-center">
            <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
            <span>Coding Assistant</span>
            
            {!loading && hint && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="ml-auto h-7 text-xs"
                onClick={nextHintLevel}
                disabled={hintLevel >= 3}
              >
                Next hint <Sparkles className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <RefreshCw className="h-4 w-4 animate-spin" />
                Thinking of a hint...
              </motion.div>
            ) : hint ? (
              <motion.div
                key="hint"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                <div className="flex gap-2 items-start mb-1">
                  <div className="bg-yellow-100 dark:bg-yellow-900/50 rounded-full p-1 text-yellow-700 dark:text-yellow-300">
                    <Star className="h-3 w-3" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Hint level {hintLevel}/3
                  </span>
                </div>
                {hint}
              </motion.div>
            ) : (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-muted-foreground"
              >
                Need help? Get a hint without spoiling the solution.
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-3 flex justify-end">
            {hint ? (
              <Button
                size="sm"
                variant="outline"
                className="mr-2 text-xs h-7"
                onClick={resetHints}
              >
                Reset
              </Button>
            ) : null}
            
            <Button
              size="sm"
              variant={hint ? "secondary" : "default"}
              className="text-xs h-7"
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
          </div>
        </div>
      </div>
    </Card>
  );
}