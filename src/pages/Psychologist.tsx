import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TRADING_PSYCH_SYSTEM_PROMPT, SUGGESTION_CATEGORIES } from "@/lib/tradingPsychSystemPrompt";
import { Brain, Send, Plus, MessageSquare, Sparkles, Clock, ChevronRight, Bot, User, AlertTriangle, RefreshCw } from "lucide-react";

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: Date; }
interface Conversation { id: string; title: string; date: Date; messageCount: number; preview: string; }

const INITIAL_MESSAGES: Message[] = [{
  id: "welcome",
  role: "assistant",
  content: "Hey, ready when you are. Whether you're working through a tough session, want to prep mentally for tomorrow, or just need to process something that happened today, I'm here. What's going on?",
  timestamp: new Date(),
}];

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "today", title: "Today's Session", date: new Date(), messageCount: 1, preview: "Welcome back. I'm your AI Trading Psychologist..." },
  { id: "yesterday", title: "Fear Tilt Deep Dive", date: new Date(Date.now() - 86400000), messageCount: 12, preview: "You're describing Fear Tilt, specifically..." },
  { id: "lastweek", title: "A-Game / C-Game Mapping", date: new Date(Date.now() - 86400000 * 5), messageCount: 8, preview: "Your B-Game triggers are becoming clear..." },
];

async function* parseSSEStream(response: Response): AsyncGenerator<string> {
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch { /* skip malformed JSON */ }
      }
    }
  }
}

function renderInlineMarkdown(text: string) {
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[2]) parts.push(<strong key={key++} className="font-semibold text-foreground">{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={key++}>{match[3]}</em>);
    else if (match[4]) parts.push(<code key={key++} className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{match[4]}</code>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : text;
}

export default function Psychologist() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState("today");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [lastFailedInput, setLastFailedInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = useCallback(async (messageText: string) => {
    const userMessage: Message = { id: `user-${Date.now()}`, role: "user", content: messageText.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setAiError(false);

    const apiMessages = [
      { role: "system" as const, content: TRADING_PSYCH_SYSTEM_PROMPT },
      ...messages.filter(m => m.id !== "welcome").map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: messageText.trim() },
    ];

    const aiMessageId = `ai-${Date.now()}`;

    try {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      setMessages((prev) => [...prev, { id: aiMessageId, role: "assistant", content: "", timestamp: new Date() }]);

      let fullContent = '';
      for await (const chunk of parseSSEStream(response)) {
        fullContent += chunk;
        const currentContent = fullContent;
        setMessages((prev) => prev.map((m) => m.id === aiMessageId ? { ...m, content: currentContent } : m));
      }
      setIsTyping(false);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Chat error:', err);
      setIsTyping(false);
      setAiError(true);
      setLastFailedInput(messageText);
    }
  }, [messages]);

  const handleSend = () => { if (!input.trim() || isTyping) return; sendMessage(input); };
  const handleRetry = () => { if (lastFailedInput) { setAiError(false); sendMessage(lastFailedInput); } };
  const handleNewConversation = () => {
    const newConv: Conversation = { id: `conv-${Date.now()}`, title: "New Conversation", date: new Date(), messageCount: 0, preview: "" };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversation(newConv.id);
    setMessages([INITIAL_MESSAGES[0]]);
  };
  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <main className="container mx-auto px-4 py-6 h-[calc(100vh-5rem)]">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="w-full md:w-72 md:flex-shrink-0">
          <Card className="h-full border-border/50 flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><Brain className="h-5 w-5 text-primary" />AI Psychologist</CardTitle>
                <Button size="icon" variant="ghost" onClick={handleNewConversation}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {conversations.map((conv) => (
                  <button key={conv.id} onClick={() => setActiveConversation(conv.id)}
                    className={cn("w-full text-left p-3 rounded-lg transition-all text-sm", activeConversation === conv.id ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/50")}>
                    <div className="flex items-center gap-2 mb-1"><MessageSquare className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-medium truncate flex-1">{conv.title}</span></div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{conv.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span>• {conv.messageCount} messages</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        <Card className="flex-1 border-border/50 flex flex-col min-h-0">
          <CardHeader className="pb-3 flex-shrink-0 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-purple-500 flex items-center justify-center"><Brain className="h-5 w-5 text-white" /></div>
                <div>
                  <h2 className="font-semibold">Trading Psychologist</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />GPT-4o • Steenbarger + Douglas + Shull + Tendler</p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1"><Sparkles className="h-3 w-3" /> Live AI</Badge>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
                  <div className={cn("h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1", msg.role === "assistant" ? "bg-gradient-to-br from-primary/60 to-purple-500/60" : "bg-secondary")}>
                    {msg.role === "assistant" ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-foreground" />}
                  </div>
                  <div className={cn("max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed", msg.role === "assistant" ? "bg-secondary/50 border border-border/50" : "bg-primary/15 border border-primary/30")}>
                    {msg.content.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) return (<p key={i} className="font-semibold text-foreground my-1">{line.replace(/\*\*/g, "")}</p>);
                      if (line.startsWith("- ") || line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.")) return (<p key={i} className="ml-2 my-0.5">{line}</p>);
                      if (line.trim() === "") return <br key={i} />;
                      return <p key={i} className="my-0.5">{line}</p>;
                    })}
                    {msg.content === "" && isTyping && (<div className="flex gap-1"><span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} /><span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} /><span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} /></div>)}
                    {msg.content !== "" && (<span className="text-[10px] text-muted-foreground block mt-2">{formatTime(msg.timestamp)}</span>)}
                  </div>
                </div>
              ))}

              {isTyping && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/60 to-purple-500/60 flex items-center justify-center"><Bot className="h-4 w-4 text-white" /></div>
                  <div className="bg-secondary/50 border border-border/50 rounded-xl px-4 py-3">
                    <div className="flex gap-1"><span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} /><span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} /><span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} /></div>
                  </div>
                </div>
              )}

              {aiError && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center"><AlertTriangle className="h-4 w-4 text-destructive" /></div>
                  <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 max-w-[80%]">
                    <p className="text-sm font-medium text-destructive mb-1">AI Psychologist is temporarily unavailable</p>
                    <p className="text-xs text-muted-foreground mb-3">Please try again in a few minutes. Check that your OpenAI API key is valid.</p>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleRetry}><RefreshCw className="h-3 w-3" /> Retry</Button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border/50 flex-shrink-0">
            <div className="flex gap-2 mb-3 flex-wrap">
              {[...SUGGESTION_CATEGORIES.emotional.slice(0, 2), ...SUGGESTION_CATEGORIES.performance.slice(0, 1), ...SUGGESTION_CATEGORIES.framework.slice(0, 1)].map((suggestion) => (
                <Button key={suggestion} variant="outline" size="sm" className="text-xs h-7" onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}>
                  <ChevronRight className="h-3 w-3 mr-1" />{suggestion}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input ref={inputRef} placeholder="Ask about your trading patterns, emotions, or performance..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} disabled={isTyping} className="flex-1" />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping} size="icon"><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
