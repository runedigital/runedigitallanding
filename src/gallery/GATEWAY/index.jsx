import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Float, 
  Stars, 
  OrbitControls, 
  Text, 
  Instance, 
  Instances,
  MeshDistortMaterial
} from '@react-three/drei'
import { EffectComposer, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

// --- 1. THE HYPER-CORE ---
const BlackHole = ({ color }) => {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.z += delta * 0.5
  })

  return (
    <group rotation={[0.5, 0, 0]}>
      {/* THE VOID */}
      <mesh>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      
      {/* ACCRETION DISK 1 */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[2.8, 0.4, 32, 100]} />
        <MeshDistortMaterial 
          color={color} 
          speed={5} 
          distort={0.4} 
          radius={1} 
          transparent 
          opacity={0.8} 
        />
      </mesh>

      {/* ACCRETION DISK 2 */}
      <mesh rotation={[Math.PI/2.1, 0, 0]} ref={ref}>
        <torusGeometry args={[3.5, 0.1, 16, 100]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.2} wireframe />
      </mesh>

      {/* EVENT HORIZON GLOW */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

// --- 2. THE STARGATE RINGS ---
const Stargate = ({ color }) => {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.z -= delta * 0.2
  })

  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[4.2, 0.2, 16, 100]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0.2} />
      </mesh>
      
      {/* ACTIVE CHEVRONS */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 9) * Math.PI * 2]} position={[0, 4, 0]}>
          <boxGeometry args={[0.6, 1, 0.3]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
        </mesh>
      ))}
    </group>
  )
}

// --- 3. PARTICLE STORM ---
const SpaceDust = ({ color }) => {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.05
  })
  
  return (
   <Instances range={200} ref={ref}>
    <dodecahedronGeometry args={[0.05, 0]} />
    <meshBasicMaterial color={color} toneMapped={false} />
    {Array.from({ length: 200 }).map((_, i) => (
     <Instance
      key={i}
      position={[
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 15
      ]}
      rotation={[Math.random(), Math.random(), Math.random()]}
     />
    ))}
   </Instances>
  )
}

// --- 4. HOLOGRAPHIC HUD ---
const HUD = ({ text, color, font }) => {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={[3.5, 0, 0]} rotation={[0, -0.5, 0]}>
        <Text
          font={font} // WIRED
          fontSize={0.3}
          color="white"
          anchorX="left"
          anchorY="middle"
          maxWidth={3}
          lineHeight={1.2}
        >
          {text ? text.toUpperCase() : "EVENT HORIZON"}
          <meshBasicMaterial toneMapped={false} />
        </Text>
        <mesh position={[0, -0.2, 0]}>
          <planeGeometry args={[2, 0.02]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <Text
          font={font}
          position={[0, -0.4, 0]}
          fontSize={0.1}
          color={color}
          anchorX="left"
        >
          SINGULARITY DETECTED
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </group>
    </Float>
  )
}

// --- MAIN EXPORT ---
export default function Gateway({ 
  primaryColor = "#ff0055", 
  text, 
  font 
}) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ff0055'
  const finalText = deferredText || 'GATEWAY'

  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#000']} />
      
      <group rotation={[0, 0, 0.2]}>
        <BlackHole color={finalColor} />
        <Stargate color={finalColor} />
      </group>
      
      <SpaceDust color={finalColor} />
      <HUD text={finalText} color={finalColor} font={font} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} intensity={2} color="#fff" />

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} intensity={2.5} mipmapBlur radius={0.6} />
        <Noise opacity={0.05} />
        <ChromaticAberration offset={[0.002, 0.002]} />
      </EffectComposer>
    </Canvas>
  )
}