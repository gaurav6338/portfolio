import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      const sections = links.map(link => document.querySelector(link.href));
      const scrollPosition = window.scrollY + 200;
      
      sections.forEach((section) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActive(section.id.charAt(0).toUpperCase() + section.id.slice(1));
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 flex justify-center py-6 px-6 ${
          scrolled ? "py-4" : "py-8"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 max-w-6xl w-full ${
            scrolled ? "bg-white/5 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full" : "px-4"
          }`}
        >
          <a href="#home" className="text-white text-xl font-light tracking-[0.2em] relative group">
            GR
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
<ul className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setActive(link.name)}
                  className={`text-sm tracking-widest uppercase transition-colors duration-300 relative ${
                    active === link.name ? "text-white" : "text-white/50 hover:text-white"
                  }`}
                >
                  {link.name}
                  {active === link.name && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
<button 
            className="md:hidden text-white/80 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </motion.nav>
<AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} strokeWidth={1} />
            </button>
            <ul className="flex flex-col items-center space-y-8">
              {links.map((link, i) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <a
                    href={link.href}
                    onClick={() => {
                      setActive(link.name);
                      setMobileMenuOpen(false);
                    }}
                    className="text-3xl font-light tracking-widest uppercase text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
