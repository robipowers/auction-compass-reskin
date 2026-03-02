import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CoachMessage } from "@/types/auction";

interface TradingCoachProps {
  messages: CoachMessage[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

export function TradingCoach({ messages, onSendMessage, isLoading, disabled = false }: TradingCoachProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    const message = input.trim();
    setInput("");
    await onSendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card variant="premium" className={cn("flex min-h-[600px] h-[70vh] max-h-[800px] flex-col animate-fade-in", disabled && "opacity-50")}>
      <CardHeader className="flex-shrink-0 border-b border-border pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg shadow-[var(--shadow-lg)]",
              disabled 
                ? "bg-secondary shadow-none" 
                : "bg-gradient-to-br from-accent to-success"
            )}>
              <MessageSquare className={cn("h-5 w-5", disabled ? "text-muted-foreground" : "text-accent-foreground")} />
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-foreground">Trading Coach</span>
              {disabled && (
                <span className="text-xs text-muted-foreground">
                  Switch to Live Execution mode to enable
                </span>
              )}
            </div>
          </div>
          {disabled && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide border border-border">
              PREMARKET
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {disabled ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center max-w-xs">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary border border-border">
                  <Bot className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Premarket Mode Active
                </p>
                <p className="mt-1.5 text-sm text-secondary-foreground leading-relaxed">
                  The Trading Coach is available during Live Execution mode only.
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Review your full analysis above, then switch to Live mode when the session begins.
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center max-w-xs">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary border border-border">
                  <Bot className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Describe current price action
                </p>
                <p className="mt-1.5 text-sm text-secondary-foreground leading-relaxed">
                  I'll analyze acceptance, rejection, and validate scenarios
                </p>
                <p className="mt-3 text-sm text-muted-foreground italic">
                  Example: "30 mins below VAL, volume building"
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
                    message.role === "user"
                      ? "bg-primary/15 border border-primary/30"
                      : "bg-accent/15 border border-accent/30"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <Bot className="h-4 w-4 text-accent" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary border border-border text-foreground"
                  )}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 border border-accent/30">
                <Bot className="h-4 w-4 text-accent" />
              </div>
              <div className="rounded-lg bg-secondary border border-border px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="flex-shrink-0 border-t border-border p-4 bg-card"
        >
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? "Switch to Live Execution mode..." : "Describe the current price action..."}
              className="min-h-[48px] max-h-32 resize-none rounded-lg text-sm bg-secondary border-border"
              disabled={isLoading || disabled}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading || disabled}
              className="flex-shrink-0 h-12 w-12 rounded-lg"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}