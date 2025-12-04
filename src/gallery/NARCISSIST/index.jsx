import React, { useDeferredValue } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, MeshDistortMaterial, Environment, Text } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing'

function BlackMirror({ color }) {
  return (
    <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        {/* THE CORE - Black Oil with Colored Rim Reflection */}
        <sphereGeometry args={[1.8, 128, 128]} />
        <MeshDistortMaterial 
          color="#000000" 
          envMapIntensity={2} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={1} 
          roughness={0} 
          distort={0.6} 
          speed={3}
        />
      </mesh>
      {/* THE HALO - Wireframe Color Tint */}
      <mesh scale={1.2}>
         <sphereGeometry args={[1.8, 64, 64]} />
         <meshBasicMaterial color={color} wireframe transparent opacity={0.1} />
      </mesh>
    </Float>
  )
}

function Shards({ color }) {
  return (
    <group>
      {Array.from({ length: 50 }).map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
          <mesh position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5]}>
            <dodecahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial color="#111" emissive={color} emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <Text
        font={font}
        fontSize={1}
        letterSpacing={0.1}
        color="white"
        position={[0, 0, 2.5]} 
        anchorX="center"
        anchorY="middle"
      >
        {text.toUpperCase()}
        <meshStandardMaterial color="white" emissive={color} emissiveIntensity={0.5} toneMapped={false} />
      </Text>
    </Float>
  )
}

export default function Narcissist({ primaryColor = '#ff0000', text = 'NARCISSIST', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ff0000'
  const finalText = deferredText || 'NARCISSIST'

  return (
    <Canvas camera={{ position: [0, 0, 8] }} dpr={[1, 2]}>
      <color attach="background" args={['#000']} />
      
      <BlackMirror color={finalColor} />
      <Shards color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      
      <Environment preset="warehouse" />
      <ambientLight intensity={0.5} />
      {/* Dynamic Light Source */}
      <pointLight position={[10, 10, 10]} intensity={2} color={finalColor} />
      
      <OrbitControls autoRotate autoRotateSpeed={3} enableZoom={false} />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} intensity={1.5} radius={0.5} />
        <ChromaticAberration offset={[0.005, 0.005]} />
        <Noise opacity={0.1} />
        <Vignette darkness={0.8} />
      </EffectComposer>
    </Canvas>
  )
}