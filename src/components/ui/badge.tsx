import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        official:
          "border-indigo-400/30 bg-indigo-500/20 text-indigo-200 backdrop-blur-sm",
        featured:
          "border-pink-400/30 bg-pink-500/20 text-pink-200 backdrop-blur-sm",
        contact:
          "border-blue-400/30 bg-blue-500/20 text-blue-200 backdrop-blur-sm",
        new: "border-emerald-400/30 bg-emerald-500/20 text-emerald-200 backdrop-blur-sm",
        soon: "border-amber-400/30 bg-amber-500/20 text-amber-200 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
