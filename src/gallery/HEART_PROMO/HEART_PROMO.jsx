import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, MeshDistortMaterial, Environment, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// The core object: a massive, pulsating heart/coil (SOUL_COIL aesthetic)
function HeartMesh({ color, text, font }) {
  const meshRef = useRef()
  const rotationSpeed = 0.5;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * state.delta;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        roughness={0}
        metalness={0.8}
        distort={0.4}
        speed={2.0}
        envMapIntensity={1.5}
      />
      
      <Float floatIntensity={1} rotationIntensity={0.5}>
          <Text
            font={font || 'https://cdn.jsdelivr.net/npm/@fontsource/oswald@5.0.0/files/oswald-latin-400-normal.woff'}
            fontSize={0.3}
            letterSpacing={0.2}
            position={[0, 0, 3.5]}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {text || "CODE:RUNE"} 
            <meshBasicMaterial color="white" toneMapped={false} />
          </Text>
      </Float>
    </mesh>
  )
}

export default function HEART_PROMO({ primaryColor = '#ff5500', text, font }) {
  const assetColor = new THREE.Color(primaryColor);

  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={['#050000']} />
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate speed={0.5} />

      <pointLight position={[10, 10, 10]} intensity={2} color={primaryColor} />
      <ambientLight intensity={0.5} />

      <HeartMesh color={assetColor} text={text} font={font} />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} intensity={1.5} radius={0.8} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}