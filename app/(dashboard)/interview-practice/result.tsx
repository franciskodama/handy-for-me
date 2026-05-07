import { Flame, Lightbulb, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Result({
  result,
  handleResetAll,
  handleNextQuestion,
  timeRemaining
}: {
  result: any;
  handleResetAll: () => void;
  handleNextQuestion: () => void;
  timeRemaining: number;
}) {
  const [fontSize, setFontSize] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
  }, [result]);

  return (
    <div className="relative stripe-border flex flex-col w-full items-center min-h-[400px]">
      {result ? (
        <div className="flex flex-col items-center w-full px-8 py-4">
          <div className="flex gap-4 mb-12">
            <Button
              className="text-xl h-8 w-8 p-0"
              variant="ghost"
              onClick={() => setFontSize(fontSize + 4)}
            >
              +
            </Button>
            <Button
              className="text-xl h-8 w-8 p-0"
              variant="ghost"
              onClick={() => setFontSize(fontSize - 4)}
            >
              -
            </Button>
          </div>

          <div className="flex flex-col items-center py-12">
            <p className="text-sm font-bold uppercase text-muted-foreground">
              {result.category}
            </p>

            <p
              className="font-semibold text-primary text-center my-8 leading-tight transition-all duration-300"
              style={{ fontSize: `${fontSize}px` }}
            >
              {result.question}
            </p>

            <div className="flex flex-col items-center gap-4 w-full mt-8">
              {!showAnswer && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowAnswer(true)}
                >
                  Reveal Answer
                </Button>
              )}

              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-muted/50 p-6 border border-primary/20 mt-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="text-yellow-500" size={20} />
                      <p className="font-bold text-sm uppercase tracking-wider">
                        Suggested Answer
                      </p>
                    </div>
                    <p className="text-lg text-foreground/90 leading-relaxed italic">
                      &quot;{result.answer}&quot;
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-12 text-muted-foreground hover:text-primary"
            onClick={handleNextQuestion}
          >
            Next Question
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-center items-center px-12 py-24 leading-tight text-center w-full gap-6">
          <div className="flex items-center gap-3">
            <p className="font-bold text-3xl sm:text-4xl text-primary">
              Ready to Practice?
            </p>
            <Flame size={40} className="text-orange-500 animate-bounce" />
          </div>
          <div className="max-w-md text-muted-foreground">
            <p className="text-lg">
              Pick a category or challenge yourself with a lucky choice.
            </p>
            <p className="text-sm mt-2 opacity-70">
              The clock starts automatically. Focus on structure and clarity!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
