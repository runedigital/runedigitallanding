import React, { useRef, useMemo, useDeferredValue } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { EffectComposer, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { shaderMaterial, OrbitControls, Float, Sparkles, Stars, Text } from '@react-three/drei'
import * as THREE from 'three'

const EnergyCloudMaterial = shaderMaterial(
  { time: 0, colorStart: new THREE.Color('#050505'), colorEnd: new THREE.Color('#00ffff') },
  `
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    void main() {
      vPosition = position;
      vNormal = normal;
      vec3 pos = position;
      pos += sin(pos.y * 10.0 + time) * 0.1; 
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  `
    uniform float time;
    uniform vec3 colorStart;
    uniform vec3 colorEnd;
    varying vec3 vPosition;
    varying vec3 vNormal;
    float hash(float n) { return fract(sin(n) * 1e4); }
    float noise(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(x);
      float n = p.x + p.y * 157.0 + 113.0 * p.z;
      return mix(mix(mix(hash(n+0.0), hash(n+1.0),f.x),
            mix(hash(n+157.0), hash(n+158.0),f.x),f.y),
          mix(mix(hash(n+113.0), hash(n+114.0),f.x),
            mix(hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
    }
    void main() {
      vec3 normal = normalize(vNormal);
      float n = noise(vPosition * 2.0 + time);
      vec3 color = mix(colorStart, colorEnd, sin(time) * 0.5 + 0.5 + n * 0.3);
      float fresnel = pow(1.0 - dot(normal, normalize(-vPosition)), 3.0);
      gl_FragColor = vec4(color * (1.0 + fresnel * 2.0), 0.3 + n * 0.4);
    }
  `
)
extend({ EnergyCloudMaterial })

function EnergyCloud({ color }) {
  const materialRef = useRef()
  const { cStart, cEnd } = useMemo(() => {
    const c1 = new THREE.Color(color).multiplyScalar(0.1) 
    const c2 = new THREE.Color(color).multiplyScalar(1.5) 
    return { cStart: c1, cEnd: c2 }
  }, [color])
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.time = clock.getElapsedTime()
      materialRef.current.colorStart.lerp(cStart, 0.1)
      materialRef.current.colorEnd.lerp(cEnd, 0.1)
    }
  })
  return (
    <mesh>
      <sphereGeometry args={[1.8, 64, 64]} />
      <energyCloudMaterial ref={materialRef} transparent depthWrite={false} />
    </mesh>
  )
}

function Artifact({ color }) {
  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusKnotGeometry args={[0.4, 0.1, 128, 32]} />
        <meshStandardMaterial wireframe color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </Float>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        font={font}
        fontSize={0.8}
        letterSpacing={0.2}
        color={color}
        position={[0, 0, 2.5]} 
        anchorX="center"
        anchorY="middle"
      >
        {text.toUpperCase()}
        <meshStandardMaterial emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </Text>
    </Float>
  )
}

export default function DarkMatter({ primaryColor = '#00ffff', text = 'DARK MATTER', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#00ffff'
  const finalText = deferredText || 'DARK MATTER'
  return (
    <Canvas 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }} 
      camera={{ position: [0, 0, 12], fov: 45 }}
      dpr={[1, 2]}
    >
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Sparkles count={200} speed={0.2} size={3} color={finalColor} noise={0.2} opacity={0.5} />
      <EnergyCloud color={finalColor} />
      <Artifact color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        <ChromaticAberration offset={[0.002, 0.002]} />
        <Noise opacity={0.1} />
      </EffectComposer>
    </Canvas>
  )
}