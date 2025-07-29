import { useMemo, useLayoutEffect, useRef, useState, useEffect } from "react";
import { motion, MotionConfig } from "framer-motion";
import { cn } from "@/lib/utils";

type AquariumSize = "small" | "medium" | "large";
type AquariumDensity = "calm" | "default" | "crowded";

interface EmojiAquariumProps {
  size?: AquariumSize;
  density?: AquariumDensity;
  seed?: string;
  className?: string;
}

function useSeededRandom(seed?: string) {
  // Mulberry32 PRNG
  let a = 0;
  if (seed && seed.length > 0) {
    for (let i = 0; i < seed.length; i++) a = (a + seed.charCodeAt(i)) | 0;
  } else {
    a = Math.floor(Math.random() * 2 ** 31);
  }
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function EmojiAquarium({ seed, className }: EmojiAquariumProps) {
  // Create a stable seed once so re-renders (e.g., hover) don't change layout.
  const seedRef = useRef<string | undefined>(seed);
  if (seedRef.current === undefined) {
    seedRef.current = Math.floor(Math.random() * 2 ** 31).toString();
  }
  // If a seed prop is provided later, allow switching to it.
  useEffect(() => {
    if (seed && seed !== seedRef.current) {
      seedRef.current = seed;
    }
  }, [seed]);

  const rand = useSeededRandom(seedRef.current);

  // Responsive: fill the container width and compute height via aspect ratio.
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(420);
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth || 420);
    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const aspect = 236 / 420; // ~16:9
  const width = containerWidth;
  const height = Math.max(120, Math.round(containerWidth * aspect));

  const { fishCount, jellyCount, bubbleCount, floorCount } = useMemo(() => {
    return { fishCount: 7, jellyCount: 2, bubbleCount: 18, floorCount: 9 };
  }, []);

  const fishes = ["🐟", "🐠", "🐡", "🦈", "🐬"];
  const decor = ["🪸", "⚓️", "🏺", "🪨", "🌿", "🗿", "🐚", "🦑", "🍃"];

  const bubbles = "🫧"; // falls back to monochrome when unsupported

  return (
    <MotionConfig reducedMotion="never">
      <div
        className={cn(
          "chat-bubble bg-blue-200 text-black !p-0 mt-1 w-full max-w-[420px]",
          className
        )}
      >
        <div
          ref={containerRef}
          className={cn("relative z-0 overflow-hidden rounded")}
          style={{ width: "100%", height }}
        >
          {/* swimming fish */}
          {Array.from({ length: fishCount }).map((_, i) => {
            const emoji = fishes[Math.floor(rand() * fishes.length)];
            const dirRight = rand() > 0.5;
            const scale = 0.9 + rand() * 0.6;
            const y = 20 + rand() * (height - 80);
            const duration = 14 + rand() * 16;
            const delay = rand() * 4;
            const xFrom = dirRight ? -60 : width + 60;
            const xTo = dirRight ? width + 60 : -60;
            const wiggle = 6 + rand() * 8;
            return (
              <motion.span
                key={`fish-${i}`}
                initial={{ x: xFrom, y, scale, rotateY: dirRight ? 0 : 180 }}
                animate={{
                  x: [xFrom, xTo],
                  y: [y, y - wiggle, y, y + wiggle, y],
                }}
                transition={{
                  x: {
                    duration,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay,
                  },
                  y: {
                    duration: duration / 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  },
                }}
                style={{ position: "absolute", willChange: "transform" }}
                className="text-[20px] select-none"
              >
                {emoji}
              </motion.span>
            );
          })}

          {/* jellyfish drifting */}
          {Array.from({ length: jellyCount }).map((_, i) => {
            const x = 40 + rand() * (width - 80);
            const startY = 20 + rand() * (height * 0.45);
            const float = 18 + rand() * 10;
            const delay = rand() * 3;
            return (
              <motion.span
                key={`jelly-${i}`}
                initial={{ x, y: startY }}
                animate={{
                  y: [startY, startY + 18, startY],
                  opacity: [0.85, 1, 0.85],
                }}
                transition={{
                  duration: float,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  willChange: "transform, opacity",
                }}
                className="text-[22px] select-none"
              >
                {"🪼"}
              </motion.span>
            );
          })}

          {/* bubbles rising */}
          {Array.from({ length: bubbleCount }).map((_, i) => {
            const x = 10 + rand() * (width - 20);
            const start = rand() * (height * 0.65);
            const drift = (rand() - 0.5) * 20;
            const dur = 10 + rand() * 12;
            const delay = rand() * 4;
            return (
              <motion.span
                key={`bubble-${i}`}
                initial={{ x, y: height - start, opacity: 0.4 }}
                animate={{
                  x: [x, x + drift],
                  y: [height - start, -20],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: dur,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  delay,
                }}
                style={{
                  position: "absolute",
                  willChange: "transform, opacity",
                }}
                className="text-[16px] select-none"
              >
                {bubbles}
              </motion.span>
            );
          })}

          {/* sand base */}
          <div className="absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-t from-yellow-200/80 to-transparent" />

          {/* floor decorations */}
          {Array.from({ length: floorCount }).map((_, i) => {
            const emoji = decor[Math.floor(rand() * decor.length)];
            const x = 8 + rand() * (width - 16);
            const delay = 0.2 + i * 0.07 + rand() * 0.2;
            const rot = (rand() - 0.5) * 10;
            const size = 18 + rand() * 6;
            return (
              <motion.span
                key={`floor-${i}`}
                initial={{ x, y: -20, opacity: 0, rotate: rot }}
                animate={{ x, y: height - 22, opacity: 1, rotate: rot }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 20,
                  delay,
                }}
                style={{ position: "absolute" }}
                className="select-none"
              >
                <span style={{ fontSize: `${size}px` }}>{emoji}</span>
              </motion.span>
            );
          })}

          {/* life ring at corner */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="absolute right-1.5 top-1.5 select-none text-[18px]"
          >
            🛟
          </motion.span>
        </div>
      </div>
    </MotionConfig>
  );
}

export default EmojiAquarium;
