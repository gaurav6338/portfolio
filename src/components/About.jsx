import { lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const InteractiveCore = lazy(() => import("./3d/InteractiveCore"));

export default function About() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section id="about" ref={containerRef} className="relative w-full py-32 md:py-48 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-20">
<motion.div 
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: y1 }}
          className="w-full md:w-1/2 flex flex-col items-start"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-[1px] bg-white/30" />
            <span className="text-white/50 text-sm tracking-widest uppercase">Who I am</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-8 leading-tight">
            I build <span className="text-white/40">interactive</span> web experiences and <span className="text-white/40">AI-powered</span> products.
          </h2>
          
          <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed mb-6">
            As a Full-Stack MERN developer, I bridge the gap between complex engineering and beautiful design. My focus is on creating modern web applications using React, Node.js, Express, and MongoDB.
          </p>
          
          <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed">
            Beyond the frontend, I have a strong interest in AI/ML, integrating intelligent features into digital platforms to build products that feel sophisticated and futuristic.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: y2 }}
          className="w-full md:w-5/12 h-[500px] relative rounded-3xl overflow-hidden glass"
        >
          <Suspense fallback={<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_48%)]" />}>
            <InteractiveCore />
          </Suspense>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/60 via-transparent to-white/5" />
        </motion.div>
      </div>
    </section>
  );
}
