import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { Slot } from "radix-ui";
import * as React from "react";

interface LoadingButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : "button";
    const isDisabled = disabled || isLoading;

    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-loading={isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <Loader2
            className={cn(
              "animate-spin",
              size === "icon" ||
                size === "icon-xs" ||
                size === "icon-sm" ||
                size === "icon-lg"
                ? "size-4"
                : "size-4",
            )}
          />
        )}
        {!isLoading && children}
        {isLoading && loadingText && (
          <span className="ml-1.5">{loadingText}</span>
        )}
        {!isLoading && !loadingText && (
          <span className="gap-1.5">{children}</span>
        )}
      </Comp>
    );
  },
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
