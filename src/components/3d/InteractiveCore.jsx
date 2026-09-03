import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, OrbitControls } from "@react-three/drei";
import { MathUtils } from "three";

const stacks = [
  { name: "React", color: "#61dafb", angle: 0.3, height: 0.9 },
  { name: "Node.js", color: "#77b255", angle: 1.6, height: 0.35 },
  { name: "MongoDB", color: "#35a560", angle: 2.85, height: -0.55 },
  { name: "Three.js", color: "#d9d9d9", angle: 4.1, height: 0.6 },
  { name: "Express", color: "#9f8cff", angle: 5.25, height: -0.25 },
];

function Stack({ stack, index, scene }) {
  const group = useRef(null);
  const material = useRef(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const energy = Math.max(0, 1 - (performance.now() / 1000 - scene.current.pulseAt) * 0.7);
    const angle = stack.angle + state.clock.getElapsedTime() * 0.18 + scene.current.rotation * 0.3;
    const radius = 2.18 + Math.sin(state.clock.getElapsedTime() * 1.1 + index) * 0.08;
    group.current.position.set(Math.cos(angle) * radius, stack.height + Math.sin(angle * 2) * 0.22, Math.sin(angle) * radius);
    group.current.rotation.y = -angle + Math.PI / 2;
    const active = scene.current.active === index;
    const scale = MathUtils.damp(group.current.scale.x, active ? 1.24 + energy * 0.12 : 1, 5, delta);
    group.current.scale.setScalar(scale);
    material.current.emissiveIntensity = MathUtils.damp(material.current.emissiveIntensity, active ? 0.8 + energy : 0.16, 5, delta);
  });

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[0.64, 0.38, 0.1]} />
        <meshStandardMaterial ref={material} color={stack.color} emissive={stack.color} emissiveIntensity={0.16} metalness={0.42} roughness={0.22} />
      </mesh>
      <Html transform distanceFactor={7} position={[0, 0, 0.08]} className="pointer-events-none select-none">
        <span className="rounded-full border border-white/20 bg-black/55 px-2 py-1 text-[8px] font-medium tracking-[0.12em] text-white/90 backdrop-blur-md">{stack.name}</span>
      </Html>
    </group>
  );
}

function LearningScene({ scene }) {
  const globe = useRef(null);

  useFrame((state, delta) => {
    if (!globe.current) return;
    globe.current.rotation.y = MathUtils.damp(globe.current.rotation.y, scene.current.rotation + state.clock.getElapsedTime() * 0.1, 3, delta);
    globe.current.rotation.x = MathUtils.damp(globe.current.rotation.x, -scene.current.pointerY * 0.16, 3, delta);
  });

  return (
    <>
      <group ref={globe}>
        <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.32}>
          <mesh>
            <sphereGeometry args={[1.55, 64, 64]} />
            <meshPhysicalMaterial color="#80bde0" transmission={0.66} transparent opacity={0.5} roughness={0.1} metalness={0.08} ior={1.35} thickness={0.8} clearcoat={1} />
          </mesh>
          <mesh scale={1.008}>
            <sphereGeometry args={[1.55, 32, 22]} />
            <meshBasicMaterial color="#bfe9ff" wireframe transparent opacity={0.12} />
          </mesh>
        </Float>
      </group>
      {stacks.map((stack, index) => <Stack key={stack.name} stack={stack} index={index} scene={scene} />)}
    </>
  );
}

export default function InteractiveCore() {
  const scene = useRef({ pointerX: 0, pointerY: 0, rotation: 0, active: 0, pulseAt: -100 });

  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0.2, 7.3], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      onPointerMove={(event) => {
        scene.current.pointerX = event.pointer.x;
        scene.current.pointerY = event.pointer.y;
        scene.current.rotation = event.pointer.x * 0.34;
      }}
      onClick={() => {
        scene.current.active = (scene.current.active + 1) % stacks.length;
        scene.current.pulseAt = performance.now() / 1000;
      }}
    >
      <color attach="background" args={["#050914"]} />
      <ambientLight intensity={1.2} />
      <pointLight position={[3.5, 4, 5]} intensity={22} color="#c9edff" />
      <pointLight position={[-4, 0, 3]} intensity={10} color="#6d8fff" />
      <pointLight position={[1, -3, 2]} intensity={7} color="#5ce0c5" />
      <LearningScene scene={scene} />
      <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.35} />
    </Canvas>
  );
}
