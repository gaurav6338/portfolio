import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { experience } from "../data/experience";

export default function Experience() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" ref={containerRef} className="relative w-full py-32 md:py-48 px-6 overflow-x-clip">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-24">
          <div className="w-12 h-[1px] bg-white/30" />
          <h2 className="text-white/50 text-sm tracking-widest uppercase">Experience & Education</h2>
        </div>
        
        <div className="relative">
<div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2" />
          <motion.div 
            className="absolute left-0 md:left-1/2 top-0 w-[2px] bg-white -translate-x-1/2 origin-top"
            style={{ height: lineHeight }}
          />

          <div className="flex flex-col gap-16 md:gap-24">
            {experience.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: isEven ? 70 : -70, rotateY: isEven ? -8 : 8, scale: 0.82 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
<div className="absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-black border-2 border-white rounded-full -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
<div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 text-left'}`}>
                    <div className="p-8 rounded-3xl glass hover:bg-white/10 transition-colors duration-500 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <span className="inline-block py-1 px-3 rounded-full border border-white/20 text-xs tracking-widest uppercase text-white/50 mb-6">
                          {item.date}
                        </span>
                        <h3 className="text-2xl font-medium text-white mb-2">{item.title}</h3>
                        <h4 className="text-lg font-light text-white/70 mb-6">{item.company}</h4>
                        <p className="text-white/50 font-light leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
