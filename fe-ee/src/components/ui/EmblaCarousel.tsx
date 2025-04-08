"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

interface EmblaCarouselProps {
  slides: React.ReactNode[];
}

export default function EmblaCarousel({ slides }: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div className="min-w-full p-4" key={index}>
            {slide}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Button onClick={scrollPrev} variant="outline">
          Prev
        </Button>
        <Button onClick={scrollNext}>Next</Button>
      </div>
    </div>
  );
}
