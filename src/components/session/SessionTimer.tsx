import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionTimerProps {
  onStart?: () => void;
  onPause?: () => void;
  onStop?: (duration: number) => void;
  className?: string;
}

export function SessionTimer({ onStart, onPause, onStop, className }: SessionTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(new Date());
    onStart?.();
  }, [onStart]);

  const handlePause = useCallback(() => {
    setIsPaused(!isPaused);
    onPause?.();
  }, [isPaused, onPause]);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    onStop?.(elapsed);
    setElapsed(0);
    setStartTime(null);
  }, [elapsed, onStop]);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className='flex items-center gap-1.5'>
        <Clock className='h-4 w-4 text-muted-foreground' />
        <span className={cn(
          'font-mono text-lg font-semibold tabular-nums',
          isRunning && !isPaused ? 'text-primary' : 'text-muted-foreground'
        )}>
          {formatTime(elapsed)}
        </span>
      </div>

      {!isRunning ? (
        <Button size='sm' variant='outline' onClick={handleStart} className='h-7 px-2'>
          <Play className='h-3 w-3' />
        </Button>
      ) : (
        <>
          <Button size='sm' variant='outline' onClick={handlePause} className='h-7 px-2'>
            {isPaused ? <Play className='h-3 w-3' /> : <Pause className='h-3 w-3' />}
          </Button>
          <Button size='sm' variant='outline' onClick={handleStop} className='h-7 px-2'>
            <Square className='h-3 w-3' />
          </Button>
        </>
      )}

      {isRunning && (
        <Badge variant={isPaused ? 'secondary' : 'default'} className='text-xs'>
          {isPaused ? 'PAUSED' : 'LIVE'}
        </Badge>
      )}
    </div>
  );
}
