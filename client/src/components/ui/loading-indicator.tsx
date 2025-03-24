import { FC } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoadingState = "idle" | "loading" | "success" | "error";

interface LoadingIndicatorProps {
  state: LoadingState;
  message?: string;
  className?: string;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({
  state,
  message,
  className
}) => {
  const stateConfig = {
    idle: {
      icon: null,
      defaultMessage: "Waiting to start...",
      color: "text-muted-foreground"
    },
    loading: {
      icon: <Loader2 className="h-6 w-6 animate-spin" />,
      defaultMessage: "Processing...",
      color: "text-primary"
    },
    success: {
      icon: <CheckCircle2 className="h-6 w-6" />,
      defaultMessage: "Completed successfully",
      color: "text-green-500"
    },
    error: {
      icon: <XCircle className="h-6 w-6" />,
      defaultMessage: "An error occurred",
      color: "text-destructive"
    }
  };

  const { icon, defaultMessage, color } = stateConfig[state];

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg bg-background/80 backdrop-blur-sm",
      "transition-all duration-300 ease-in-out",
      color,
      className
    )}>
      {icon}
      <span className="text-sm font-medium">
        {message || defaultMessage}
      </span>
    </div>
  );
};
