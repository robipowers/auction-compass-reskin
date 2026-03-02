import { useState } from 'react';
import { Check, Clock, ChevronRight, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { learningPath, getTotalLearningTime, LearningPathLevel } from '@/data/amt-knowledge-glossary-learning';

interface LearningPathTabProps {
  onArticleClick?: (articleSlug: string) => void;
}

export function LearningPathTab({ onArticleClick }: LearningPathTabProps) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);
  const totalTime = getTotalLearningTime();

  // Mock: track completed articles (in real app, use useReadingHistory)
  const [completedArticles] = useState<Set<string>>(new Set());

  const getProgress = (level: LearningPathLevel) => {
    const completed = level.steps.filter(s => completedArticles.has(s.article_slug)).length;
    return Math.round((completed / level.steps.length) * 100);
  };

  const handleStepClick = (e: React.MouseEvent, articleSlug: string) => {
    e.stopPropagation(); // Don't trigger card collapse
    if (onArticleClick) {
      onArticleClick(articleSlug);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">AMT Learning Path</h2>
        <p className="text-muted-foreground mb-4">
          Follow this structured curriculum to master Auction Market Theory from the ground up.
        </p>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            {learningPath.length} Levels
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {totalTime} total
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {learningPath.map((level) => {
          const isExpanded = expandedLevel === level.level;
          const progress = getProgress(level);
          const isComplete = progress === 100;

          return (
            <Card 
              key={level.level} 
              className={`transition-all cursor-pointer ${
                isExpanded ? 'border-primary' : 'hover:border-primary/50'
              }`}
              onClick={() => setExpandedLevel(isExpanded ? null : level.level)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isComplete 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {isComplete ? <Check className="h-4 w-4" /> : level.level}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{level.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{level.estimated_time}</Badge>
                    <ChevronRight className={`h-5 w-5 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
                <Progress value={progress} className="h-1 mt-3" />
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="border-t border-border pt-4 mt-2 space-y-3">
                    {level.steps.map((step) => {
                      const isDone = completedArticles.has(step.article_slug);
                      return (
                        <div 
                          key={step.order}
                          onClick={(e) => handleStepClick(e, step.article_slug)}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                            isDone 
                              ? 'bg-green-500/10 hover:bg-green-500/15' 
                              : 'bg-secondary/50 hover:bg-primary/10'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                            isDone 
                              ? 'bg-green-500 text-white' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {isDone ? <Check className="h-3 w-3" /> : step.order}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground hover:text-primary transition-colors">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
