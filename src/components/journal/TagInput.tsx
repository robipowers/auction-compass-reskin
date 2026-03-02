import { useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  availableTags?: string[];
}

export function TagInput({ tags, onChange, availableTags = [] }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
      }
      setInputValue("");
      setShowSuggestions(false);
    },
    [tags, onChange]
  );

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = availableTags.filter(
    (t) =>
      !tags.includes(t) &&
      t.toLowerCase().includes(inputValue.toLowerCase()) &&
      inputValue.length > 0
  );

  // Default tags to suggest when available tags are empty
  const defaultSuggestions = [
    "Breakout Trade",
    "Trend Following",
    "Reversal",
    "Scalp",
    "Swing",
    "News Event",
    "Pre-Market",
    "High Confidence",
    "Experimental",
  ];

  const suggestions =
    filteredSuggestions.length > 0
      ? filteredSuggestions
      : inputValue.length > 0
      ? defaultSuggestions.filter(
          (t) =>
            !tags.includes(t) &&
            t.toLowerCase().includes(inputValue.toLowerCase())
        )
      : [];

  return (
    <div className="space-y-2">
      {/* Selected Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-0.5 gap-1 cursor-pointer hover:bg-destructive/20"
              onClick={() => removeTag(tag)}
            >
              {tag}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Type tag name and press Enter..."
          className="text-xs h-8"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md max-h-32 overflow-y-auto">
            {suggestions.slice(0, 6).map((suggestion) => (
              <button
                key={suggestion}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors flex items-center gap-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addTag(suggestion);
                }}
              >
                <Plus className="h-3 w-3 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hint */}
      <p className="text-[10px] text-muted-foreground">
        Press Enter or comma to add. New tags are created automatically.
      </p>
    </div>
  );
}
