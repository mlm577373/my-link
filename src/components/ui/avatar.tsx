"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl"
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      default: "h-12 w-12",
      lg: "h-20 w-20",
      xl: "h-24 w-24",
    }

    return (
      <div
        ref={ref}
        data-slot="avatar"
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full border shadow-sm",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Avatar.displayName = "Avatar"

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, onError, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    if (!src || hasError) {
      return null
    }

    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        ref={ref}
        src={src}
        alt={alt || "Avatar"}
        onError={(e) => {
          setHasError(true)
          onError?.(e)
        }}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted font-bold text-muted-foreground",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
