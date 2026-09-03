import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useMousePosition } from "../hooks/useMousePosition";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function Hero() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { x, y } = useMousePosition();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const isBrowser = typeof window !== "undefined";
  const centerX = isBrowser ? window.innerWidth / 2 : 0;
  const centerY = isBrowser ? window.innerHeight / 2 : 0;

  const rawMoveX = isMobile ? 0 : (x - centerX) * 0.015;
  const rawMoveY = isMobile ? 0 : (y - centerY) * 0.015;
  const rawRotX = isMobile ? 0 : (y - centerY) * -0.005;
  const rawRotY = isMobile ? 0 : (x - centerX) * 0.005;

  const springCfg = { stiffness: 40, damping: 18, mass: 1 };
  const springX = useSpring(rawMoveX, springCfg);
  const springY = useSpring(rawMoveY, springCfg);
  const springRotX = useSpring(rawRotX, springCfg);
  const springRotY = useSpring(rawRotY, springCfg);
  const BASE = 0.2;

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
    >
<motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBg, scale, opacity }}
      >
<motion.div
          className="absolute inset-[-10%] flex items-center justify-center"
          style={{
            x: springX,
            y: springY,
            rotateX: springRotX,
            rotateY: springRotY,
            perspective: "1200px",
          }}
        >
          <video
            src="/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ opacity: 0.55, mixBlendMode: "screen" }}
          />
        </motion.div>
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
      </motion.div>
<motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-6xl px-6"
        style={{ opacity }}
      >
<motion.span
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: BASE, ease: "easeOut" }}
          className="block text-xs md:text-sm font-light tracking-[0.35em] uppercase mb-8"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Computer Engineering Student · Full-Stack Developer
        </motion.span>
<div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.3, delay: BASE + 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-medium tracking-[-0.03em] text-white leading-none select-none"
          >
            GAURAV RAI
          </motion.h1>
        </div>
<motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: BASE + 0.45 }}
          className="text-lg md:text-xl lg:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-4"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Building digital experiences that feel as good as they function.
        </motion.p>
<motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: BASE + 0.65 }}
          className="text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed mb-14"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Building scalable web applications, interactive experiences, and reliable
          backend systems with the MERN stack.
        </motion.p>
<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: BASE + 0.85 }}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
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
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              }}
            />
          </a>
        </motion.div>
      </motion.div>
<motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BASE + 1.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
      >
        <motion.div
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-14 origin-top"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)" }}
        />
      </motion.div>
       <span
          className="text-[10px] tracking-[0.3em] uppercase absolute bottom-6 left-1/2 -translate-x-1/2"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Scroll
        </span>
    </section>
  );
}
