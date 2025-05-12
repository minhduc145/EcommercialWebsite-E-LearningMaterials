"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoItem {
  id: string
  thumbnail: string
  title: string
  artist: string
}

export default function MusicVideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const videos: VideoItem[] = [
    {
      id: "1",
      thumbnail: "/placeholder.svg?height=200&width=350",
      title: "Good Vibes",
      artist: "Artist One",
    },
    {
      id: "2",
      thumbnail: "/placeholder.svg?height=200&width=350",
      title: "Chúng Ta Của Tương Lai",
      artist: "Sơn Tùng M-TP",
    },
    {
      id: "3",
      thumbnail: "/placeholder.svg?height=200&width=350",
      title: "Khu Vườn Trên Mây",
      artist: "Artist Three",
    },
    {
      id: "4",
      thumbnail: "/placeholder.svg?height=200&width=350",
      title: "Guilty As Sin",
      artist: "Taylor Swift",
    },
    {
      id: "5",
      thumbnail: "/placeholder.svg?height=200&width=350",
      title: "Summer Nights",
      artist: "Artist Five",
    },
    {
      id: "6",
      thumbnail: "/placeholder.svg?height=200&width=350",
      title: "Midnight Dreams",
      artist: "Artist Six",
    },
  ]

  const handleNext = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = container.querySelector("div")?.offsetWidth || 0
      const scrollAmount = cardWidth + 16 // card width + gap
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = container.querySelector("div")?.offsetWidth || 0
      const scrollAmount = cardWidth + 16 // card width + gap
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const handlePlayVideo = (id: string) => {
    console.log(`Playing video ${id}`)
    // In a real implementation, this would trigger the video playback
  }

  const handlePlayAll = () => {
    console.log("Playing all videos")
    // In a real implementation, this would start playing all videos in sequence
  }

  return (
    <div className="w-full p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Video nhạc cho bạn</h2>
          <div className="flex items-center gap-4">
            <Button onClick={handlePlayAll} variant="outline" className="rounded-full">
              Phát tất cả
            </Button>
            <div className="flex gap-2">
              <Button onClick={handlePrev} variant="outline" size="icon" className="rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button onClick={handleNext} variant="outline" size="icon" className="rounded-full">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {videos.map((video) => (
            <div
              key={video.id}
              className="relative group flex-shrink-0"
              style={{
                width: "calc(100vw - 3rem)",
                maxWidth: "350px",
                minWidth: "250px",
              }}
            >
              <div className="relative aspect-video overflow-hidden rounded-md">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => handlePlayVideo(video.id)}
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white h-14 w-14"
                  >
                    <Play className="h-8 w-8 fill-white" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-medium text-sm">{video.title}</h3>
                <p className="text-gray-500 text-xs">{video.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
