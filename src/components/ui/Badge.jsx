import { twMerge } from "tailwind-merge";

export function Badge({ children, className, variant = "default" }) {
  const variants = {
    default: "bg-surface-hover text-text border-border",
    primary: "bg-primary text-primary-fg border-primary",
    accent: "bg-accent/10 text-accent border-accent/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    danger: "bg-danger/10 text-danger border-danger/20",
  };
  
  return (
    <span className={twMerge(
      "border-2 rounded-md px-2.5 py-0.5 text-[11px] font-bold transition-colors tracking-wide",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
