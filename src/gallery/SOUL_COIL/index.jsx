import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, MeshDistortMaterial, Text, Sparkles, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

// --- THE COILED ARTIFACT ---
function CoiledHelix({ color }) {
  const ref = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.distort = 0.3 + Math.sin(t) * 0.1
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, 1, 0]}>
        {/* Abstract Twisted Knot - Legally Distinct */}
        <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 5]} />
        <MeshDistortMaterial 
          color="#111" 
          emissive={color}
          emissiveIntensity={2}
          roughness={0.8}
          metalness={0.2}
          distort={0.4} 
          speed={1}
        />
      </mesh>
      {/* INNER CORE HEAT */}
      <mesh position={[0, 1, 0]}>
         <sphereGeometry args={[0.8, 32, 32]} />
         <meshBasicMaterial color={color} />
      </mesh>
    </Float>
  )
}

function AshLake({ color }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <MeshDistortMaterial 
        color="#050505" 
        roughness={0.2} 
        metalness={0.8} 
        distort={0.2} 
        speed={0.5}
      />
    </mesh>
  )
}

function Embers({ color }) {
  return (
    <group position={[0, 0, 0]}>
      <Sparkles count={200} scale={[6, 8, 6]} size={6} speed={0.4} opacity={0.8} color={color} noise={0.2} />
      <Sparkles count={100} scale={[10, 10, 10]} size={2} speed={0.1} opacity={0.3} color="#888" />
    </group>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
      <group position={[0, -1, 3]}>
        <Text
          font={font}
          fontSize={0.8}
          letterSpacing={0.1}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {text.toUpperCase()}
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} toneMapped={false} />
        </Text>
        <Text
          font={font}
          position={[0, -0.6, 0]}
          fontSize={0.12}
          letterSpacing={0.3}
          color="#666"
          anchorX="center"
          anchorY="middle"
        >
          LINK RESTORED
          <meshStandardMaterial color="#666" toneMapped={false} />
        </Text>
      </group>
    </Float>
  )
}

export default function SoulCoil({ primaryColor = '#ff5500', text = 'IGNITED', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ff5500'
  const finalText = deferredText || 'IGNITED'

  return (
    <Canvas camera={{ position: [0, 1, 10], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={['#020202']} />
      <fog attach="fog" args={['#020202', 5, 15]} />
      
      <CoiledHelix color={finalColor} />
      <AshLake color={finalColor} />
      <Embers color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      
      <pointLight position={[0, 2, 0]} intensity={2} color={finalColor} distance={10} decay={2} />
      <ambientLight intensity={0.1} />
      <Environment preset="night" />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} intensity={1.2} radius={0.6} mipmapBlur />
        <Noise opacity={0.15} />
        <Vignette darkness={0.7} />
      </EffectComposer>
      
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  )
}