import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroParallax } from "../hooks/Useheroparallax";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/hero-video.mp4";
const SCRUB_LENGTH_VH = 150;

export default function Hero() {
  const wrapperRef = useRef(null);
  const stickyRef = useRef(null);
  const videoRef = useRef(null);
  const videoWrapRef = useRef(null);
  const rgbRef = useRef(null);
  const rgbCoreRef = useRef(null);
  const rgbDirectionalRef = useRef(null);

  const [isTouchOrNarrow, setIsTouchOrNarrow] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasEnoughData, setHasEnoughData] = useState(false);

  const isMobile = isTouchOrNarrow || reducedMotion;

  useHeroParallax(stickyRef, videoWrapRef, {
    maxTranslate: 36,
    maxRotate: 5,
    disabled: isMobile,
  });

  useEffect(() => {
    const sizeMq = window.matchMedia(
      "(max-width: 768px), (pointer: coarse)"
    );

    const motionMq = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateSize = () => setIsTouchOrNarrow(sizeMq.matches);
    const updateMotion = () => setReducedMotion(motionMq.matches);

    updateSize();
    updateMotion();

    sizeMq.addEventListener("change", updateSize);
    motionMq.addEventListener("change", updateMotion);

    return () => {
      sizeMq.removeEventListener("change", updateSize);
      motionMq.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => setIsReady(true);
    const onCanPlayThrough = () => setHasEnoughData(true);

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplaythrough", onCanPlayThrough);

    if (video.readyState >= 1) setIsReady(true);
    if (video.readyState >= 4) setHasEnoughData(true);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, []);

  useEffect(() => {
    if (isMobile || !isReady) return;

    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;

    if (!video || !wrapper || !sticky) return;

    video.pause();

    const scrollTrigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: `+=${SCRUB_LENGTH_VH}%`,
      pin: sticky,
      pinSpacing: true,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (!video.duration) return;
        video.currentTime = self.progress * video.duration;
        gsap.to(rgbRef.current, {
          rotation: self.progress * 10,
          scale: 1 + self.progress * 0.08,
          duration: 0.4,
          overwrite: true,
          ease: "power2.out",
        });
        gsap.to(rgbCoreRef.current, {
          scale: 1 + self.progress * 0.18,
          duration: 0.4,
          overwrite: true,
          ease: "power2.out",
        });
      },
    });

    return () => scrollTrigger.kill();
  }, [isMobile, isReady]);

  useEffect(() => {
    const section = stickyRef.current;
    const rgb = rgbRef.current;
    const core = rgbCoreRef.current;
    const directional = rgbDirectionalRef.current;

    if (!section || !rgb || !core || !directional) return;

    let frame;

    let currentX = 0;
    let currentY = 0;

    let targetX = 0;
    let targetY = 0;
    let targetIntensity = 0.78;
    let currentIntensity = 0.78;

    const handleMouseMove = (event) => {
      const rect = section.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width;

      const y =
        (event.clientY - rect.top) / rect.height;

      targetX = (x - 0.5) * 60;
      targetY = (y - 0.5) * 35;
      targetIntensity = 0.78 + Math.abs(x - 0.5) * 0.12;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;
      currentIntensity += (targetIntensity - currentIntensity) * 0.035;

      gsap.set(rgb, {
        x: currentX * 0.35,
        y: currentY * 0.35,
        opacity: isMobile ? currentIntensity * 0.62 : currentIntensity,
      });

      gsap.set(core, {
        x: currentX * 0.55,
        y: currentY * 0.55,
      });

      gsap.set(directional, {
        x: currentX * 0.18,
        y: currentY * 0.12,
        opacity: isMobile ? 0.12 : 0.24 + Math.abs(currentX) * 0.002,
      });

      frame = requestAnimationFrame(animate);
    };

    section.addEventListener(
      "mousemove",
      handleMouseMove
    );

    frame = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      cancelAnimationFrame(frame);
    };
  }, [isMobile]);

  return (
    <div
      ref={wrapperRef}
      className={isMobile ? "" : "relative"}
      style={
        isMobile
          ? {}
          : {
              height: `${100 + SCRUB_LENGTH_VH}vh`,
            }
      }
    >
      <section
        ref={stickyRef}
        id="home"
        className="relative w-full h-screen overflow-hidden bg-[#030303]"
      >
        {!hasEnoughData && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#030303]">
            <div className="flex flex-col items-center gap-4">
              <span className="w-8 h-8 rounded-full border border-white/10 border-t-white/70 animate-spin" />

              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                Loading
              </span>
            </div>
          </div>
        )}

        {/* DEEP ATMOSPHERIC BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 75% 90% at 82% 50%, rgba(55,25,150,0.18) 0%, rgba(20,45,110,0.12) 28%, rgba(5,5,10,0.9) 65%, #030303 100%)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #030303 0%, #030303 27%, rgba(3,3,8,0.96) 42%, rgba(10,5,30,0.65) 62%, rgba(8,3,25,0.2) 100%)",
            }}
          />
        </div>

        {/* MAIN RGB ATMOSPHERE */}
        <div
          ref={rgbRef}
          className="absolute pointer-events-none"
          style={{
            zIndex: 1,
            width: "68vw",
            height: "100vh",
            right: "-5vw",
            top: "50%",
            transform: "translateY(-50%)",
            borderRadius: "50%",
            filter: "blur(110px)",
            opacity: 0.78,
            background: "radial-gradient(ellipse at 58% 42%, rgba(0, 210, 255, 0.32) 0%, rgba(75, 50, 255, 0.28) 22%, rgba(170, 35, 255, 0.22) 43%, rgba(255, 25, 150, 0.13) 62%, transparent 78%)",
          }}
        />

        {/* SECONDARY RGB LIGHT */}
        <div
          ref={rgbCoreRef}
          className="absolute pointer-events-none"
          style={{
            zIndex: 2,
            width: "48vw",
            height: "72vh",
            right: "7vw",
            top: "50%",
            transform: "translateY(-50%)",
            borderRadius: "50%",
            filter: "blur(65px)",
            opacity: 0.42,
            background: "radial-gradient(ellipse at center, rgba(0, 220, 255, 0.28) 0%, rgba(70, 80, 255, 0.24) 25%, rgba(190, 40, 255, 0.2) 48%, rgba(255, 40, 150, 0.12) 65%, transparent 78%)",
          }}
        />

        <div
          ref={rgbDirectionalRef}
          className="absolute pointer-events-none"
          style={{
            zIndex: 3,
            width: "52vw",
            height: "24vh",
            right: "18vw",
            top: "58%",
            filter: "blur(55px)",
            opacity: 0.22,
            background: "linear-gradient(90deg, transparent, rgba(74, 133, 255, 0.2), rgba(255, 60, 188, 0.12), transparent)",
            transform: "rotate(-12deg)",
          }}
        />

        {/* INTERACTIVE 3D MODEL */}
        <div
          className="absolute inset-0 z-[5] pointer-events-auto"
        >
          <div
            className="
              absolute
              flex
              items-center
              justify-center
              right-[-4%]
              max-md:right-[-18%]
              top-1/2
              max-md:top-[72%]
              -translate-y-1/2
              w-[63%]
              max-md:w-[108%]
              h-[108%]
              max-md:h-[58%]
            "
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
          >
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              autoPlay={isMobile}
              loop={isMobile}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              style={{
                opacity: 0.62,
                mixBlendMode: "screen",
                maskImage: "radial-gradient(ellipse 75% 70% at 55% 50%, black 35%, rgba(0,0,0,0.8) 55%, transparent 88%)",
                WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 55% 50%, black 35%, rgba(0,0,0,0.8) 55%, transparent 88%)",
              }}
            />
          </div>
        </div>

        {/* DARK LEFT READABILITY FIELD */}
        <div
          className="absolute inset-0 z-[7] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(3,3,3,1) 0%, rgba(3,3,3,0.98) 30%, rgba(3,3,3,0.88) 44%, rgba(3,3,3,0.32) 62%, transparent 82%)",
          }}
        />

        {/* CINEMATIC VIGNETTE */}
        <div
          className="absolute inset-0 z-[8] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 90% at 65% 50%, transparent 35%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.72) 100%)",
          }}
        />

        {/* TOP / BOTTOM FADE */}
        <div
          className="absolute inset-x-0 top-0 h-28 z-[9] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, #030303, transparent)",
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-40 z-[9] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, #030303, transparent)",
          }}
        />

        {/* HERO CONTENT */}
        <div
          className="
            relative
            z-[20]
            h-full
            w-full
            flex
            items-center
          "
        >
          <div
            className="
              w-full
              max-w-[1500px]
              mx-auto
              px-6
              sm:px-10
              lg:px-16
              xl:px-20
            "
          >
            <div
              className="
                w-full
                lg:w-[45%]
                xl:w-[43%]
                text-left
              "
            >
              <span
                className="block mt-25 text-xs md:text-sm font-light tracking-[0.35em] uppercase mb-8"
                style={{
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                Computer Engineering Student · Full-Stack Developer
              </span>

              <div className="overflow-hidden mb-6">
                <h1
                  className="
                    text-4xl
                    sm:text-5xl
                    md:text-7xl
                    lg:text-[5rem]
                    xl:text-[6rem]
                    font-medium
                    tracking-[-0.04em]
                    text-white
                    leading-none
                    select-none
                  "
                >
                  GAURAV RAI
                </h1>
              </div>

              <p
                className="
                  text-lg
                  md:text-xl
                  lg:text-2xl
                  font-light
                  max-w-2xl
                  leading-relaxed
                  mb-4
                "
                style={{
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Building digital experiences that feel as good as they function.
              </p>

              <p
                className="
                  text-sm
                  md:text-base
                  font-light
                  max-w-lg
                  leading-relaxed
                  mb-14
                "
                style={{
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                Building scalable web applications, interactive experiences, and reliable
                backend systems with the MERN stack.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-5">
                <a
                  href="#projects"
                  className="
                    group
                    relative
                    px-10
                    py-4
                    bg-white
                    text-black
                    text-xs
                    font-medium
                    tracking-[0.2em]
                    uppercase
                    rounded-full
                    overflow-hidden
                  "
                >
                  <span className="relative z-10 transition-colors duration-400 group-hover:text-white">
                    View Projects
                  </span>

                  <div
                    className="
                      absolute
                      inset-0
                      bg-black
                      translate-y-full
                      group-hover:translate-y-0
                      transition-transform
                      duration-500
                      ease-[cubic-bezier(0.19,1,0.22,1)]
                      rounded-full
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      border
                      border-white/20
                      rounded-full
                      z-20
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                    "
                  />
                </a>

                <a
                  href="#contact"
                  className="
                    group
                    relative
                    px-10
                    py-4
                    text-xs
                    font-medium
                    tracking-[0.2em]
                    uppercase
                    text-white/70
                    hover:text-white
                    transition-colors
                    duration-300
                  "
                >
                  Let's Connect

                  <span
                    className="
                      absolute
                      bottom-2
                      left-0
                      right-0
                      h-[1px]
                    "
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div
          className="
            absolute
            bottom-10
            left-1/2
            -translate-x-1/2
            z-[30]
            flex
            flex-col
            items-center
            gap-3
          "
        >
          <div
            className="w-px h-14 origin-top animate-pulse"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)",
            }}
          />
        </div>

        <span
          className="
            text-[10px]
            tracking-[0.3em]
            uppercase
            absolute
            bottom-6
            left-1/2
            -translate-x-1/2
            z-[30]
          "
          style={{
            color: "rgba(255,255,255,0.25)",
          }}
        >
          Scroll
        </span>
      </section>
    </div>
  );
}
