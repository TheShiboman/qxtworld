import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function Nav({ className }: { className?: string }) {
  return (
    <nav className={cn(
      "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10", 
      className
    )}>
      <div className="flex h-16 items-center px-4 relative">
        <div className="absolute left-4 -top-4 transform">
          <Logo />
        </div>
        <div className="flex-1" /> {/* This pushes other content to the right */}
        {/* Rest of the navigation content */}
      </div>
    </nav>
  );
}