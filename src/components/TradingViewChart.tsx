import { useEffect, useRef, memo } from "react";

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
}

const TradingViewChart = memo(function TradingViewChart({
  symbol = "CME_MINI:ES1!",
  interval = "5",
  theme = "dark",
  height = 400,
  width = "100%",
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<object | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol,
          interval,
          timezone: "America/Chicago",
          theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#0a0a0a",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          studies: ["Volume@tv-basicstudies"],
          show_popup_button: true,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [symbol, interval, theme]);

  return (
    <div
      id="tradingview-widget"
      ref={containerRef}
      style={{ height: `${height}px`, width }}
      className="rounded-md overflow-hidden"
    />
  );
});

export { TradingViewChart };
