import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function Nav({ className }: { className?: string }) {
  return (
    <nav className={cn("border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="flex h-14 items-center px-4 relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Logo />
        </div>
        {/* Rest of the navigation content */}
      </div>
    </nav>
  );
}
