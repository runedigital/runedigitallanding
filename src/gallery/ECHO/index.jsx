import React, { useRef, useDeferredValue, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Instances, Instance, Text, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'

function Visualizer({ color }) {
  const ref = useRef()
  const count = 60
  const radius = 3

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.1
    // ANIMATE BARS
    ref.current.children.forEach((bar, i) => {
      const angle = (i / count) * Math.PI * 2
      // Simulate Audio Waveform using Sin/Cos
      const wave = Math.sin(angle * 4 + t * 2) + Math.cos(angle * 8 - t * 4)
      const height = 1 + Math.abs(wave) * 3
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, height, 0.1)
      bar.color.set(color) // Dynamic Color update
    })
  })

  return (
    <Instances range={count} ref={ref}>
      <boxGeometry args={[0.2, 1, 0.2]} />
      <meshStandardMaterial toneMapped={false} emissive={color} emissiveIntensity={2} />
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return <Instance key={i} position={[x, 0, z]} rotation={[0, -angle, 0]} />
      })}
    </Instances>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0}>
      <Text font={font} fontSize={1.5} letterSpacing={-0.05} color="white" position={[0, 0, 0]} anchorX="center" anchorY="middle">
        {text.toUpperCase()}
        <meshBasicMaterial color="white" toneMapped={false} />
      </Text>
    </Float>
  )
}

export default function Echo({ primaryColor = '#00ffea', text = 'ECHO', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#00ffea'
  const finalText = deferredText || 'ECHO'

  return (
    <Canvas camera={{ position: [0, 2, 12], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#050505']} />
      
      <Visualizer color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      
      <Environment preset="city" />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} intensity={1.5} radius={0.6} mipmapBlur />
        <Noise opacity={0.1} />
      </EffectComposer>
      <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} />
    </Canvas>
  )
}