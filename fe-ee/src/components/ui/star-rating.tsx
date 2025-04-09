"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  onChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StarRating({ rating, maxRating = 5, onChange, size = "md", className }: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0)
  const [currentRating, setCurrentRating] = React.useState(rating)

  const isInteractive = !!onChange

  React.useEffect(() => {
    setCurrentRating(rating)
  }, [rating])

  const handleClick = (index: number) => {
    if (!isInteractive) return

    const newRating = index + 1
    setCurrentRating(newRating)
    onChange?.(newRating)
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div className={cn("flex items-center gap-1", className)} onMouseLeave={() => isInteractive && setHoverRating(0)}>
      {[...Array(maxRating)].map((_, index) => {
        const isActive = index < (hoverRating || currentRating)

        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "transition-colors",
              isActive ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-300",
              isInteractive && "cursor-pointer",
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => isInteractive && setHoverRating(index + 1)}
          />
        )
      })}
    </div>
  )
}
