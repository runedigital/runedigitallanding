import React, { useRef, useMemo, useDeferredValue } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, Text } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function Cloth({ color }) {
  const mesh = useRef()
  
  // SETTINGS
  const w = 25; const h = 25; 
  const damp = 0.97; 
  
  const { particles, constraints, geometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(12, 12, w, h)
    const pos = geo.attributes.position
    const parts = []
    const cons = []
    
    // 1. PARTICLES
    for(let i=0; i < pos.count; i++) {
      parts.push({
        x: pos.getX(i), y: pos.getY(i), z: pos.getZ(i),
        ox: pos.getX(i), oy: pos.getY(i), oz: pos.getZ(i),
        pinned: i <= w // Pin top row (0 to w)
      })
    }

    // 2. CONSTRAINTS (FIXED ORPHAN LOGIC)
    const rowSize = w + 1
    const restDist = 12 / w
    
    // Iterate through ALL vertices to ensure the edges are tied
    for(let y=0; y <= h; y++) {
      for(let x=0; x <= w; x++) {
        const i = y * rowSize + x
        
        // Connect Right (if not last column)
        if (x < w) cons.push([i, i+1, restDist])
        
        // Connect Down (if not last row)
        if (y < h) cons.push([i, i+rowSize, restDist])
      }
    }
    return { particles: parts, constraints: cons, geometry: geo }
  }, [])

  const { viewport } = useThree()

  useFrame((state) => {
    if (!mesh.current) return

    const mx = (state.mouse.x * viewport.width) / 2
    const my = (state.mouse.y * viewport.height) / 2
    const time = state.clock.getElapsedTime()
    const gravity = -0.008 

    // UI PROTECTION
    const isHoveringUI = state.mouse.x > 0.2 && state.mouse.y < -0.2;
    
    for(let i=0; i < particles.length; i++) {
      const p = particles[i]
      if (p.pinned) continue 

      const vx = (p.x - p.ox) * damp
      const vy = (p.y - p.oy) * damp
      const vz = (p.z - p.oz) * damp

      p.ox = p.x; p.oy = p.y; p.oz = p.z;
      p.x += vx; p.y += vy + gravity; 
      p.z += vz + Math.sin(time * 0.5 + p.x) * 0.002 

      // INTERACTION
      if (!isHoveringUI) {
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx*dx + dy*dy)
        
        if (dist < 2.5) {
          const force = (2.5 - dist) / 2.5
          p.z -= force * 0.05 
        }
      }

      // CLAMP
      if (isNaN(p.z)) p.z = p.oz;
      if (p.z > 5) p.z = 5; if (p.z < -5) p.z = -5;
    }

    // SOLVER
    for(let k=0; k<6; k++) { 
      for(let c=0; c < constraints.length; c++) {
        const [i1, i2, d] = constraints[c]
        const p1 = particles[i1]; const p2 = particles[i2]
        const dx = p1.x - p2.x; const dy = p1.y - p2.y; const dz = p1.z - p2.z
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
        if (dist < 0.001) continue 
        const diff = (dist - d) / dist
        const mx = dx * 0.5 * diff; const my = dy * 0.5 * diff; const mz = dz * 0.5 * diff
        if (!p1.pinned) { p1.x -= mx; p1.y -= my; p1.z -= mz }
        if (!p2.pinned) { p2.x += mx; p2.y += my; p2.z += mz }
      }
    }

    const posAttr = mesh.current.geometry.attributes.position
    for(let i=0; i < particles.length; i++) {
      posAttr.setXYZ(i, particles[i].x, particles[i].y, particles[i].z)
    }
    posAttr.needsUpdate = true
    mesh.current.geometry.computeVertexNormals()
  })

  return (
    <mesh ref={mesh} geometry={geometry} position={[0, 2, 0]}>
      <meshPhysicalMaterial 
        color="#050505" emissive={color} emissiveIntensity={0.1}
        roughness={0.4} metalness={0.6} clearcoat={1} side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function AssetTitle({ text, color, font }) {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <group position={[0, -2, 2]}>
        <Text font={font} fontSize={1.5} letterSpacing={0.05} color="white" anchorX="center" anchorY="middle">
          {text.toUpperCase()}
          <meshStandardMaterial color="white" toneMapped={false} />
        </Text>
        <Text font={font} fontSize={0.2} letterSpacing={0.2} color={color} position={[0, -0.8, 0]} anchorX="center" anchorY="middle">
          INTERACT TO DISTURB
          <meshStandardMaterial color={color} toneMapped={false} />
        </Text>
      </group>
    </Float>
  )
}

export default function Silk({ primaryColor = '#ffcc00', text = 'SILK', font }) {
  const deferredText = useDeferredValue(text)
  const finalColor = primaryColor || '#ffcc00'
  const finalText = deferredText || 'SILK'

  return (
    <Canvas camera={{ position: [0, 0, 14], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#020202']} />
      <Cloth color={finalColor} />
      <AssetTitle text={finalText} color={finalColor} font={font} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} intensity={5} color="white" />
      <pointLight position={[-10, -5, 10]} intensity={2} color={finalColor} />
      <Environment preset="city" />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} intensity={0.6} radius={0.5} />
        <Noise opacity={0.05} />
        <Vignette darkness={0.6} />
      </EffectComposer>
    </Canvas>
  )
}