import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Plane } from '@react-three/drei'
import { EffectComposer, Bloom, Scanline } from '@react-three/postprocessing'
import * as THREE from 'three'

function Terrain({ color }) {
  const ref = useRef()
  useFrame((state, delta) => {
    // MOVE TEXTURE OR MESH TO SIMULATE SPEED
    ref.current.position.z = (state.clock.elapsedTime * 2) % 2
  })

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <group ref={ref}>
        <gridHelper args={[50, 50, color, color]} position={[0, 0, 0]} />
        <gridHelper args={[50, 50, color, color]} position={[0, 0, -50]} />
      </group>
      <mesh position={[0, 0, -25]} rotation={[0, 0, 0]}>
         <planeGeometry args={[50, 100]} />
         <meshBasicMaterial color="black" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

function Sun({ color }) {
  return (
    <mesh position={[0, 2, -20]}>
      <circleGeometry args={[4, 64]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <group position={[0, 2, -8]}>
      <Text font={font} fontSize={2} letterSpacing={0.1} color="black" anchorX="center" anchorY="middle" outlineWidth={0.05} outlineColor={color}>
        {text.toUpperCase()}
      </Text>
    </group>
  )
}

export default function Horizon({ primaryColor = '#00ffea', text = 'HORIZON', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#00ffea'
  const finalText = deferredText || 'HORIZON'

  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 60 }} dpr={[1, 2]}>
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 2, 40]} />
      
      <Terrain color={finalColor} />
      <Sun color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} intensity={1.5} radius={0.8} />
        <Scanline density={1.5} opacity={0.5} />
      </EffectComposer>
      {/* LOCKED CAMERA */}
    </Canvas>
  )
}