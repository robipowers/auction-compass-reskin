import { Link, useLocation } from "react-router-dom";
import { BarChart3, History, Home, TrendingUp, Settings, BookOpen, Bell, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { ExecutionModeToggle } from "@/components/ExecutionModeToggle";
import { DisconnectionBanner } from "@/components/DisconnectionBanner";
import { useMarketData } from "@/contexts/MarketDataContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/workspace", label: "Workspace", icon: BarChart3 },
  { to: "/journal", label: "Journal", icon: Brain },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/alert-history", label: "History", icon: History },
  { to: "/knowledge", label: "Knowledge", icon: BookOpen },
];

export function Header() {
  const { pathname } = useLocation();
  const { connectionStatus } = useMarketData();

  return (
    <>
      <DisconnectionBanner isConnected={connectionStatus === 'connected'} />
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-semibold shrink-0">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold tracking-tight">Auction Compass</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  pathname === to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2 ml-auto">
            <ExecutionModeToggle />
            <ConnectionStatus />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
