import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg rounded-2xl p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
