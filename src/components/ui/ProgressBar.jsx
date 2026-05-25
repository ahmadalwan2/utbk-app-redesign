import { twMerge } from "tailwind-merge";

export function ProgressBar({ value, max, className, indicatorClassName }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={twMerge("bg-surface-hover rounded-full h-1.5 overflow-hidden", className)}>
      <div 
        className={twMerge("bg-primary h-full rounded-full transition-all duration-500 ease-out", indicatorClassName)} 
        style={{ width: `${pct}%` }} 
      />
    </div>
  );
}
