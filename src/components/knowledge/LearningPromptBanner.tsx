import { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LearningPromptBannerProps {
  context: 'plan' | 'session' | 'journal';
  className?: string;
}

const DISMISSED_KEY = 'learning_prompt_dismissed';

export function LearningPromptBanner({ context, className }: LearningPromptBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIsDismissed(true);
  };

  const handleStartLearning = () => {
    navigate('/knowledge');
  };

  if (isDismissed) return null;

  const messages = {
    plan: {
      title: 'New to AMT? Learn the basics first',
      description: 'Before creating your first plan, learn about Value Area and POC to make better trading decisions.'
    },
    session: {
      title: 'Understand market context better',
      description: 'Learn how to interpret balance vs imbalance to improve your live session decisions.'
    },
    journal: {
      title: 'Review AMT concepts while journaling',
      description: 'Understanding initiative vs responsive activity helps identify what worked in your trades.'
    }
  };

  const { title, description } = messages[context];

  return (
    <div 
      className={cn(
        "relative bg-gradient-to-r from-primary to-primary/80 rounded-lg p-5 mb-6 flex items-center gap-4",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 shrink-0">
        <Lightbulb className="h-6 w-6 text-primary-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-primary-foreground mb-1">
          {title}
        </h3>
        <p className="text-sm text-primary-foreground/90">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button
          onClick={handleStartLearning}
          className="bg-white text-primary hover:bg-white/90 font-semibold"
        >
          Start Learning
        </Button>
        <Button
          variant="ghost"
          onClick={handleDismiss}
          className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
        >
          Skip for now
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDismiss}
        className="absolute top-2 right-2 h-6 w-6 text-primary-foreground/60 hover:text-primary-foreground hover:bg-transparent"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
