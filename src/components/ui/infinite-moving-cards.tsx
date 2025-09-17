"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { GlowingEffect } from "./glowing-effect";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow" | "very-slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      // Instead of cloning, we'll render the items twice in the JSX
      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else if (speed === "slow") {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "120s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-2 py-0",
          start && "animate-scroll",
        )}
      >
        {[...items, ...items].map((item, idx) => (
            <li
              className={`relative shrink-0 rounded-lg border px-4 py-3 group ${
                item.quote === "Loading..." 
                  ? "w-32 border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 animate-pulse" 
                  : "min-w-fit max-w-[300px] border-zinc-200 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
              }`}
              key={idx}
            >
              {item.quote !== "Loading..." && (
                <GlowingEffect
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  disabled={false}
                  glow={true}
                  spread={30}
                  blur={0}
                  proximity={50}
                  movementDuration={1}
                />
              )}
              <div className="flex items-center justify-center h-full relative z-10">
                {item.quote === "Loading..." ? (
                  <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded animate-pulse w-full"></div>
                ) : (
                  <span className="text-sm font-medium text-neutral-800 dark:text-gray-100 text-center whitespace-nowrap">
                    {item.quote}
                  </span>
                )}
              </div>
            </li>
        ))}
      </ul>
    </div>
  );
};
