import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, MeshTransmissionMaterial, Text, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'

function Monolith({ color }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.position.y = Math.sin(t * 0.5) * 0.2 // Slow hover
  })

  return (
    <group ref={ref}>
      {/* THE GLASS SHELL */}
      <mesh>
        <boxGeometry args={[2, 6, 2]} />
        <MeshTransmissionMaterial 
          backside thickness={3} roughness={0.1} transmission={1} 
          ior={1.5} chromaticAberration={1} anisotropy={1} 
          color="#000" background="#000"
        />
      </mesh>
      
      {/* THE DATA CORE (INTERNAL) */}
      <mesh scale={[0.8, 0.95, 0.8]}>
        <boxGeometry args={[2, 6, 2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.1} />
      </mesh>
      
      {/* INTERNAL PULSE LIGHT */}
      <pointLight position={[0, 0, 0]} intensity={5} color={color} distance={4} />
    </group>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={[0, -3.5, 0]}>
        <Text font={font} fontSize={0.8} letterSpacing={0.1} color="white" anchorX="center" anchorY="top">
          {text.toUpperCase()}
          <meshStandardMaterial toneMapped={false} />
        </Text>
        <Text font={font} position={[0, -0.6, 0]} fontSize={0.15} letterSpacing={0.2} color={color} anchorX="center" anchorY="top">
          ARCHITECT CLASS STRUCTURE
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </group>
    </Float>
  )
}

export default function Obelisk({ primaryColor = '#ffffff', text = 'OBELISK', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ffffff'
  const finalText = deferredText || 'OBELISK'

  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 5, 20]} />
      
      <Monolith color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      
      <Environment preset="city" />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} intensity={1.5} mipmapBlur />
        <Noise opacity={0.1} />
      </EffectComposer>
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
    </Canvas>
  )
}