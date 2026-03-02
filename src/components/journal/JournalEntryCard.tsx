import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Link as LinkIcon, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { JournalEntryWithDetails, Emotion } from "@/types/journal";



interface JournalEntryCardProps {
  entry: JournalEntryWithDetails;
  onEdit?: (entry: JournalEntryWithDetails) => void;
  onDelete?: (id: string) => void;
}

export function JournalEntryCard({ entry, onEdit, onDelete }: JournalEntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pnl = entry.pnl_dollars ?? 0;
  const isPositive = pnl >= 0;
  const allEmotions = [
    ...(entry.pre_trade_emotion || []),
    ...(entry.during_trade_emotion || []),
    ...(entry.post_trade_emotion || []),
  ];
  const uniqueEmotions = [...new Set(allEmotions)];

  const tradeDate = new Date(entry.trade_date);
  const formattedDate = tradeDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = tradeDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card
      className={cn(
        "border-border/50 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md",
        isExpanded && "border-primary/30"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">
              {formattedDate} • {formattedTime}
            </span>
            <span className="text-sm text-muted-foreground">{entry.instrument}</span>
            {entry.direction && (
              <Badge
                variant="outline"
                className={cn(
                  entry.direction === "long"
                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                    : "bg-red-500/20 text-red-400 border-red-500/50"
                )}
              >
                {entry.direction === "long" ? (
                  <><TrendingUp className="h-3 w-3 mr-1" />LONG</>
                ) : (
                  <><TrendingDown className="h-3 w-3 mr-1" />SHORT</>
                )}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-lg font-bold", isPositive ? "text-green-400" : "text-red-400")}>
              {isPositive ? "+" : "-"}${Math.abs(pnl).toFixed(2)}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Emotions + Plan Link */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {uniqueEmotions.slice(0, 5).map((emotion) => (
              <span
                key={emotion}
                className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground"
              >
                {emotion}
              </span>
            ))}
            {uniqueEmotions.length > 5 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{uniqueEmotions.length - 5} more
              </span>
            )}
          </div>
          {entry.auction_plan_id && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <LinkIcon className="h-3 w-3" />
              <span className="text-primary font-medium">Linked to plan</span>
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4" onClick={(e) => e.stopPropagation()}>
            {/* Trade Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs uppercase mb-1">Entry Price</div>
                <div className="font-mono font-medium">{entry.entry_price ?? "-"}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs uppercase mb-1">Exit Price</div>
                <div className="font-mono font-medium">{entry.exit_price ?? "-"}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs uppercase mb-1">P&L (Pips)</div>
                <div className="font-mono font-medium">{entry.pnl_pips ?? "-"}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs uppercase mb-1">Plan Followed</div>
                <div className="font-medium">
                  {entry.followed_plan === true ? "Yes" : entry.followed_plan === false ? "No" : "-"}
                </div>
              </div>
            </div>

            {/* Emotional Tracking */}
            {(entry.pre_trade_emotion?.length > 0 || entry.during_trade_emotion?.length > 0 || entry.post_trade_emotion?.length > 0) && (
              <div className="space-y-2">
                <div className="text-xs uppercase text-muted-foreground font-medium">Emotions</div>
                {entry.pre_trade_emotion?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16">Pre:</span>
                    <div className="flex gap-1 flex-wrap">
                      {entry.pre_trade_emotion.map((e) => (
                        <span key={e} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-xs">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.during_trade_emotion?.length > 0 && (
  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16">During:</span>
                    <div className="flex gap-1 flex-wrap">
                      {entry.during_trade_emotion.map((e) => (
                        <span key={e} className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full text-xs">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.post_trade_emotion?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16">Post:</span>
                    <div className="flex gap-1 flex-wrap">
                      {entry.post_trade_emotion.map((e) => (
                        <span key={e} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-xs">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reflection */}
            {(entry.what_went_well || entry.what_to_improve || entry.lesson_learned) && (
              <div className="space-y-2">
                <div className="text-xs uppercase text-muted-foreground font-medium">Reflection</div>
                {entry.what_went_well && (
                  <div className="text-sm"><span className="text-green-400 font-medium"></span>{entry.what_went_well}</div>
                )}
                {entry.what_to_improve && (
                  <div className="text-sm"><span className="text-yellow-400 font-medium">△ </span>{entry.what_to_improve}</div>
                )}
                {entry.lesson_learned && (
                  <div className="text-sm"><span className="text-blue-400 font-medium"></span>{entry.lesson_learned}</div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {onEdit && (
                <Button size="sm" variant="outline" onClick={() => onEdit(entry)}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300" onClick={() => onDelete(entry.id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
