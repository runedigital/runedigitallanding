import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, MeshTransmissionMaterial, Text, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

function GlassPanels({ color }) {
  const group = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = t * 0.1
    group.current.children.forEach((child, i) => {
      // Gentle floating oscillation
      child.position.y = Math.sin(t + i) * 0.2
      child.rotation.z = Math.cos(t * 0.5 + i) * 0.05
    })
  })

  const panels = Array.from({ length: 5 })
  
  return (
    <group ref={group}>
      {panels.map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const radius = 2.5
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]} 
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[1.5, 2.5, 0.1]} />
            <MeshTransmissionMaterial 
              backside thickness={0.5} roughness={0} transmission={1} 
              ior={1.5} chromaticAberration={0.5} anisotropy={0.5} 
              distortion={0.2} distortionScale={0.5} temporalDistortion={0.1}
              color="#fff" background="black"
            />
            {/* Inner Border */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(1.5, 2.5, 0.1)]} />
              <lineBasicMaterial color={color} transparent opacity={0.5} />
            </lineSegments>
          </mesh>
        )
      })}
    </group>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
      <Text font={font} fontSize={1} letterSpacing={0.2} color={color} position={[0, 0, 0]} anchorX="center" anchorY="middle">
        {text.toUpperCase()}
        <meshStandardMaterial toneMapped={false} />
      </Text>
    </Float>
  )
}

export default function Vogue({ primaryColor = '#ffffff', text = 'VOGUE', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ffffff'
  const finalText = deferredText || 'VOGUE'

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#050505']} />
      <GlassPanels color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      <Environment preset="city" />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.8} intensity={1} radius={0.5} />
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
    </Canvas>
  )
}