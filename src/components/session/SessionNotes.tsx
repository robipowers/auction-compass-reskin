import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionNote {
  id: string;
  text: string;
  timestamp: Date;
  type: 'observation' | 'trade' | 'general';
}

interface SessionNotesProps {
  className?: string;
}

export function SessionNotes({ className }: SessionNotesProps) {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteType, setNoteType] = useState<SessionNote['type']>('general');

  const addNote = () => {
    if (!currentNote.trim()) return;
    const note: SessionNote = {
      id: Date.now().toString(),
      text: currentNote.trim(),
      timestamp: new Date(),
      type: noteType,
    };
    setNotes(prev => [note, ...prev]);
    setCurrentNote('');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const typeColors: Record<SessionNote['type'], string> = {
    observation: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    trade: 'bg-green-500/10 text-green-400 border-green-500/20',
    general: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          Session Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* Note input */}
        <div className="space-y-2">
          <div className="flex gap-1">
            {(['general', 'observation', 'trade'] as const).map(type => (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                onClick={() => setNoteType(type)}
                className={cn(
                  'h-6 px-2 text-xs capitalize',
                  noteType === type ? 'bg-primary/10 text-primary' : ''
                )}
              >
                {type}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Add a note..."
              className="min-h-[60px] text-xs resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addNote();
                }
              }}
            />
            <Button size="sm" onClick={addNote} className="h-auto py-2">
              <Save className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-auto space-y-2">
          {notes.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No notes yet. Start typing to add a note.
            </p>
          ) : (
            notes.map(note => (
              <div
                key={note.id}
                className={cn(
                  'p-2 rounded-md border text-xs flex gap-2',
                  typeColors[note.type]
                )}
              >
                <div className="flex-1">
                  <p className="text-xs capitalize mb-1 opacity-70">{note.type} • {note.timestamp.toLocaleTimeString()}</p>
                  <p className="leading-relaxed">{note.text}</p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-50 hover:opacity-100 shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
