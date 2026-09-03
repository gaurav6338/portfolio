import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { MathUtils, Vector3 } from "three";

const nodeStops = [0.02, 0.16, 0.3, 0.42, 0.52, 0.62, 0.72, 0.84, 0.96];

function HelixNode({ angle, y, progress }) {
  const node = useRef(null);
  const branch = useRef(null);

  useFrame((_, delta) => {
    const distance = Math.abs(progress.current - (12 - y) / 64);
    const intensity = MathUtils.clamp(1 - distance * 9, 0, 1);
    if (node.current) {
      const size = MathUtils.damp(node.current.scale.x, 0.8 + intensity * 1.9, 5, delta);
      node.current.scale.setScalar(size);
      node.current.material.opacity = MathUtils.damp(node.current.material.opacity, 0.16 + intensity * 0.8, 5, delta);
    }
    if (branch.current) {
      branch.current.scale.x = MathUtils.damp(branch.current.scale.x, 0.15 + intensity * 0.85, 5, delta);
      branch.current.material.opacity = MathUtils.damp(branch.current.material.opacity, 0.05 + intensity * 0.5, 5, delta);
    }
  });

  const radius = 2.25;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  return (
    <group position={[x, y, z]} rotation={[0, -angle, 0]}>
      <mesh ref={branch} position={[1.15, 0, 0]}>
        <boxGeometry args={[2.3, 0.025, 0.025]} />
        <meshBasicMaterial color="#b9d7ff" transparent opacity={0.12} />
      </mesh>
      <mesh ref={node}>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshBasicMaterial color="#effaff" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function DNAJourney({ motion }) {
  const helix = useRef(null);
  const progress = useRef(0);
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  const isCompact = typeof window !== "undefined" && window.innerWidth < 768;
  const points = useMemo(() => {
    const count = isCompact ? 38 : 74;
    return Array.from({ length: count }, (_, index) => {
      const t = index / (count - 1);
      const angle = t * Math.PI * 13;
      return { angle, y: 12 - t * 64 };
    });
  }, [isCompact]);
  const desiredPosition = useMemo(() => new Vector3(), []);
  const lookAt = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const sceneCamera = cameraRef.current;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const targetProgress = MathUtils.clamp(motion.current.scroll / maxScroll, 0, 1);
    progress.current = MathUtils.damp(progress.current, targetProgress, 2.4, delta);

    const angle = progress.current * Math.PI * (isCompact ? 5 : 7);
    const cameraY = 9 - progress.current * 60;
    const cameraRadius = isCompact ? 0.18 : 0.52;
    desiredPosition.set(Math.cos(angle) * cameraRadius, cameraY, Math.sin(angle) * cameraRadius + 7.5);
    sceneCamera.position.lerp(desiredPosition, 1 - Math.exp(-2.4 * delta));

    lookAt.set(Math.cos(angle + 0.38) * 0.55, cameraY - 3.8, Math.sin(angle + 0.38) * 0.55 - 1.8);
    sceneCamera.lookAt(lookAt);
    sceneCamera.rotation.z = MathUtils.damp(sceneCamera.rotation.z, angle * 0.026, 1.8, delta);

    if (helix.current) {
      helix.current.rotation.y = MathUtils.damp(helix.current.rotation.y, progress.current * 0.65 + state.clock.getElapsedTime() * 0.035, 1.6, delta);
      helix.current.position.z = MathUtils.damp(helix.current.position.z, motion.current.velocity * 2, 2.2, delta);
    }
  });

  return (
    <group ref={helix}>
      {points.map(({ angle, y }, index) => {
        const radius = 2.25;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const secondAngle = angle + Math.PI;
        return (
          <group key={index}>
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[isCompact ? 0.07 : 0.1, 12, 12]} />
              <meshBasicMaterial color="#d9efff" transparent opacity={0.3} />
            </mesh>
            <mesh position={[Math.cos(secondAngle) * radius, y, Math.sin(secondAngle) * radius]}>
              <sphereGeometry args={[isCompact ? 0.07 : 0.1, 12, 12]} />
              <meshBasicMaterial color="#b69cff" transparent opacity={0.25} />
            </mesh>
            {index % 3 === 0 && (
              <mesh position={[0, y, 0]} rotation={[0, -angle, 0]}>
                <boxGeometry args={[radius * 2, 0.022, 0.022]} />
                <meshBasicMaterial color="#90b9de" transparent opacity={0.11} />
              </mesh>
            )}
          </group>
        );
      })}
      {nodeStops.map((stop, index) => (
        <HelixNode key={stop} angle={stop * Math.PI * 13 + (index % 2 ? Math.PI : 0)} y={12 - stop * 64} progress={progress} />
      ))}
    </group>
  );
}

function GalaxyLayers() {
  const distant = useRef(null);
  const medium = useRef(null);
  const dust = useRef(null);
  const foreground = useRef(null);
  const motion = useRef({ mouseX: 0, mouseY: 0, scroll: 0, velocity: 0, previousScroll: 0 });
  const isCompact = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const updatePointer = (event) => {
      motion.current.mouseX = event.clientX / window.innerWidth - 0.5;
      motion.current.mouseY = event.clientY / window.innerHeight - 0.5;
    };
    const updateScroll = () => {
      const nextScroll = window.scrollY;
      motion.current.velocity = MathUtils.clamp((nextScroll - motion.current.previousScroll) * 0.003, -0.25, 0.25);
      motion.current.previousScroll = nextScroll;
      motion.current.scroll = nextScroll;
    };
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  useFrame((_, delta) => {
    const { mouseX, mouseY, scroll, velocity } = motion.current;
    const travel = (scroll % 5000) / 5000;
    motion.current.velocity = MathUtils.damp(velocity, 0, 2.6, delta);
    const animateLayer = (layer, depth, drift) => {
      if (!layer) return;
      layer.position.x = MathUtils.damp(layer.position.x, mouseX * depth, 1.4, delta);
      layer.position.y = MathUtils.damp(layer.position.y, -mouseY * depth + travel * drift, 1.4, delta);
      layer.position.z = MathUtils.damp(layer.position.z, velocity * depth * 5, 1.8, delta);
    };
    animateLayer(distant.current, 0.08, 0.1);
    animateLayer(medium.current, 0.22, 0.28);
    animateLayer(dust.current, 0.42, 0.5);
    animateLayer(foreground.current, 0.72, 0.8);
  });

  return (
    <>
      <DNAJourney motion={motion} />
      <group ref={distant}><Stars radius={100} depth={60} count={isCompact ? 900 : 3000} factor={3.4} saturation={0.22} fade speed={0.14} /></group>
      <group ref={medium}><Sparkles count={isCompact ? 60 : 180} scale={[28, 28, 15]} size={1.25} speed={0.08} opacity={0.23} color="#b9d7ff" /></group>
      <group ref={dust}><Sparkles count={isCompact ? 25 : 80} scale={[20, 18, 8]} size={3.1} speed={0.04} opacity={0.13} color="#8d6cff" /></group>
      <group ref={foreground}><Sparkles count={isCompact ? 15 : 40} scale={[13, 13, 5]} size={2.2} speed={0.12} opacity={0.16} color="#e8f5ff" /></group>
    </>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 9, 7.5], fov: 45 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#02030a"]} />
        <fog attach="fog" args={["#02030a", 12, 45]} />
        <GalaxyLayers />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(49,65,125,0.16),transparent_37%),radial-gradient(ellipse_at_82%_68%,rgba(83,45,127,0.12),transparent_40%),linear-gradient(to_bottom,rgba(2,3,10,0.08),rgba(2,3,10,0.48))]" />
    </div>
  );
}
