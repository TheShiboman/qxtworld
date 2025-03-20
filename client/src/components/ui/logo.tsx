import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative z-50", className)}>
      <img 
        src="/QXT World Logo.png" 
        alt="QXT World"
        className="h-16 w-auto transform -translate-y-2"
      />
    </div>
  );
}
