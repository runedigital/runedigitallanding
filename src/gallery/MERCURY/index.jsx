import React, { useDeferredValue } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { Float, Sparkles, Environment, MeshDistortMaterial, OrbitControls, Sphere, Lightformer, Text } from '@react-three/drei'
import * as THREE from 'three'

function LiquidMetal({ color }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere args={[1.5, 128, 128]}>
        <MeshDistortMaterial 
          color={color} 
          envMapIntensity={1.2} 
          clearcoat={1} 
          clearcoatRoughness={0} 
          metalness={0.9} 
          roughness={0.1}
          distort={0.5} 
          speed={2}
        />
      </Sphere>
    </Float>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        font={font}
        fontSize={1.5}
        letterSpacing={0.1}
        color={color}
        position={[0, 0, 2.2]} 
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {text.toUpperCase()}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </Text>
    </Float>
  )
}

function Lighting() {
  return (
    <Environment resolution={512}>
      <group rotation={[-Math.PI / 3, 0, 1]}>
        <Lightformer form="rect" intensity={4} position={[4, 0, 2]} scale={5} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={2} position={[-2, 2, 2]} scale={5} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} position={[-2, -2, 2]} scale={5} target={[0, 0, 0]} />
      </group>
    </Environment>
  )
}

export default function Mercury({ primaryColor = '#ffffff', text = 'MERCURY', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ffffff'
  const finalText = deferredText || 'MERCURY'

  return (
    <Canvas 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#050505' }} 
      camera={{ position: [0, 0, 12], fov: 35 }}
      dpr={[1, 2]}
    >
      <LiquidMetal color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      <Lighting />
      <Sparkles count={300} scale={10} size={2} speed={0.4} opacity={0.5} color={finalColor} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.8} radius={0.4} />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  )
}