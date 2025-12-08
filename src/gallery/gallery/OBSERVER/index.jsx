import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Cylinder, Torus, Text, Float } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function TheEye({ color }) {
  const group = useRef()
  const pupil = useRef()
  
  useFrame((state) => {
    if (group.current) {
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (state.mouse.x * Math.PI) / 4, 0.1)
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, (-state.mouse.y * Math.PI) / 4, 0.1)
    }
    const t = state.clock.getElapsedTime()
    pupil.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1)
  })

  return (
    <group ref={group}>
       {/* MAIN LENS BODY */}
       <Cylinder args={[2, 1.5, 1, 64]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
       </Cylinder>
       
       {/* COLORED RIM */}
       <Torus args={[2, 0.05, 16, 100]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color={color} metalness={1} roughness={0} emissive={color} emissiveIntensity={1} toneMapped={false} />
       </Torus>

       {/* GLASS LENS */}
       <mesh position={[0, 0, 0.6]}>
          <sphereGeometry args={[1.4, 64, 64]} />
          <meshPhysicalMaterial transmission={1} thickness={2} roughness={0} ior={1.5} color="black" />
       </mesh>

       {/* PUPIL (APERTURE) */}
       <mesh ref={pupil} position={[0, 0, 0.2]}>
          <circleGeometry args={[0.5, 64]} />
          <meshBasicMaterial color={color} toneMapped={false} />
       </mesh>
       
       {/* LASER SCANNER */}
       <pointLight position={[0, 0, 2]} color={color} intensity={4} distance={5} />
    </group>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group position={[0, -2.5, 0]}>
        <Text
          font={font}
          fontSize={0.6}
          letterSpacing={0.2}
          color="white"
          anchorX="center"
          anchorY="top"
        >
          {text.toUpperCase()}
          <meshBasicMaterial toneMapped={false} />
        </Text>
        <Text
          font={font}
          position={[0, -0.4, 0]}
          fontSize={0.15}
          letterSpacing={0.1}
          color={color}
          anchorX="center"
          anchorY="top"
        >
          OPTICAL SURVEILLANCE SYSTEM
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </group>
    </Float>
  )
}

export default function Observer({ primaryColor = '#ff0000', text = 'OBSERVER', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ff0000'
  const finalText = deferredText || 'OBSERVER'

  return (
    <Canvas camera={{ position: [0, 0, 6] }} dpr={[1, 2]}>
      <color attach="background" args={['#020202']} />
      
      <TheEye color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      
      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} intensity={2} />
        <Vignette darkness={0.6} />
      </EffectComposer>
    </Canvas>
  )
}