import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, MeshDistortMaterial, Text, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Glitch, Noise } from '@react-three/postprocessing'
import { GlitchMode } from 'postprocessing'

function TheEntity({ color }) {
  return (
    <Float speed={10} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        {/* LOW POLY BRAIN */}
        <icosahedronGeometry args={[2, 1]} /> 
        <MeshDistortMaterial 
          color="#111" 
          emissive={color}
          emissiveIntensity={2}
          roughness={0.1}
          metalness={1}
          distort={0.4} // The Mesh itself ripples
          speed={5}
          wireframe={true} // Matrix Look
        />
      </mesh>
      {/* INNER CORE */}
      <mesh scale={0.5}>
         <sphereGeometry args={[2, 32, 32]} />
         <meshBasicMaterial color={color} />
      </mesh>
    </Float>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text font={font} fontSize={1} letterSpacing={0.2} color="white" position={[0, 0, 3]} anchorX="center" anchorY="middle">
        {text.toUpperCase()}
        <meshBasicMaterial color="white" toneMapped={false} />
      </Text>
    </Float>
  )
}

export default function GlitchGod({ primaryColor = '#00ff00', text = 'SYSTEM_FAILURE', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#00ff00'
  const finalText = deferredText || 'SYSTEM_FAILURE'

  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={['#000']} />
      
      <TheEntity color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      
      <Environment preset="warehouse" />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} intensity={1.5} radius={0.8} />
        <Noise opacity={0.2} />
        {/* THE DIGITAL TEAR */}
        <Glitch 
            delay={[1.5, 3.5]} // Min and max delay between glitches
            duration={[0.6, 1.0]} // Min and max duration of a glitch
            strength={[0.3, 1.0]} // Strength
            mode={GlitchMode.SPORADIC} // Sporadic glitches
            active 
            ratio={0.85} 
        />
      </EffectComposer>
      <OrbitControls autoRotate autoRotateSpeed={5} enableZoom={false} />
    </Canvas>
  )
}