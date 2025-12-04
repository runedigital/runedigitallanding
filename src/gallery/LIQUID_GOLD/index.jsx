import React, { useDeferredValue } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, MeshDistortMaterial, Text, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'

function MoltenCore({ color }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[1.6, 128, 128]} />
        <MeshDistortMaterial 
          color={color} 
          envMapIntensity={3} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={1} 
          roughness={0.1} 
          distort={0.3} // Slower, heavier distortion than Mercury
          speed={1} 
        />
      </mesh>
    </Float>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={[0, 0, 2.2]}>
        <Text font={font} fontSize={1.2} letterSpacing={0.1} color="white" anchorX="center" anchorY="middle">
          {text.toUpperCase()}
          <meshStandardMaterial color="white" emissive={color} emissiveIntensity={0.5} toneMapped={false} />
        </Text>
      </group>
    </Float>
  )
}

export default function LiquidGold({ primaryColor = '#ffcc00', text = 'GOLD', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ffcc00'
  const finalText = deferredText || 'GOLD'

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#000']} />
      <MoltenCore color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      
      {/* WARM STUDIO LIGHTING */}
      <Environment preset="sunset" />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} intensity={1.5} radius={0.6} />
        <Noise opacity={0.05} />
      </EffectComposer>
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
    </Canvas>
  )
}