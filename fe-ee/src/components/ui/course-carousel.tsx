"use client"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CourseCarouselProps {
  children: ReactNode
  autoPlay?: boolean
  interval?: number
  showControls?: boolean
  showIndicators?: boolean
  className?: string
}

export function CourseCarousel({
  children,
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  className,
}: CourseCarouselProps) {
  const slides = Array.isArray(children) ? children : [children]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1))
  }, [slides.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1))
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const interval_id = setInterval(() => {
      goToNext()
    }, interval)

    return () => clearInterval(interval_id)
  }, [isPlaying, interval, goToNext])

  // Pause auto-play when user interacts with carousel
  const handleInteraction = () => {
    if (autoPlay) {
      setIsPlaying(false)
      // Resume auto-play after 5 seconds of inactivity
      setTimeout(() => setIsPlaying(true), 5000)
    }
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg", className)}
      onMouseEnter={handleInteraction}
      onMouseLeave={() => setIsPlaying(autoPlay)}
      aria-roledescription="carousel"
    >
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
            aria-hidden={index !== currentIndex}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showControls && slides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 z-30 h-8 w-8 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white/90"
            onClick={() => {
              goToPrevious()
              handleInteraction()
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 z-30 h-8 w-8 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white/90"
            onClick={() => {
              goToNext()
              handleInteraction()
            }}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === currentIndex ? "bg-white w-4" : "bg-white/50",
              )}
              onClick={() => {
                goToSlide(index)
                handleInteraction()
              }}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CourseCarouselItem({
  id,
  title,
  description,
  thumbnailUrl,
  linkHref,
  linkText = "Xem chi tiết",
}: {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  linkHref: string
  linkText?: string
}) {
  // Process the thumbnailUrl to ensure it's valid for Next.js Image component
  const processedThumbnailUrl = (() => {
    // If it's empty or undefined, use a placeholder
    if (!thumbnailUrl) {
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGR5e6phzjZV4iLJJNVPpnbPU_x52zj-mGPA&s?height=600&width=1200&text=No+Image"
    }

    // If it's an absolute URL (starts with http:// or https://), use it directly
    if (thumbnailUrl.startsWith("http://") || thumbnailUrl.startsWith("https://")) {
      return thumbnailUrl
    }

    // If it's a relative URL but doesn't start with a slash, add one
    if (!thumbnailUrl.startsWith("/")) {
      return `/${thumbnailUrl}`
    }

    // Otherwise, use as is
    return thumbnailUrl
  })()

  return (
    <div className="relative flex h-full items-center justify-center">
      {/* Use unoptimized for external URLs */}
      <Image
        src={processedThumbnailUrl}
        alt={title}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.70)] z-10"></div>

      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start text-white px-8 md:px-16">
        <h3 className="text-2xl md:text-4xl font-bold drop-shadow-lg">{title}</h3>
        <p className="mt-2 text-sm md:text-lg text-white max-w-xl line-clamp-2">{description}</p>
        <Button asChild className="mt-4 rounded-full bg-blue-600 hover:bg-blue-700">
          <Link href={linkHref}>{linkText}</Link>
        </Button>
      </div>
    </div>
  )
}
