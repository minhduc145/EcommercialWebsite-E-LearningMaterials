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
  const roundToHalf = (num: number) => Math.round(num * 2) / 2;

  const isInteractive = !!onChange

  React.useEffect(() => {
    setCurrentRating(roundToHalf(rating))
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
        // For interactive mode, use the existing logic
        if (isInteractive) {
          const isActive = index < (hoverRating || currentRating)

          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                "transition-colors",
                isActive ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-300",
                "cursor-pointer",
              )}
              onClick={() => handleClick(index)}
              onMouseEnter={() => setHoverRating(index + 1)}
            />
          )
        }
        // For non-interactive mode, support half stars
        else {
          const starValue = index + 1
          const isFullStar = currentRating >= starValue
          const isHalfStar = !isFullStar && currentRating > index && currentRating < starValue

          return (
            <div key={index} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFullStar ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-300",
                )}
              />
              {isHalfStar && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")} />
                </div>
              )}
            </div>
          )
        }
      })}
    </div>
  )
}
