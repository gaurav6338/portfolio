import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  const completed = useRef(false);
  const callbackRef = useRef(onComplete);

  useEffect(() => {
    callbackRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const DURATION = 2000;
    const HOLD = 400;
    const EXIT = 500;

    let animationId;
    let holdTimeout;
    let exitTimeout;

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 1.8);
      const currentNumber = Math.floor(easedProgress * 100);

      setCount(currentNumber);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      setCount(100);

      holdTimeout = setTimeout(() => {
        if (completed.current) return;

        completed.current = true;

        setShowLoader(false);

        exitTimeout = setTimeout(() => {
          callbackRef.current?.();
        }, EXIT);
      }, HOLD);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);

      if (holdTimeout) {
        clearTimeout(holdTimeout);
      }

      if (exitTimeout) {
        clearTimeout(exitTimeout);
      }
    };
  }, []);

  const progress = count / 100;

  const numberOpacity = 0.06 + progress * 0.94;
  const nameOpacity = 1 - progress * 0.88;

  return (
    <AnimatePresence mode="wait">
      {showLoader && (
        <motion.div
          key="portfolio-loader"
          className="fixed inset-0 z-[999999] bg-black overflow-hidden flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.025,
          }}
          transition={{
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <div
            className="relative flex items-center justify-center"
            style={{
              width: "100vw",
              height: "100vh",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute select-none pointer-events-none font-bold"
              style={{
                zIndex: 1,
                textAlign: "center",
                whiteSpace: "nowrap",
                fontFamily:
                  "Arial, Helvetica, sans-serif",
                fontSize:
                  "clamp(12rem, 35vw, 40rem)",
                lineHeight: "1",
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
                color: "#ffffff",
                opacity: numberOpacity,
                userSelect: "none",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {String(count).padStart(3, "0")}
            </div>

            <div
              aria-hidden="true"
              className="absolute select-none pointer-events-none font-light"
              style={{
                zIndex: 2,
                textAlign: "center",
                whiteSpace: "nowrap",
                fontFamily:
                  "Arial, Helvetica, sans-serif",
                fontSize:
                  "clamp(3rem, 8.75vw, 10rem)",
                lineHeight: "1",
                letterSpacing: "0.08em",
                color: "#ffffff",
                opacity: nameOpacity,
                userSelect: "none",
                top: "50%",
                left: "50%",
                transform:
                  "translate(-50%, -50%)",
              }}
            >
              GAURAV RAI
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}