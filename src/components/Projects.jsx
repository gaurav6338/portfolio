import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { projects } from "../data/projects";
import { Code2, ExternalLink } from "lucide-react";

const ProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.72, z: -150, rotateX: index % 2 === 0 ? 10 : -10 }}
      whileInView={{ opacity: 1, scale: 1, z: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="project-card relative w-full rounded-[2rem] glass overflow-hidden cursor-none group"
    >
      <div className="flex flex-col lg:flex-row w-full min-h-[500px]">
<div className="w-full lg:w-3/5 relative overflow-hidden bg-black/20">
          <motion.img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700"
            animate={{
              scale: isHovered ? 1.05 : 1
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent hidden lg:block" />
        </div>
<div 
          className="w-full lg:w-2/5 p-10 flex flex-col justify-between relative z-10"
          style={{ transform: "translateZ(50px)" }}
        >
          <div>
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6">
              {project.title}
            </h3>
            <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {project.tech.map((t) => (
                <span key={t} className="px-4 py-1.5 text-xs tracking-widest uppercase text-white/80 bg-white/5 border border-white/10 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm tracking-widest uppercase text-white/70 hover:text-white transition-colors group/link">
              <Code2 size={18} />
              <span className="relative overflow-hidden">
                <span className="block group-hover/link:-translate-y-full transition-transform duration-300">Code</span>
                <span className="absolute top-0 block translate-y-full group-hover/link:translate-y-0 transition-transform duration-300">Code</span>
              </span>
            </a>
            <a href={project.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm tracking-widest uppercase text-white/70 hover:text-white transition-colors group/link">
              <ExternalLink size={18} />
              <span className="relative overflow-hidden">
                <span className="block group-hover/link:-translate-y-full transition-transform duration-300">Live</span>
                <span className="absolute top-0 block translate-y-full group-hover/link:translate-y-0 transition-transform duration-300">Live</span>
              </span>
            </a>
          </div>
        </div>
      </div>
<motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-[2rem]"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)",
          left: glareX,
          top: glareY,
          transform: "translate(-50%, -50%)"
        }}
      />
    </motion.div>
  );
};

export default function Projects() {
  return (
    <section id="projects" className="relative w-full py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-white/30" />
            <h2 className="text-white/50 text-sm tracking-widest uppercase">Selected Work</h2>
          </div>
        </div>
        
        <div className="flex flex-col gap-24" style={{ perspective: 1500 }}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
