import React, { useRef, useDeferredValue, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Instances, Instance, Text, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function Particles({ color }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.1
    ref.current.children.forEach((instance, i) => {
      const factor = i % 2 === 0 ? 1 : -1
      instance.position.y += Math.sin(t * factor + i) * 0.002
    })
  })

  return (
    <Instances range={1000} ref={ref}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial color="#333" emissive={color} emissiveIntensity={2} toneMapped={false} />
      {Array.from({ length: 1000 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 5
        const y = (Math.random() - 0.5) * 5
        const z = (Math.random() - 0.5) * 5
        return <Instance key={i} position={[x, y, z]} />
      })}
    </Instances>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text font={font} fontSize={1.2} letterSpacing={-0.05} color="white" position={[0, 0, 2]} anchorX="center" anchorY="middle">
        {text.toUpperCase()}
        <meshStandardMaterial color="white" emissive={color} emissiveIntensity={0.8} toneMapped={false} />
      </Text>
    </Float>
  )
}

export default function Swarm({ primaryColor = '#ff0055', text = 'SWARM', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ff0055'
  const finalText = deferredText || 'SWARM'

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={['#000']} />
      <Particles color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      <Environment preset="studio" />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} intensity={1.5} radius={0.5} mipmapBlur />
        <Vignette darkness={0.6} />
      </EffectComposer>
      <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} />
    </Canvas>
  )
}