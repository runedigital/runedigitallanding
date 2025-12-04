import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  MeshTransmissionMaterial, 
  Text, 
  Float, 
  OrbitControls, 
  Environment, 
  Stars,
  Instance, 
  Instances
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// --- THE BRAND LABEL ---
const BrandLabel = ({ text, color, font }) => {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[0.2, 0.4]}>
      <group position={[0, -2.5, 0]}>
        {/* MAIN TEXT */}
        <Text
          font={font} // WIRED TO FONT SELECTOR
          fontSize={0.5}
          letterSpacing={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {text.toUpperCase()}
          <meshBasicMaterial toneMapped={false} />
        </Text>
        
        {/* GLOW UNDERSCORE */}
        <mesh position={[0, -0.4, 0]}>
          <planeGeometry args={[3, 0.02]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        
        {/* SUBTEXT */}
        <Text
          font={font}
          position={[0, -0.7, 0]}
          fontSize={0.15}
          letterSpacing={0.2}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          NEURAL ARCHITECTURE V2
          <meshBasicMaterial toneMapped={false} opacity={0.8} transparent />
        </Text>
      </group>
    </Float>
  )
}

// --- THE DATA RINGS ---
const DataRings = ({ color }) => {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.z += delta * 0.1
    ref.current.rotation.x += delta * 0.05
  })
  
  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="white" transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

// --- THE CORE CRYSTAL ---
const CrystalCore = ({ color }) => {
  const mesh = useRef()
  
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.2
    mesh.current.rotation.y += delta * 0.2
  })

  const config = {
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: 10,
    resolution: 1024,
    transmission: 1,
    roughness: 0.0,
    thickness: 3.5,
    ior: 1.5,
    chromaticAberration: 1,
    anisotropy: 1,
    distortion: 0.5,
    distortionScale: 0.5,
    temporalDistortion: 0.1,
    clearcoat: 1,
    attenuationDistance: 0.5,
    attenuationColor: '#ffffff',
    color: color, 
    bg: '#000000'
  }

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <group scale={0.8}>
        {/* THE DIAMOND */}
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.5, 0]} />
          <MeshTransmissionMaterial {...config} />
        </mesh>
        
        {/* INNER GLOW */}
        <mesh scale={0.5}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.5} wireframe />
        </mesh>
      </group>
    </Float>
  )
}

// --- NEURAL NODES ---
const NeuralField = ({ color }) => {
  return (
   <Instances range={100}>
    <sphereGeometry args={[0.03, 16, 16]} />
    <meshBasicMaterial color={color} toneMapped={false} />
    {Array.from({ length: 40 }).map((_, i) => (
     <Instance
      key={i}
      position={[
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ]}
     />
    ))}
   </Instances>
  )
}

// --- MAIN EXPORT ---
export default function DeepThink1({ 
  text = "CRYSTALIX", 
  primaryColor = "#00ffea",
  font 
}) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#00ffea'
  const finalText = deferredText || 'CRYSTALIX'

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#050505']} />
      
      <group>
        <CrystalCore color={finalColor} />
        <DataRings color={finalColor} />
        <BrandLabel text={finalText} color={finalColor} font={font} />
        <NeuralField color={finalColor} />
      </group>
      
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
      </EffectComposer>
    </Canvas>
  )
}