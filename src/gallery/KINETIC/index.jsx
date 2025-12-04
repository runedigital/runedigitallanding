import React, { useMemo, useState, useDeferredValue } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, usePlane, useBox, useSphere } from '@react-three/cannon'
import { EffectComposer, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { 
  OrbitControls, 
  Sparkles, 
  Stars, 
  Text, 
  Float, 
  Environment, 
  MeshTransmissionMaterial, 
  MeshReflectorMaterial 
} from '@react-three/drei'
import * as THREE from 'three'

// --- 1. THE BRAND LOGO (PHYSICAL OBSTACLE) ---
function BrandObstacle({ text, color, font }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [0, 2, -2], 
    args: [6, 2, 1]
  }))

  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          font={font} // WIRED
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {text.toUpperCase() || "KINETIC"}
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} toneMapped={false} />
        </Text>
      </Float>
    </group>
  )
}

// --- 2. THE HEAVY CUBE ---
function HeavyCube({ color }) {
  const [ref] = useBox(() => ({ 
    mass: 5, 
    position: [0, 5, 0], 
    args: [1.5, 1.5, 1.5],
    rotation: [0.5, 0.5, 0]
  }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <MeshTransmissionMaterial
        transmission={1}
        thickness={1.5}
        roughness={0.1}
        chromaticAberration={0.2}
        distortionScale={0.2}
        temporalDistortion={0.2}
        background="#000"
        color={color} 
      />
    </mesh>
  )
}

// --- 3. THE NEON SPHERE ---
function Ball({ position, color }) {
  const [ref] = useSphere(() => ({
    mass: 1,
    position: position,
    args: [0.3],
    material: { friction: 0.1, restitution: 0.9 }
  }))

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.8} 
        metalness={0.5} 
        roughness={0.2} 
        toneMapped={false}
      />
    </mesh>
  )
}

// --- 4. THE GLASS PRISON ---
function Walls() {
  usePlane(() => ({ position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] }))
  usePlane(() => ({ position: [0, 12, 0], rotation: [Math.PI / 2, 0, 0] }))
  usePlane(() => ({ position: [0, 0, -5], rotation: [0, 0, 0] }))
  usePlane(() => ({ position: [0, 0, 5], rotation: [0, -Math.PI, 0] }))
  usePlane(() => ({ position: [-7, 0, 0], rotation: [0, Math.PI / 2, 0] }))
  usePlane(() => ({ position: [7, 0, 0], rotation: [0, -Math.PI / 2, 0] }))
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <MeshReflectorMaterial blur={[400, 100]} resolution={1024} mixBlur={1} mixStrength={1.5} roughness={0.5} depthScale={1} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#151515" metalness={0.6} />
    </mesh>
  )
}

// --- 5. SIMULATION CONTROLLER ---
function Simulation({ color, text, font, gravityOn, toggleGravity }) {
  const balls = useMemo(() => {
    return new Array(40).fill(0).map(() => [(Math.random() - 0.5) * 6, 5 + Math.random() * 5, (Math.random() - 0.5) * 4])
  }, [])

  return (
    <Physics gravity={[0, gravityOn ? -9.81 : 1, 0]}>
      <group onClick={toggleGravity}>
        <Walls />
        <BrandObstacle text={text} color={color} font={font} />
        <HeavyCube color={color} />
        {balls.map((pos, i) => (
          <Ball key={i} position={pos} color={color} />
        ))}
      </group>
    </Physics>
  )
}

// --- MAIN EXPORT ---
export default function Kinetic({ 
  primaryColor = "#00ffea", 
  text = "KINETIC",
  font 
}) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#00ffea'
  const finalText = deferredText || 'KINETIC'
  const [gravityOn, setGravityOn] = useState(true)

  return (
    <Canvas 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#050505' }}
      camera={{ position: [4, 8, 12], fov: 45 }}
      shadows
      dpr={[1, 2]}
    >
      <color attach="background" args={['#050505']} />
      
      <Simulation 
        color={finalColor} 
        text={finalText} 
        font={font} 
        gravityOn={gravityOn} 
        toggleGravity={() => setGravityOn(!gravityOn)} 
      />
      
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} castShadow />
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Sparkles count={100} scale={15} size={4} speed={0.4} color={finalColor} />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} intensity={1.5} mipmapBlur radius={0.4} />
        <Noise opacity={0.05} />
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
      
      <OrbitControls maxPolarAngle={Math.PI / 2} enableZoom={false} />
    </Canvas>
  )
}