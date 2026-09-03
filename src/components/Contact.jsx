import { motion } from "framer-motion";
import { Code2, BriefcaseBusiness, FileText, ArrowUpRight } from "lucide-react";
import resumeUrl from "../assets/Gaurav_resume.pdf";

export default function Contact() {
  return (
    <section id="contact" className="relative w-full min-h-screen py-32 px-6 flex flex-col justify-center overflow-hidden">
<div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
        <div className="w-[800px] h-[800px] rounded-full border-[1px] border-white/5 animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[600px] h-[600px] rounded-full border-[1px] border-white/10 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-3xl animate-pulse" />
        <motion.div animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.2, 0.45, 0.2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute flex items-center justify-center w-28 h-28 rounded-full border border-white/20 text-[10px] tracking-[0.25em] text-white/55 uppercase">
          Let's Build
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row justify-between items-end gap-20">
<div className="w-full lg:w-1/2 flex flex-col items-start">
          <motion.div 
            initial={{ opacity: 0, clipPath: "circle(0% at 0% 50%)" }}
            whileInView={{ opacity: 1, clipPath: "circle(150% at 0% 50%)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-[1px] bg-white/30" />
              <span className="text-white/50 text-sm tracking-widest uppercase">What's Next</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white mb-10 leading-none">
              Let's build<br />
              <span className="text-white/40">something<br />remarkable.</span>
            </h2>
            
            <a 
              href="mailto:gauravrai01882002@gmail.com"
              className="group flex items-center gap-6 pb-6 border-b border-white/20 hover:border-white transition-colors duration-300"
            >
              <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-light text-white/80 group-hover:text-white transition-colors break-all">
                gauravrai01882002@gmail.com
              </span>
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                <ArrowUpRight strokeWidth={1} />
              </div>
            </a>
          </motion.div>
        </div>
<motion.div 
          initial={{ opacity: 0, scale: 0.76, rotateZ: 7 }}
          whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/3"
        >
          <div className="flex flex-col gap-6">
            {[
              { name: "GitHub", icon: Code2, url: "https://github.com/gaurav6338" },
              { name: "LinkedIn", icon: BriefcaseBusiness, url: "https://www.linkedin.com/in/gaurav-rai-1166322a4/" },
              { name: "Resume", icon: FileText, url: resumeUrl },
            ].map((link) => (
              <a 
                key={link.name} 
                href={link.url}
                target={link.url.startsWith("http") || link.name === "Resume" ? "_blank" : undefined}
                rel={link.url.startsWith("http") || link.name === "Resume" ? "noreferrer" : undefined}
                className="group flex items-center justify-between p-8 rounded-3xl glass hover:bg-white/10 transition-colors duration-500 hover:-translate-y-1 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-6">
                  <link.icon className="text-white/50 group-hover:text-white transition-colors" strokeWidth={1.5} size={28} />
                  <span className="text-xl font-light text-white/80 group-hover:text-white transition-colors tracking-wide">
                    {link.name}
                  </span>
                </div>
                <ArrowUpRight className="text-white/0 group-hover:text-white/50 transition-all -translate-x-4 group-hover:translate-x-0" />
              </a>
            ))}
          </div>
          <a href="tel:+918317086338" className="mt-8 inline-flex text-sm tracking-widest uppercase text-white/50 hover:text-white transition-colors">
            +91 83170 86338
          </a>
        </motion.div>

      </div>
<div className="absolute bottom-8 left-0 right-0 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs tracking-widest uppercase">
          <span>© {new Date().getFullYear()} Gaurav Rai</span>
        </div>
      </div>
    </section>
  );
}
