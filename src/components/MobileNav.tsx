import React, { useState } from "react";
import { NavLink } from "./NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

interface MobileNavProps {
  items: NavItem[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-10 z-50 w-48 rounded-md border bg-card shadow-lg">
          <div className="flex flex-col p-2">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
