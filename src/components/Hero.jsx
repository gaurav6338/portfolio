import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroParallax } from "../hooks/useheroparallax";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/hero-video.mp4";
// How much extra scroll distance (as a multiple of viewport height) the
// scrub animation gets before the section unpins. Bigger = slower scrub.
const SCRUB_LENGTH_VH = 150;

export default function Hero() {
  const wrapperRef = useRef(null); // tall scroll-length container
  const stickyRef = useRef(null); // the visually pinned 100vh section
  const videoRef = useRef(null);
  const videoWrapRef = useRef(null); // gets the cursor parallax transform

  const [isTouchOrNarrow, setIsTouchOrNarrow] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isReady, setIsReady] = useState(false); // metadata loaded, duration known
  const [hasEnoughData, setHasEnoughData] = useState(false); // can scrub without stalling

  // scroll-jacking + cursor parallax are both skipped for touch/narrow
  // viewports AND for users who've asked the OS for reduced motion
  const isMobile = isTouchOrNarrow || reducedMotion;

  // --- detect touch / narrow viewports, skip scroll-jacking there ---
  useEffect(() => {
    const sizeMq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
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

  // cursor parallax is disabled entirely on mobile/touch/reduced-motion
  useHeroParallax(stickyRef, videoWrapRef, {
    maxTranslate: 36,
    maxRotate: 5,
    disabled: isMobile,
  });

  // --- video loading state ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => setIsReady(true);
    // canplaythrough = enough buffered that scrubbing won't visibly stall
    const onCanPlayThrough = () => setHasEnoughData(true);

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplaythrough", onCanPlayThrough);

    // in case the video is already cached/loaded before listeners attach
    if (video.readyState >= 1) setIsReady(true);
    if (video.readyState >= 4) setHasEnoughData(true);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, []);

  // --- scroll-scrubbed, pinned playback (desktop/tablet only) ---
  useEffect(() => {
    if (isMobile || !isReady) return;
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    if (!video || !wrapper || !sticky) return;

    // Scrubbing needs a paused video we drive manually via currentTime.
    video.pause();

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: `+=${SCRUB_LENGTH_VH}%`,
      pin: sticky, // section stays fixed on screen for the whole scrub
      pinSpacing: true,
      scrub: 0.6, // smooth catch-up instead of frame-snapping to scroll
      anticipatePin: 1,
      onUpdate: (self) => {
        const duration = video.duration || 0;
        if (!duration) return;
        // scroll progress (0 -> 1) drives currentTime directly
        video.currentTime = self.progress * duration;
      },
      // once self.progress reaches 1 the trigger auto-releases pin and
      // normal page scroll continues into the next section — no manual
      // "unlock scroll" step needed, ScrollTrigger handles this natively.
    });

    return () => st.kill();
  }, [isMobile, isReady]);

  return (
    <div ref={wrapperRef} className={isMobile ? "" : "relative"} style={isMobile ? {} : { height: `${100 + SCRUB_LENGTH_VH}vh` }}>
      <section
        ref={stickyRef}
        id="home"
        className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
      >
        {/* --- loading state, shown until video has enough buffered data --- */}
        {!hasEnoughData && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050505]">
            <div className="flex flex-col items-center gap-4">
              <span className="w-8 h-8 rounded-full border border-white/15 border-t-white/70 animate-spin" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                Loading
              </span>
            </div>
          </div>
        )}

        {/* --- video layer, gets cursor parallax on desktop --- */}
        <div className="absolute inset-0 z-0">
          <div
            ref={videoWrapRef}
            className="absolute inset-[-8%] flex items-center justify-center"
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              // On mobile we fall back to a normal ambient autoplay loop —
              // scroll-scrubbing a video is laggy on touch devices, so we
              // skip the scrub/pin logic and just let it play naturally.
              autoPlay={isMobile}
              loop={isMobile}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              style={{ opacity: 0.55, mixBlendMode: "screen" }}
            />
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, #050505 80%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #050505)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{ background: "linear-gradient(to top, transparent, #050505)" }}
          />
        </div>

        {/* --- content --- */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-6xl px-6">
          <span
            className="block text-xs md:text-sm font-light tracking-[0.35em] uppercase mb-8"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Computer Engineering Student · Full-Stack Developer
          </span>

          <div className="overflow-hidden mb-6">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-medium tracking-[-0.03em] text-white leading-none select-none">
              GAURAV RAI
            </h1>
          </div>

          <p
            className="text-lg md:text-xl lg:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-4"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Building digital experiences that feel as good as they function.
          </p>

          <p
            className="text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed mb-14"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Building scalable web applications, interactive experiences, and reliable
            backend systems with the MERN stack.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <a
              href="#projects"
              className="group relative px-10 py-4 bg-white text-black text-xs font-medium tracking-[0.2em] uppercase rounded-full overflow-hidden"
            >
              <span className="relative z-10 transition-colors duration-400 group-hover:text-white">
                View Projects
              </span>
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full" />
              <div className="absolute inset-0 border border-white/20 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            <a
              href="#contact"
              className="group relative px-10 py-4 text-xs font-medium tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-300"
            >
              Let's Connect
              <span
                className="absolute bottom-2 left-0 right-0 h-[1px] transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                }}
              />
            </a>
          </div>
        </div>

        {/* --- scroll hint, fades once the scrub starts moving --- */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div
            className="w-px h-14 origin-top animate-pulse"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)" }}
          />
        </div>
        <span
          className="text-[10px] tracking-[0.3em] uppercase absolute bottom-6 left-1/2 -translate-x-1/2"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Scroll
        </span>
      </section>
    </div>
  );
}