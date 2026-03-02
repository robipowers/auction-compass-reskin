import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, children, className }) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent",
          className
        )
      }
    >
      {children}
    </RouterNavLink>
  );
};
