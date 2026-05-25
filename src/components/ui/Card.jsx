import { twMerge } from "tailwind-merge";

export function Card({ children, className }) {
  return (
    <div className={twMerge(
      "bg-surface border-2 border-border rounded-xl p-6",
      className
    )}>
      {children}
    </div>
  );
}
