import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { skills } from "../data/skills";

const SkillCard = ({ category, items }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative p-6 rounded-2xl glass transition-all duration-300 hover:bg-white/10 group cursor-none"
    >
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="flex flex-col h-full"
      >
        <h3 className="text-xl font-medium text-white mb-6 border-b border-white/10 pb-4">{category}</h3>
        <div className="flex flex-wrap gap-2 mt-auto">
          {items.map((skill) => (
            <span 
              key={skill} 
              className="px-3 py-1 text-xs font-light tracking-wider uppercase text-white/70 bg-white/5 rounded-full border border-white/10 transition-colors group-hover:border-white/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
<motion.div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
        style={{ transform: "translateZ(1px)" }}
      />
    </motion.div>
  );
};

export default function Skills() {
  return (
    <section id="skills" className="relative w-full py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-[1px] bg-white/30" />
          <h2 className="text-white/50 text-sm tracking-widest uppercase">Ecosystem</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: 1000 }}>
          {skills.map((skillGroup, index) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, scale: 0.72, z: -120, rotateY: index % 2 ? -16 : 16, rotateX: index === 3 ? 10 : 0 }}
              whileInView={{ opacity: 1, scale: 1, z: 0, rotateY: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.95, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] }}
            >
              <SkillCard category={skillGroup.category} items={skillGroup.items} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
