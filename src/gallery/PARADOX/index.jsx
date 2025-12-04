import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Text, Torus, Sphere } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

function Mechanism({ color }) {
  const r1 = useRef(); const r2 = useRef(); const r3 = useRef()
  
  useFrame((state, delta) => {
    r1.current.rotation.x += delta * 0.5
    r2.current.rotation.y -= delta * 0.3
    r2.current.rotation.z += delta * 0.1
    r3.current.rotation.x -= delta * 0.2
  })

  return (
    <group>
      {/* RING 1 */}
      <group ref={r1}>
        <Torus args={[2.5, 0.05, 16, 100]}>
           <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
        </Torus>
      </group>
      {/* RING 2 */}
      <group ref={r2}>
        <Torus args={[2, 0.1, 16, 100]}>
           <meshStandardMaterial color="#333" metalness={1} roughness={0.2} />
        </Torus>
        <Torus args={[2.1, 0.02, 16, 100]}>
           <meshBasicMaterial color="white" />
        </Torus>
      </group>
      {/* RING 3 */}
      <group ref={r3}>
        <Torus args={[1.5, 0.2, 16, 100]}>
           <meshStandardMaterial color="#111" metalness={0.8} roughness={0.1} />
        </Torus>
      </group>
     {/* THE SINGULARITY (VISIBLE) */}
<Sphere args={[1, 64, 64]}>
  {/* Dark, but with a rim light reaction */}
  <meshStandardMaterial 
    color="black" 
    roughness={0.1} 
    metalness={1} 
    emissive={color} 
    emissiveIntensity={0.2} // Subtle glow matching the theme
  />
</Sphere>
    </group>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
      <Text font={font} fontSize={0.6} letterSpacing={0.2} color={color} position={[0, -3, 0]} anchorX="center" anchorY="top">
        {text.toUpperCase()}
        <meshBasicMaterial toneMapped={false} />
      </Text>
    </Float>
  )
}

export default function Paradox({ primaryColor = '#ffcc00', text = 'PARADOX', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ffcc00'
  const finalText = deferredText || 'PARADOX'

  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#050505']} />
      <Mechanism color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="white" />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} intensity={2} />
        <ChromaticAberration offset={[0.002, 0.002]} />
      </EffectComposer>
      <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} />
    </Canvas>
  )
}