import React, { useRef, useDeferredValue } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, MeshTransmissionMaterial, TorusKnot, Text } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'

function TheOrgan({ color }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // HEARTBEAT
    const scale = 1 + (Math.sin(t * 10) > 0.9 ? 0.1 : 0)
    ref.current.scale.setScalar(scale)
    ref.current.rotation.x = t * 0.2
    ref.current.rotation.y = t * 0.3
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={ref}>
        {/* THE SKIN (GLASS) */}
        <TorusKnot args={[1, 0.3, 128, 32]} >
          <MeshTransmissionMaterial 
            backside 
            thickness={2} 
            roughness={0.2} 
            transmission={1} 
            ior={1.5} 
            chromaticAberration={1} 
            color={color} 
          />
        </TorusKnot>

        {/* THE VEINS (WIREFRAME) */}
        <TorusKnot args={[1, 0.3, 128, 32]} >
          <meshBasicMaterial color="white" wireframe transparent opacity={0.1} />
        </TorusKnot>
        
        {/* THE BLOOD (INTERNAL GLOW) */}
        <TorusKnot args={[0.8, 0.2, 128, 32]} >
           <meshBasicMaterial color={color} toneMapped={false} />
        </TorusKnot>
      </group>
    </Float>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={[0, -2.2, 0]}>
         <Text
          font={font}
          fontSize={0.7}
          letterSpacing={0.05}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {text.toUpperCase()}
          <meshBasicMaterial toneMapped={false} />
        </Text>
        <mesh position={[0, -0.3, 0]}>
           <planeGeometry args={[2, 0.01]} />
           <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <Text
          font={font}
          position={[0, -0.5, 0]}
          fontSize={0.15}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          BIO-DIGITAL SAMPLE 009
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </group>
    </Float>
  )
}

export default function Autopsy({ primaryColor = '#ff0055', text = 'AUTOPSY', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ff0055'
  const finalText = deferredText || 'AUTOPSY'

  return (
    <Canvas camera={{ position: [0, 0, 4] }} dpr={[1, 2]}>
      <color attach="background" args={['#050000']} />
      
      <TheOrgan color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} intensity={2} color={finalColor} />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} intensity={1.5} />
        <Noise opacity={0.15} />
      </EffectComposer>
      
      <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} />
    </Canvas>
  )
}