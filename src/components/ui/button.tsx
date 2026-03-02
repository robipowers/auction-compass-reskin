import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[var(--shadow-md)] hover:brightness-110 active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground shadow-[var(--shadow-sm)] hover:brightness-110",
        outline: "border border-primary/50 bg-transparent text-primary shadow-[var(--shadow-sm)] hover:bg-primary/10 hover:border-primary",
        secondary: "bg-secondary text-secondary-foreground shadow-[var(--shadow-sm)] hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]",
        success: "bg-success text-success-foreground shadow-[var(--shadow-md)] hover:brightness-110",
        warning: "bg-warning text-warning-foreground shadow-[var(--shadow-sm)] hover:brightness-110",
        glass: "backdrop-blur-xl bg-secondary/50 border border-border hover:bg-secondary/70 text-foreground",
        premium: "bg-gradient-to-r from-primary via-primary to-[hsl(280,60%,55%)] text-primary-foreground shadow-[var(--shadow-lg)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-11 rounded-md px-6",
        xl: "h-12 rounded-lg px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
