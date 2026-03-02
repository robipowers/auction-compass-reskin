import { useState } from "react";
import { useMarketData } from "@/contexts/MarketDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit3, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldConfig {
  key: string;
  label: string;
  type: "number" | "text";
  step?: string;
  placeholder?: string;
}

const MARKET_FIELDS: FieldConfig[] = [
  { key: "price", label: "Last Price", type: "number", step: "0.25", placeholder: "4500.00" },
  { key: "open", label: "Open", type: "number", step: "0.25", placeholder: "4498.50" },
  { key: "high", label: "High", type: "number", step: "0.25", placeholder: "4510.00" },
  { key: "low", label: "Low", type: "number", step: "0.25", placeholder: "4492.00" },
  { key: "volume", label: "Volume", type: "number", step: "1", placeholder: "1200000" },
  { key: "vwap", label: "VWAP", type: "number", step: "0.25", placeholder: "4502.75" },
];

export function ManualEntryPanel() {
  const { marketData, updateManualData, isManualMode, setManualMode } = useMarketData();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const updates: Record<string, number | string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          updates[key] = numValue;
        }
      }
    });
    if (Object.keys(updates).length > 0) {
      updateManualData(updates);
    }
    setIsEditing(false);
  };

  const handleReset = () => {
    setFormData({});
    setManualMode(false);
    setIsEditing(false);
  };

  const priceChange = marketData ? marketData.price - marketData.open : 0;
  const priceChangePct = marketData ? (priceChange / marketData.open) * 100 : 0;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-muted-foreground" />
            Manual Data Entry
          </CardTitle>
          <div className="flex items-center gap-2">
            {isManualMode && (
              <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                Manual
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="h-7 px-2 text-xs">
              {isEditing ? "Hide" : "Edit"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {marketData && (
        <CardContent className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold font-mono">{marketData.price.toFixed(2)}</span>
              <div className={cn(
                "flex items-center gap-1 text-sm",
                priceChange > 0 ? "text-success" : priceChange < 0 ? "text-danger" : "text-muted-foreground"
              )}>
                {priceChange > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : priceChange < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                {priceChange > 0 ? "+" : ""}{priceChange.toFixed(2)} ({priceChangePct > 0 ? "+" : ""}{priceChangePct.toFixed(2)}%)
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 gap-1 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3" />
              Reset
            </Button>
          </div>

          {isEditing && (
            <>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-3">
                {MARKET_FIELDS.map(field => (
                  <div key={field.key} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{field.label}</Label>
                    <Input
                      type={field.type}
                      step={field.step}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="h-7 text-sm font-mono"
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleApply} className="w-full mt-3 h-8 text-sm" size="sm">
                Apply Changes
              </Button>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}