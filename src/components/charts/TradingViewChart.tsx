import { useEffect, useRef, memo } from "react";
import { cn } from "@/lib/utils";

// TradingView widget types
declare global {
  interface Window {
    TradingView: {
      widget: new (config: object) => void;
    };
  }
}

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: "light" | "dark";
  height?: number;
  width?: string;
  className?: string;
  containerId?: string;
}

export const TradingViewChart = memo(function TradingViewChart({
  symbol = "CME_MINI:ES1!",
  interval = "5",
  theme = "dark",
  height = 400,
  width = "100%",
  className,
  containerId = `tradingview-${Math.random().toString(36).slice(2)}`,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initWidget = () => {
      if (!containerRef.current || !window.TradingView) return;

      // Clear existing content
      containerRef.current.innerHTML = '';

      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval,
        timezone: "America/Chicago",
        theme,
        style: "1",
        locale: "en",
        toolbar_bg: theme === "dark" ? "#0a0a0a" : "#f4f4f4",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
        studies: ["Volume@tv-basicstudies"],
        show_popup_button: false,
        hide_side_toolbar: false,
      });
    };

    // Check if TradingView is already loaded
    if (window.TradingView) {
      initWidget();
      return;
    }

    // Load TradingView script
    const existingScript = document.querySelector('script[src*="tradingview"]');
    if (existingScript) {
      existingScript.addEventListener('load', initWidget);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = initWidget;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [symbol, interval, theme, containerId]);

  return (
    <div
      id={containerId}
      ref={containerRef}
      style={{ height: `${height}px`, width }}
      className={cn("rounded-md overflow-hidden", className)}
    />
  );
});
