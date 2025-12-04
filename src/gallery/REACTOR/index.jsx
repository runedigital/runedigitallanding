import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, MeshTransmissionMaterial, Sparkles, Text } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

function Core({ color }) {
  const ring1 = useRef()
  const ring2 = useRef()
  
  useFrame((state, delta) => {
    ring1.current.rotation.z += delta * 2
    ring2.current.rotation.x -= delta * 0.5
    ring2.current.rotation.y += delta * 0.5
  })

  return (
    <group>
      {/* PLASMA RING (The Sun) */}
      <group ref={ring1}>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[2, 0.3, 32, 100]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>

      {/* MAGNETIC CONTAINMENT (Glass) */}
      <group ref={ring2}>
        <mesh>
          <torusGeometry args={[2.5, 0.2, 16, 100]} />
          <MeshTransmissionMaterial 
            backside thickness={2} roughness={0.2} transmission={1} 
            chromaticAberration={1} color="#444" 
          />
        </mesh>
      </group>

      {/* INWARD SPARKS (Magnetic Field) */}
      <Sparkles 
        count={200} scale={6} size={6} speed={2} 
        opacity={1} color={color} noise={1} 
      />
    </group>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <group position={[0, -3.5, 0]}>
        <Text font={font} fontSize={0.8} letterSpacing={0.1} color="white" anchorX="center" anchorY="top">
          {text.toUpperCase()}
          <meshStandardMaterial toneMapped={false} />
        </Text>
        <Text font={font} position={[0, -0.6, 0]} fontSize={0.15} color={color} anchorX="center" anchorY="top">
          FUSION CONTAINMENT FIELD
          <meshStandardMaterial toneMapped={false} />
        </Text>
      </group>
    </Float>
  )
}

export default function Reactor({ primaryColor = '#ffaa00', text = 'REACTOR', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ffaa00'
  const finalText = deferredText || 'REACTOR'

  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#000']} />
      <Core color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={5} color={finalColor} distance={5} />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} intensity={2} radius={0.8} />
        <ChromaticAberration offset={[0.002, 0.002]} />
      </EffectComposer>
      <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
    </Canvas>
  )
}