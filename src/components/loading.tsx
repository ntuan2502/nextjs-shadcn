import type React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  variant?: "spinner" | "dots" | "bars" | "pulse" | "skeleton";
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = "spinner",
  size = "md",
  className,
  text,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const renderSpinner = () => (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full bg-blue-600 animate-bounce",
            size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4",
            className
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );

  const renderBars = () => (
    <div className="flex space-x-1 items-end">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-blue-600 animate-pulse",
            size === "sm" ? "w-1 h-4" : size === "md" ? "w-1.5 h-6" : "w-2 h-8",
            className
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        "rounded-full bg-blue-600 animate-pulse",
        sizeClasses[size],
        className
      )}
    />
  );

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );

  const renderLoading = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "bars":
        return renderBars();
      case "pulse":
        return renderPulse();
      case "skeleton":
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoading()}
      {text && (
        <p className={cn("text-gray-600 animate-pulse", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
};

// Component wrapper cho full page loading
interface FullPageLoadingProps {
  variant?: LoadingProps["variant"];
  size?: LoadingProps["size"];
  text?: string;
  overlay?: boolean;
}

const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  variant = "spinner",
  size = "lg",
  text = "Đang tải...",
  overlay = true,
}) => {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50",
        overlay ? "bg-white/80 backdrop-blur-sm" : "bg-transparent"
      )}
    >
      <Loading variant={variant} size={size} text={text} />
    </div>
  );
};

// Component cho inline loading
interface InlineLoadingProps extends LoadingProps {
  inline?: boolean;
}

const InlineLoading: React.FC<InlineLoadingProps> = ({
  variant = "spinner",
  size = "sm",
  className,
  inline = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        inline
          ? "inline-flex items-center space-x-2"
          : "flex items-center space-x-2",
        className
      )}
    >
      <Loading variant={variant} size={size} {...props} />
    </div>
  );
};

export { Loading, FullPageLoading, InlineLoading };
export default Loading;
