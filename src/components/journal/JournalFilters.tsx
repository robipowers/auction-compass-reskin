import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import type { JournalFilters as JournalFiltersType, Emotion, TradeDirection } from "@/types/journal";
import { EMOTIONS } from "@/types/journal";

interface JournalFiltersProps {
  filters: JournalFiltersType;
  onFiltersChange: (filters: JournalFiltersType) => void;
  instruments: string[];
}

export function JournalFilters({ filters, onFiltersChange, instruments }: JournalFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  );

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant={isOpen ? "secondary" : "outline"}
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-secondary/30 rounded-lg border border-border/50">
          <div>
            <label className="text-xs uppercase text-muted-foreground mb-1 block">Date From</label>
            <Input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value || undefined })}
              className="h-9 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground mb-1 block">Date To</label>
            <Input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value || undefined })}
              className="h-9 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground mb-1 block">Instrument</label>
            <Select
              value={filters.instruments?.[0] || "all"}
              onValueChange={(v) =>
                onFiltersChange({ ...filters, instruments: v === "all" ? undefined : [v] })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instruments</SelectItem>
                {instruments.map((inst) => (
                  <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground mb-1 block">Direction</label>
            <Select
              value={filters.direction || "all"}
              onValueChange={(v) =>
                onFiltersChange({ ...filters, direction: v === "all" ? undefined : (v as TradeDirection) })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Directions</SelectItem>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="short">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground mb-1 block">Emotion</label>
            <Select
              value={filters.emotions?.[0] || "all"}
              onValueChange={(v) =>
                onFiltersChange({ ...filters, emotions: v === "all" ? undefined : [v as Emotion] })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Emotions</SelectItem>
                {[...EMOTIONS.positive, ...EMOTIONS.negative, ...EMOTIONS.neutral].map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground mb-1 block">Plan Followed</label>
            <Select
              value={filters.followedPlan === undefined ? "all" : filters.followedPlan ? "yes" : "no"}
              onValueChange={(v) =>
                onFiltersChange({
                  ...filters,
                  followedPlan: v === "all" ? undefined : v === "yes",
                })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
