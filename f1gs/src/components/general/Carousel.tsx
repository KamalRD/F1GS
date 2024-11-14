"use client";

// React / Next
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";

// 3rd Party
import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

// Types
import { CarouselCard } from "@/lib/types";

// Data
import carouselData from "@/data/carousel.json";

export function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center" });

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) {
        return;
      }
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <>
      <div
        className="overflow-hidden lg:hidden block md:w-[80%] lg:w-[60%] mx-auto z-10"
        ref={emblaRef}
      >
        <div className="flex flex-row my-2 mx-1 gap-x-4">
          {carouselData.carouselCards.map((cardData: CarouselCard, index) => (
            <div
              className="flex flex-col flex-shrink-0 basis-[100%] min-w-0 max-w-72 pl-4 rounded-xl border-2 border-[rgba(210, 210, 210, .5)] shadow-carousel h-96"
              key={index}
            >
              <div className="flex flex-col justify-center items-center mt-4">
                <Image
                  src={cardData.icon}
                  alt={cardData.alt}
                  width={24}
                  height={24}
                />
                <h3 className="text-center text-lg font-semibold">
                  {cardData.title}
                </h3>
              </div>
              <p className="w-[80%] mx-auto text-sm">{cardData.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center gap-4 my-4 lg:hidden">
        {scrollSnaps.map((_, index) => {
          return (
            <button
              key={index}
              type="button"
              onClick={() => onDotButtonClick(index)}
              className={`rounded-full h-4 w-4 border-2 border-solid border-brand_black ${
                selectedIndex === index ? "bg-brand_red" : ""
              }`}
            ></button>
          );
        })}
      </div>
      <div className="hidden lg:block xl:max-w-screen-lg mx-auto">
        <div className="flex flex-row justify-between my-4">
          {carouselData &&
            carouselData.carouselCards.map(
              (cardData: CarouselCard, idx: number) => {
                let initialX: string;
                if (idx === 0) {
                  initialX = "50%";
                } else if (idx === 2) {
                  initialX = "-50%";
                } else {
                  initialX = "0";
                }
                return (
                  <motion.div
                    className="w-72 rounded-xl border-2 border-[rgba(210, 210, 210, .5)] shadow-carousel h-96 col-span-2"
                    key={cardData.title}
                    whileHover={{
                      scale: 1.05,
                      translateY: -10,
                    }}
                    initial={{
                      x: initialX,
                      opacity: 0,
                    }}
                    whileInView={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        duration: 1,
                      },
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="flex flex-col justify-center items-center mt-4">
                      <Image
                        src={cardData.icon}
                        alt={cardData.alt}
                        width={24}
                        height={24}
                      />
                      <h3 className="text-center text-lg font-semibold">
                        {cardData.title}
                      </h3>
                    </div>
                    <p className="w-[80%] mx-auto text-sm">
                      {cardData.content}
                    </p>
                  </motion.div>
                );
              }
            )}
        </div>
      </div>
    </>
  );
}
