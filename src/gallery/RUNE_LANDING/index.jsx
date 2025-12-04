import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Stars, Grid, Points, Html, MeshWobbleMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Scanline, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function NavLink({ href, children }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={href} 
       style={{ 
         color: hover ? '#c5a059' : '#555', 
         textDecoration: 'none', fontSize: '10px', letterSpacing: '2px', fontWeight: 'bold',
         transition: 'color 0.3s', fontFamily: 'Courier New, monospace'
       }}
       onMouseEnter={() => setHover(true)}
       onMouseLeave={() => setHover(false)}>
       {children}
    </a>
  );
}

function CtaButton({ href, children }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={href} style={{
        padding: '15px 40px', fontSize: '0.8rem',
        background: hover ? '#c5a059' : 'rgba(0,0,0,0.5)', 
        color: hover ? 'black' : '#c5a059', 
        border: '1px solid #c5a059', 
        textTransform: 'uppercase', letterSpacing: '2px',
        fontWeight: 'bold', cursor: 'pointer', pointerEvents: 'auto', textDecoration: 'none',
        transition: 'all 0.3s', fontFamily: 'Courier New, monospace'
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      {children}
    </a>
  );
}

function Overlay() {
  const isShowroom = false;
  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%',
        pointerEvents: 'none', zIndex: 90
      }} />
      
      <div style={{ position: 'absolute', top: 30, left: 30, borderTop: '1px solid #333', borderLeft: '1px solid #333', width: 20, height: 20, zIndex: 100 }} />
      <div style={{ position: 'absolute', top: 30, right: 30, borderTop: '1px solid #333', borderRight: '1px solid #333', width: 20, height: 20, zIndex: 100 }} />
      <div style={{ position: 'absolute', bottom: 30, left: 30, borderBottom: '1px solid #333', borderLeft: '1px solid #333', width: 20, height: 20, zIndex: 100 }} />
      <div style={{ position: 'absolute', bottom: 30, right: 30, borderBottom: '1px solid #333', borderRight: '1px solid #333', width: 20, height: 20, zIndex: 100 }} />

      <div style={{ 
        position: 'absolute', top: 40, left: 60, 
        fontFamily: 'Courier New, monospace', fontSize: '10px', color: '#555', zIndex: 100 
      }}>
        SYS.ROOT<br/>ID: RUNE
      </div>
      
      <div style={{ 
        position: 'absolute', bottom: 40, right: 60, textAlign: 'right',
        fontFamily: 'Courier New, monospace', fontSize: '10px', color: '#555', zIndex: 100 
      }}>
        LATENCY: 12ms<br/>SECURE
      </div>

      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', color: '#c5a059',
        zIndex: 10
      }}>
        
        <div style={{ position: 'absolute', top: 40, right: 40, pointerEvents: 'auto' }}>
            <NavLink href="./lab/">// ARCHIVES</NavLink>
        </div>

        {!isShowroom && (
            <>
                <h1 style={{ 
                  fontSize: '6rem', margin: 0, letterSpacing: '0.2em', fontFamily: 'serif',
                  textShadow: '0 0 30px rgba(197, 160, 89, 0.2)', mixBlendMode: 'screen' 
                }}>
                  RUNE
                </h1>
                <p style={{ 
                  fontSize: '0.8rem', letterSpacing: '0.5em', marginTop: '10px', fontFamily: 'monospace',
                  borderTop: '1px solid #333', paddingTop: '10px', color: '#888'
                }}>
                  DIGITAL ARCHITECT
                </p>

                <div style={{ marginTop: '60px', display: 'flex', gap: '20px' }}>
                    <CtaButton href="mailto:sales@runedigitalstudio.com">INITIATE PROTOCOL</CtaButton>
                    <CtaButton href="./showroom/">ACCESS SHOWROOM</CtaButton>
                </div>
            </>
        )}
      </div>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020202' }}>
      <Overlay />
      <Canvas camera={{ position: [0, 0, 6] }}>
        <color attach="background" args={['#020202']} />
        
        <Suspense fallback={null}>
            
            
            {/* THE OBJECT */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}><mesh><icosahedronGeometry args={[1.5, 0]} /><MeshWobbleMaterial color='#c5a059' emissive='#c5a059' emissiveIntensity={2} wireframe={true} factor={0.3} speed={1} /></mesh><mesh scale={1.5}><torusGeometry args={[2, 0.1, 16, 100]} /><MeshWobbleMaterial color='#c5a059' emissive='#c5a059' emissiveIntensity={2} wireframe={true} factor={0.3} speed={1} /></mesh></Float>
            
            <EffectComposer disableNormalPass>
                <Bloom intensity={2} /><Scanline density={2} opacity={0.5} />
            </EffectComposer>
        </Suspense>
        
        <OrbitControls autoRotate />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  )
}
