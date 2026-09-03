import { lazy, Suspense, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

const Background3D = lazy(() => import("./components/3d/Background3D"));

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-white z-[9999] origin-left"
      style={{ scaleX }}
    />
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useSmoothScroll();

  return (
    <>
      <CustomCursor />

      <LoadingScreen onComplete={() => setLoading(false)} />

      {!loading && (
        <main className="relative isolate w-full min-h-screen" style={{ backgroundColor: "#02030a", color: "#ffffff" }}>
          <ScrollProgress />
          <Suspense fallback={null}>
            <Background3D />
          </Suspense>
          <div className="relative z-10">
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </div>
        </main>
      )}
    </>
  );
}

export default App;
