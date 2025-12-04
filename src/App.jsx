import React, { useState, useEffect } from 'react'
import { Leva } from 'leva'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Text, 
  Float, 
  Sparkles, 
  Environment, 
  MeshDistortMaterial, 
  Stars,
  OrbitControls
} from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

// --- RUNE DIGITAL // ASSET GALLERY ---
import DARK_MATTER from './gallery/DARK_MATTER'
import DEEPTHINK1 from './gallery/DEEPTHINK1'
import GATEWAY from './gallery/GATEWAY'
import INFERNO from './gallery/INFERNO'
import KINETIC from './gallery/KINETIC'
import MERCURY from './gallery/MERCURY'
import NARCISSIST from './gallery/NARCISSIST'
import OBSERVER from './gallery/OBSERVER'
import AUTOPSY from './gallery/AUTOPSY'
import OBELISK from './gallery/OBELISK'
import SWARM from './gallery/SWARM'
import PARADOX from './gallery/PARADOX'
import HORIZON from './gallery/HORIZON'
import ECHO from './gallery/ECHO'
import REACTOR from './gallery/REACTOR'
import GLITCH_GOD from './gallery/GLITCH_GOD'
import SILK from './gallery/SILK'
import VOGUE from './gallery/VOGUE'
import LIQUID_GOLD from './gallery/LIQUID_GOLD'
import SOUL_COIL from './gallery/SOUL_COIL'

// --- HELPER HOOK FOR RESPONSIVENESS ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  return isMobile
}

// --- WARP CONTROLLER (MOVED UP TO FIX REFERENCE ERROR) ---
const WarpController = ({ warping, onFinish }) => {
  const { camera } = useThree()
  
  useFrame((state, delta) => {
    if (warping) {
      // HYPERSPACE JUMP
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, -5, delta * 2) 
      camera.fov = THREE.MathUtils.lerp(camera.fov, 100, delta * 2) 
      camera.updateProjectionMatrix()
      
      // TRIGGER TRANSITION
      if (camera.position.z < 0) {
        onFinish()
      }
    } else {
      // IDLE BREATHING
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 12 + Math.sin(state.clock.elapsedTime * 0.5) * 2, delta)
    }
  })
  return null
}

// --- DATA MATRIX ---
const ASSETS = {
  'DARK_MATTER': { tier: 'VOID CLASS', id: '001', price: '5,000 USD', licensePrice: '$499', defaultColor: '#00ffff', stripeLink: 'https://buy.stripe.com/00wfZj4S8dwO5ZC5Y96Ri09' },
  'CRYSTALIX':   { tier: 'AGI CLASS',  id: '002', price: '7,500 USD', licensePrice: '$499', defaultColor: '#ff0055', stripeLink: 'https://buy.stripe.com/6oUdRb2K064mbjW4U56Ri04' },
  'GATEWAY':     { tier: 'WEB CLASS',  id: '003', price: '4,000 USD', licensePrice: '$499', defaultColor: '#00ffea', stripeLink: 'https://buy.stripe.com/7sY00l84kdwObjW5Y96Ri05' },
  'INFERNO':     { tier: 'VFX CLASS',  id: '004', price: '6,000 USD', licensePrice: '$499', defaultColor: '#ff3300', stripeLink: 'https://buy.stripe.com/5kQ3cxckA1O6ds4euF6Ri07' },
  'KINETIC':     { tier: 'PHYS CLASS', id: '005', price: '4,500 USD', licensePrice: '$499', defaultColor: '#ffcc00', stripeLink: 'https://buy.stripe.com/aFa28t70g3We87K2LX6Ri08' },
  'MERCURY':     { tier: 'MAT CLASS',  id: '006', price: '3,500 USD', licensePrice: '$499', defaultColor: '#ffffff', stripeLink: 'https://buy.stripe.com/aFa14p2K078q1Jm2LX6Ri06' },
  'NARCISSIST':  { tier: 'HORROR CLASS', id: '007', price: '8,000 USD', licensePrice: '$499', defaultColor: '#ff0000', stripeLink: 'https://buy.stripe.com/eVq00lbgwgJ03Ru3Q16Ri0j' },
  'OBSERVER':    { tier: 'OPTIC CLASS',  id: '008', price: '6,500 USD', licensePrice: '$499', defaultColor: '#ff0000', stripeLink: 'https://buy.stripe.com/fZudRbbgw50igEg9al6Ri0a' },
  'AUTOPSY':     { tier: 'BIO CLASS',    id: '009', price: '7,000 USD', licensePrice: '$499', defaultColor: '#ff0055', stripeLink: 'https://buy.stripe.com/00wbJ3bgw50ico02LX6Ri0b' },
  'OBELISK':     { tier: 'ARCHITECT CLASS', id: '010', price: '7,000 USD', licensePrice: '$499', defaultColor: '#ffffff', stripeLink: 'https://buy.stripe.com/cNi3cxfwM50ifAc1HT6Ri0c' },
  'SWARM':       { tier: 'BIO-TECH CLASS',  id: '011', price: '6,500 USD', licensePrice: '$499', defaultColor: '#ff0055', stripeLink: 'https://buy.stripe.com/9B6eVfdoEakCafSaep6Ri0d' },
  'PARADOX':     { tier: 'CHRONO CLASS',    id: '012', price: '8,000 USD', licensePrice: '$499', defaultColor: '#ffcc00', stripeLink: 'https://buy.stripe.com/bJefZj98o1O65ZC2LX6Ri0e' },
  'HORIZON':     { tier: 'VOID CLASS',      id: '013', price: '5,500 USD', licensePrice: '$499', defaultColor: '#00ffea', stripeLink: 'https://buy.stripe.com/4gM3cx98o8cuafSdqB6Ri0f' },
  'ECHO':        { tier: 'SONIC CLASS',   id: '014', price: '6,000 USD', licensePrice: '$499', defaultColor: '#00ffea', stripeLink: 'https://buy.stripe.com/14A5kF4S8boGbjWdqB6Ri0g' },
  'REACTOR':     { tier: 'NUCLEAR CLASS', id: '015', price: '7,500 USD', licensePrice: '$499', defaultColor: '#ffaa00', stripeLink: 'https://buy.stripe.com/7sY9AVgAQ64mew872d6Ri0h' },
  'GLITCH_GOD':  { tier: 'ERROR CLASS',   id: '016', price: '9,000 USD', licensePrice: '$499', defaultColor: '#00ff00', stripeLink: 'https://buy.stripe.com/bJe6oJ84kboGafS4U56Ri0i' },
  'SILK':        { tier: 'VELVET CLASS',    id: '017', price: '7,000 USD', licensePrice: '$499', defaultColor: '#ff0055', stripeLink: 'https://buy.stripe.com/5kQ8wR3O42Sa2Nq3Q16Ri0n' },
  'VOGUE':       { tier: 'EDITORIAL CLASS', id: '018', price: '6,000 USD', licensePrice: '$499', defaultColor: '#ffffff', stripeLink: 'https://buy.stripe.com/eVq5kFdoE50i9bO1HT6Ri0o' },
  'LIQUID_GOLD': { tier: 'BULLION CLASS',   id: '019', price: '8,000 USD', licensePrice: '$499', defaultColor: '#ffcc00', stripeLink: 'https://buy.stripe.com/aFadRb5WceAS0Fi2LX6Ri0p' },
  'SOUL_COIL': { tier: 'MYTHIC CLASS', id: '020', price: '9,500 USD', licensePrice: '$499', defaultColor: '#ff5500', stripeLink: 'https://buy.stripe.com/5kQ14p1FW64mco04U56Ri0q' }
}

const FONTS = {
  'INDUSTRIAL': 'https://cdn.jsdelivr.net/npm/@fontsource/oswald@5.0.0/files/oswald-latin-400-normal.woff',
  'CYBER': 'https://cdn.jsdelivr.net/npm/@fontsource/orbitron@5.0.0/files/orbitron-latin-900-normal.woff',
  'LUXURY': 'https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@5.0.0/files/playfair-display-latin-400-normal.woff',
  'MINIMAL': 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-400-normal.woff' 
}

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <>
    <style>@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Oswald:wght@300;400;600&display=swap');</style>
    <style>{`
      div[id^="leva__root"] { display: none !important; }
      * { border-radius: 0px !important; box-sizing: border-box; }
      body { margin: 0; overflow: hidden; background: #000; font-family: 'Oswald', sans-serif; }
      .rune-btn { transition: all 0.3s ease; position: relative; overflow: hidden; }
      .rune-btn:hover { letter-spacing: 4px !important; }
      .rune-btn:active { transform: scale(0.98); }
      
      .rune-input { 
        background: rgba(0,0,0,0.8); border: 1px solid #333; color: #fff; 
        padding: 15px; font-family: 'Oswald'; font-size: 16px; width: 100%; 
        margin-bottom: 10px; outline: none; transition: border 0.3s; 
      }
      .rune-input:focus { border-color: #00ffea; }
      
      .rune-select {
        appearance: none; -webkit-appearance: none;
        background: rgba(0,0,0,0.8); border: 1px solid #333; color: #fff;
        padding: 20px; font-family: 'Oswald'; font-size: 14px; letter-spacing: 2px;
        width: 100%; cursor: pointer; text-transform: uppercase;
        transition: all 0.3s ease;
      }
      .rune-select:hover { border-color: #fff; }
      .rune-select:focus { border-color: #00ffea; outline: none; }
      
      .scope-item { display: flex; justify-content: space-between; padding: 15px; border: 1px solid #222; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; }
      .scope-item:hover { background: #111; }
      .scope-item.active { border-color: #ff0055; background: rgba(255,0,85,0.1); }
      
      @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      
      /* SCROLLBAR HIDE */
      ::-webkit-scrollbar { width: 0px; background: transparent; }
    `}</style>
  </>
)

const RuneLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M30 20 L10 50 L30 80 H50 L70 50 L50 20 H30 Z" fill="none" stroke="white" strokeWidth="4" />
    <path d="M35 20 L15 50 L35 80" stroke="#00ffea" strokeWidth="4" style={{ mixBlendMode: 'screen' }} />
    <circle cx="40" cy="50" r="4" fill="#ff0055" />
  </svg>
)

const BrandWatermark = ({ isMobile }) => (
  <div style={{ position: 'fixed', top: isMobile ? '20px' : '40px', left: isMobile ? '20px' : '40px', zIndex: 50, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '15px' }}>
    <RuneLogo size={isMobile ? 30 : 50} />
    <div>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: isMobile ? '16px' : '20px', color: '#fff', letterSpacing: '4px', lineHeight: '1' }}>RUNE</div>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 300, fontSize: isMobile ? '8px' : '10px', color: '#666', letterSpacing: '3px' }}>DIGITAL // STUDIO</div>
    </div>
  </div>
)

const InfoCard = ({ mode, isMobile }) => {
  const data = ASSETS[mode] || { tier: 'UNKNOWN', id: '---', price: '---' }
  // Hide detail card on mobile to save space
  if (isMobile) return null
  return (
    <div style={{ position: 'fixed', bottom: '50px', left: '50px', width: '300px', color: '#fff', fontFamily: "'Oswald', sans-serif", zIndex: 50, pointerEvents: 'none' }}>
      <div style={{ height: '1px', width: '100%', background: 'rgba(255,255,255,0.3)', marginBottom: '15px' }} />
      <h2 style={{ margin: 0, fontSize: '14px', letterSpacing: '3px', color: '#888', fontWeight: 400 }}>ASSET_ID // {data.id}</h2>
      <h1 style={{ margin: '5px 0 0 0', fontSize: '32px', letterSpacing: '1px', fontWeight: 500, textTransform: 'uppercase' }}>{mode}</h1>
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', letterSpacing: '2px', color: '#aaa' }}><span>{data.tier}</span><span style={{ color: '#00ffea', fontWeight: 600 }}>MARKET VAL: {data.price}</span></div>
    </div>
  )
}

// --- THE CHIRAL GATE (LANDING PAGE) ---
const ChiralGate = ({ onEnter }) => {
  const [warping, setWarping] = useState(false)

  // CINZEL FONT URL
  const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/cinzel@5.0.0/files/cinzel-latin-400-normal.woff'
  const isMobile = useIsMobile()

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000 }}>
      <Canvas camera={{ position: [0, 1, isMobile ? 16 : 12], fov: 50 }}>
        <color attach="background" args={['#020202']} />
        <fog attach="fog" args={['#020202', 5, 30]} /> 

        {/* THE OBSIDIAN OCEAN (Smooth, Glossy, Black) */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
            <planeGeometry args={[60, 60, 128, 128]} />
            <MeshDistortMaterial 
              color="#000000" 
              roughness={0} 
              metalness={1} 
              distort={0.3} // Gentle ripples, not jagged spikes
              speed={1.5} 
            />
          </mesh>
        </Float>

        {/* RISING EMBERS (Dark Souls Style) */}
        <Sparkles 
          count={300} 
          scale={[20, 15, 10]} 
          size={3} 
          speed={0.4} 
          opacity={0.8} 
          color="#ffaa00" // PURE GOLD
          noise={0.5}
        />

        {/* THE MONOLITH TEXT */}
        <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.2}>
          <group onClick={() => setWarping(true)} position={[0, 1, 0]}>
            {/* MAIN TITLE */}
            <Text
              font={fontUrl} // CINZEL
              fontSize={isMobile ? 1.2 : 1.8}
              letterSpacing={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              RUNE DIGITAL
              {/* Subtle Gold Glow */}
              <meshStandardMaterial 
                 color="white" 
                 emissive="#ffaa00" 
                 emissiveIntensity={warping ? 4 : 0.2} 
                 toneMapped={false} 
              />
            </Text>
            
            {/* SUBTITLE */}
            <Text
              font={fontUrl}
              position={[0, -1.2, 0]}
              fontSize={0.15}
              letterSpacing={0.3}
              color="#666"
              anchorX="center"
            >
              PRESS TO INITIALIZE LINK
              <meshBasicMaterial color={warping ? "#ffaa00" : "#666"} />
            </Text>
            
            {/* CLICK TARGET */}
            <mesh visible={false}>
               <planeGeometry args={[10, 5]} />
            </mesh>
          </group>
        </Float>

        <WarpController warping={warping} onFinish={onEnter} />
        
        {/* DRAMATIC LIGHTING */}
  {/* CLEAN REFLECTIONS */}
<Environment preset="studio" />
              <EffectComposer disableNormalPass>
           <Bloom luminanceThreshold={0.2} intensity={1.2} radius={0.8} mipmapBlur />
           <Noise opacity={0.08} /> {/* Film Grain */}
           <Vignette darkness={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

// --- ACQUISITION MATRIX (RESPONSIVE) ---
const AcquisitionMatrix = ({ mode, onClose, onConfigTier2, onConfigTier3, isModified, onResetRequest, isMobile }) => {
  const data = ASSETS[mode]
  const Card = ({ title, price, features, color, link, action, recommended, disabled, warning }) => (
    <div style={{ 
        border: `1px solid ${disabled ? '#333' : color}`, 
        background: recommended ? 'rgba(20,20,20,0.95)' : 'rgba(0,0,0,0.95)', 
        padding: '30px', 
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
        height: isMobile ? 'auto' : '480px', 
        width: isMobile ? '100%' : '320px', 
        marginBottom: isMobile ? '20px' : '0',
        transition: 'all 0.3s ease', 
        boxShadow: recommended ? `0 0 30px ${color}40` : `0 0 20px rgba(0,0,0,0.5)`, 
        transform: (!isMobile && recommended) ? 'scale(1.05)' : 'scale(1)', 
        opacity: disabled ? 0.5 : 1, filter: disabled ? 'grayscale(100%)' : 'none' 
    }}>
      <div>
        <h3 style={{ color: disabled ? '#555' : color, fontSize: '16px', letterSpacing: '3px', marginBottom: '10px', fontWeight: 400 }}>{title}</h3>
        <h1 style={{ color: disabled ? '#555' : '#fff', fontSize: '48px', margin: '0 0 20px 0', fontFamily: "'Oswald', sans-serif", fontWeight: 600 }}>{price}</h1>
        <div style={{ height: '1px', width: '100%', background: '#222', marginBottom: '25px' }} />
        {features.map((f, i) => (<div key={i} style={{ color: '#888', fontSize: '14px', marginBottom: '12px', letterSpacing: '1px', display: 'flex', alignItems: 'center' }}><span style={{ color: disabled ? '#444' : color, marginRight: '10px' }}>►</span> {f}</div>))}
      </div>
      <div style={{ marginTop: '20px' }}>
        {warning && <div style={{ color: '#ff0055', fontSize: '10px', letterSpacing: '1px', marginBottom: '10px', textAlign: 'center' }}>{warning}</div>}
        <button onClick={disabled ? null : action} className="rune-btn" style={{ background: recommended ? color : 'transparent', border: `1px solid ${disabled ? '#444' : color}`, color: recommended ? '#000' : (disabled ? '#444' : color), width: '100%', padding: '20px', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '14px', letterSpacing: '2px', fontFamily: "'Oswald', sans-serif", fontWeight: 600, textTransform: 'uppercase' }}>{disabled ? 'LOCKED' : link}</button>
        {disabled && (<button onClick={onResetRequest} className="rune-btn" style={{ width: '100%', marginTop: '15px', background: '#ff0055', color: '#fff', border: 'none', padding: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', letterSpacing: '2px' }}>⚠ RESET TO UNLOCK</button>)}
      </div>
    </div>
  )
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 200, backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', padding: isMobile ? '20px' : '0' }}>
        <div onClick={onClose} style={{ position: 'fixed', top: '30px', right: '30px', cursor: 'pointer', color: '#fff', fontSize: '24px', opacity: 0.5, zIndex: 201 }}>✕ CLOSE</div>
        <div style={{ marginBottom: '40px', marginTop: isMobile ? '60px' : '40px', textAlign: 'center', flexShrink: 0 }}>
            <RuneLogo size={60} />
            <h1 style={{ color: '#fff', fontFamily: "'Oswald', sans-serif", letterSpacing: '8px', marginTop: '20px', fontSize: '24px', fontWeight: 300 }}>ACQUISITION PROTOCOL</h1>
        </div>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1200px', paddingBottom: '50px' }}>
            <Card title="PROTOCOL 1 // SOURCE" price={data.licensePrice} color="#00ffea" link="INITIATE DOWNLOAD" action={() => window.open(data.stripeLink, '_blank')} features={['REACT COMPONENT', 'GLSL SOURCE CODE', 'COMMERCIAL LICENSE', 'SELF-HOSTED']} disabled={isModified} warning={isModified ? "CANNOT BUY SOURCE FOR CUSTOM ASSET" : null} />
            <Card title="PROTOCOL 2 // DEPLOY" price="$1,499" color="#fff" link={isModified ? "DEPLOY CONFIGURATION" : "START CONFIGURATION"} recommended={true} action={onConfigTier2} features={['HOSTED SOLUTION (VERCEL)', 'YOUR CUSTOM CONFIG', 'CUSTOM DOMAIN SETUP', '1 REVISION ROUND']} />
            <Card title="PROTOCOL 3 // AGENCY" price="$3,800+" color="#ff0055" link="BUILD SCOPE" action={onConfigTier3} features={['FULL SITE ARCHITECTURE', 'CMS & COMMERCE ADD-ONS', 'SEO & ANALYTICS SUITE', 'DEDICATED SUPPORT']} />
        </div>
    </div>
  )
}

const ConfigTier2 = ({ mode, onClose, activeColor, setColor, activeText, setText, discountApplied, isMobile }) => {
  const [formData, setFormData] = useState({ companyName: '', domain: '', email: '' })
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const price = discountApplied ? 1199 : 1499
  const handleNameChange = (e) => { const val = e.target.value; setFormData({...formData, companyName: val}); setText(val) }
  const generatePacket = () => JSON.stringify({ ...formData, color: activeColor, text: activeText, tier: `PROTOCOL 2 ($${price})`, asset: mode }, null, 2)
  const handleSubmit = () => { if(!agreed) return alert("PLEASE ACKNOWLEDGE THE SCOPE."); const subject = `RUNE DEPLOYMENT: ${mode}`; window.location.href = `mailto:quotes@runedigitalstudio.com?subject=${subject}&body=${encodeURIComponent(generatePacket())}`; setSubmitted(true) }

  if (submitted) return (
      <div style={{ position: 'fixed', top: 0, right: 0, width: isMobile ? '100%' : '500px', height: '100%', background: 'rgba(5,5,5,0.98)', borderLeft: '1px solid #333', zIndex: 300, padding: '40px', display: 'flex', flexDirection: 'column' }}>
        <div onClick={onClose} style={{ position: 'absolute', top: '30px', left: '30px', cursor: 'pointer', color: '#fff', fontSize: '24px', opacity: 0.5 }}>✕</div>
        <h1 style={{ color: '#00ffea', fontSize: '28px', marginTop: '40px', marginBottom: '20px', fontWeight: 500 }}>TRANSMISSION LOG</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>EMAIL CLIENT FAILED? COPY DATA BELOW:</p>
        <textarea readOnly value={generatePacket()} style={{ width: '100%', height: '200px', background: '#111', border: '1px solid #333', color: '#0f0', fontFamily: 'monospace', fontSize: '12px', padding: '15px' }} />
        <button onClick={() => { navigator.clipboard.writeText(generatePacket()); alert("COPIED") }} className="rune-btn" style={{ marginTop: '20px', background: '#333', color: '#fff', width: '100%', padding: '15px', border: 'none', fontWeight: 'bold' }}>COPY DATA</button>
        <button onClick={onClose} style={{ marginTop: '20px', background: 'transparent', border: '1px solid #333', color: '#666', width: '100%', padding: '15px', cursor: 'pointer' }}>CLOSE</button>
      </div>
  )

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: isMobile ? '100%' : '500px', height: '100%', background: 'rgba(10,10,10,0.95)', borderLeft: '1px solid #333', zIndex: 300, backdropFilter: 'blur(30px)', padding: isMobile ? '30px' : '60px', display: 'flex', flexDirection: 'column' }}>
      <div onClick={onClose} style={{ position: 'absolute', top: isMobile ? '30px' : '40px', left: isMobile ? '30px' : '-60px', cursor: 'pointer', color: '#fff', fontSize: '24px', opacity: 0.5 }}>✕</div>
      <h3 style={{ color: '#888', fontSize: '14px', letterSpacing: '3px', marginBottom: '10px', marginTop: isMobile ? '40px' : '0' }}>PROTOCOL 2 // CONFIGURATION</h3>
      <h1 style={{ color: '#fff', fontSize: '36px', margin: '0 0 40px 0', fontWeight: 500 }}>DEPLOYMENT MANIFEST</h1>
      <label style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>COMPANY NAME</label>
      <input className="rune-input" value={formData.companyName || activeText} onChange={handleNameChange} />
      <label style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>TARGET DOMAIN</label>
      <input className="rune-input" value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})} />
      <label style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>OPERATOR EMAIL</label>
      <input className="rune-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <label style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>BRAND COLOR</label>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}><input type="color" value={activeColor} onChange={(e) => setColor(e.target.value)} style={{ height: '50px', width: '50px', border: 'none', background: 'none' }} /><input className="rune-input" style={{ marginBottom: 0 }} value={activeColor} onChange={(e) => setColor(e.target.value)} /></div>
      <div style={{ flexGrow: 1 }} />
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: '5px' }} /><div style={{ color: '#666', fontSize: '12px' }}>I ACKNOWLEDGE THIS IS A "AS-IS" DEPLOYMENT.</div></div>
      <div style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', marginBottom: '20px' }}><span>FEE</span><span style={{ color: discountApplied ? '#00ffea' : '#fff' }}>{discountApplied ? '$1,199' : '$1,499.00'}</span></div>
        <button onClick={handleSubmit} className="rune-btn" style={{ background: agreed ? '#fff' : '#333', color: agreed ? '#000' : '#888', width: '100%', padding: '20px', fontWeight: 600, border: 'none' }}>SUBMIT</button>
      </div>
    </div>
  )
}

const ConfigTier3 = ({ mode, onClose, isMobile }) => {
  const basePrice = 3800; const [addons, setAddons] = useState({ expansion: false, cms: false, commerce: false }); 
  let total = basePrice; if (addons.expansion) total += 1800; if (addons.cms) total += 2400; if (addons.commerce) total += 3000;
  const isFullSuite = addons.expansion && addons.cms && addons.commerce; const finalPrice = isFullSuite ? 9899 : total;
  const toggleAll = () => isFullSuite ? setAddons({ expansion: false, cms: false, commerce: false }) : setAddons({ expansion: true, cms: true, commerce: true })
  const handleSubmit = () => { window.location.href = `mailto:quotes@runedigitalstudio.com?subject=AGENCY ${mode}&body=${JSON.stringify({ tier: 'PROTOCOL 3', addons }, null, 2)}` }
  
  return <div style={{ position: 'fixed', top: 0, right: 0, width: isMobile ? '100%' : '500px', height: '100%', background: 'rgba(10,10,10,0.95)', borderLeft: '1px solid #333', zIndex: 300, backdropFilter: 'blur(30px)', padding: isMobile ? '30px' : '60px', display: 'flex', flexDirection: 'column' }}>
      <div onClick={onClose} style={{ position: 'absolute', top: isMobile ? '30px' : '40px', left: isMobile ? '30px' : '-60px', cursor: 'pointer', color: '#fff', fontSize: '24px', opacity: 0.5 }}>✕</div>
      <h3 style={{ color: '#ff0055', fontSize: '14px', letterSpacing: '3px', marginBottom: '10px', marginTop: isMobile ? '40px' : '0' }}>PROTOCOL 3 // AGENCY</h3>
      <h1 style={{ color: '#fff', fontSize: '36px', margin: '0 0 40px 0', fontWeight: 500 }}>SCOPE BUILDER</h1>
      <div className="scope-item active"><div><div style={{color:'#fff'}}>AGENCY CORE</div><div style={{color:'#666',fontSize:'10px'}}>ASSET + DEPLOY</div></div><div style={{color:'#fff'}}>${basePrice}</div></div>
      <div className={`scope-item ${addons.expansion ? 'active' : ''}`} onClick={() => setAddons({...addons, expansion: !addons.expansion})}><div><div style={{color:'#fff'}}>EXPANSION</div><div style={{color:'#666',fontSize:'10px'}}>ABOUT + CONTACT</div></div><div style={{color:'#fff'}}>+$1,800</div></div>
      <div className={`scope-item ${addons.cms ? 'active' : ''}`} onClick={() => setAddons({...addons, cms: !addons.cms})}><div><div style={{color:'#fff'}}>CMS</div><div style={{color:'#666',fontSize:'10px'}}>BLOG / NEWS</div></div><div style={{color:'#fff'}}>+$2,400</div></div>
      <div className={`scope-item ${addons.commerce ? 'active' : ''}`} onClick={() => setAddons({...addons, commerce: !addons.commerce})}><div><div style={{color:'#fff'}}>COMMERCE</div><div style={{color:'#666',fontSize:'10px'}}>STRIPE STORE</div></div><div style={{color:'#fff'}}>+$3,000</div></div>
      <div onClick={toggleAll} style={{ textAlign: 'center', padding: '10px', border: '1px dashed #555', color: '#888', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', marginTop: '20px' }}>[ {isFullSuite ? 'RESET' : 'SELECT FULL SUITE'} ]</div>
      <div style={{ flexGrow: 1 }} />
      <div style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', marginBottom: '5px' }}><span>TOTAL</span><span style={{ textDecoration: isFullSuite ? 'line-through' : 'none' }}>${total.toLocaleString()}</span></div>
        {isFullSuite && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00ffea', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}><span>BUNDLE PRICE</span><span>${finalPrice.toLocaleString()}</span></div>}
        <button onClick={handleSubmit} className="rune-btn" style={{ background: '#ff0055', color: '#fff', width: '100%', padding: '20px', fontWeight: 600, border: 'none' }}>REQUEST PROPOSAL</button>
      </div>
  </div>
}

const SuccessScreen = ({ onClose, isMobile }) => {
  return <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 500, background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <RuneLogo size={isMobile ? 60 : 100} />
      <h1 style={{ color: '#00ffea', fontFamily: "'Oswald', sans-serif", fontSize: isMobile ? '32px' : '48px', letterSpacing: '5px', marginTop: '40px', textAlign: 'center' }}>ASSET SECURED</h1>
      <div style={{ color: '#fff', fontSize: '16px', letterSpacing: '2px', marginTop: '10px', textAlign: 'center', maxWidth: '400px' }}>SOURCE CODE DISPATCHED.</div>
      <button onClick={onClose} style={{ marginTop: '60px', background: 'transparent', border: '1px solid #333', color: '#666', padding: '15px 40px', cursor: 'pointer' }}>RETURN</button>
  </div>
}

// --- THE CONTROL DECK (RESPONSIVE) ---
const ControlDeck = ({ activeColor, setColor, activeText, setText, activeFont, setFont, defaultColor, defaultText, isModified, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false)

  // ON MOBILE: Render as a collapsible drawer/modal
  if (isMobile) {
    if (!isOpen) {
      return (
        <div 
          onClick={() => setIsOpen(true)}
          style={{ 
            position: 'fixed', bottom: '20px', left: '20px', right: '20px', 
            background: 'rgba(20,20,20,0.9)', border: '1px solid #333', 
            padding: '15px', zIndex: 100, color: '#fff', textAlign: 'center',
            fontFamily: "'Oswald'", letterSpacing: '2px', fontSize: '12px', cursor: 'pointer'
          }}
        >
          /// OPEN CONTROLS ///
        </div>
      )
    }
    return (
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: '#050505', borderTop: '1px solid #333', padding: '30px', zIndex: 101 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ color: '#fff', fontSize: '14px' }}>CONTROLS</span>
          <span onClick={() => setIsOpen(false)} style={{ color: '#666', cursor: 'pointer' }}>▼ CLOSE</span>
        </div>
        <label style={{ color: '#666', fontSize: '10px', display: 'block', marginBottom: '5px' }}>TEXT</label>
        <input className="rune-input" value={activeText} onChange={(e) => setText(e.target.value)} maxLength={12} />
        <label style={{ color: '#666', fontSize: '10px', display: 'block', marginBottom: '5px' }}>COLOR</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
           <input type="color" value={activeColor} onChange={(e) => setColor(e.target.value)} style={{ height: '45px', width: '45px', border: 'none', background: 'none' }} />
           <input className="rune-input" value={activeColor.toUpperCase()} onChange={(e) => setColor(e.target.value)} style={{ marginBottom: 0, flexGrow: 1 }} />
        </div>
        <label style={{ color: '#666', fontSize: '10px', display: 'block', marginBottom: '5px' }}>FONT</label>
        <select className="rune-select" value={activeFont} onChange={(e) => setFont(e.target.value)} style={{ padding: '15px', marginBottom: '20px' }}>
           <option value="INDUSTRIAL">INDUSTRIAL</option><option value="CYBER">CYBER</option><option value="LUXURY">LUXURY</option><option value="MINIMAL">MINIMAL</option>
        </select>
      </div>
    )
  }

  // ON DESKTOP: Fixed box
  return (
    <div style={{ position: 'fixed', bottom: '50px', right: '50px', width: '350px', background: 'rgba(5,5,5,0.85)', border: '1px solid #333', backdropFilter: 'blur(10px)', padding: '25px', zIndex: 100 }}>
      <h3 style={{ color: '#fff', fontSize: '12px', letterSpacing: '2px', margin: '0 0 20px 0', display: 'flex', justifyContent: 'space-between' }}><span>OPERATOR CONTROLS</span>{isModified && <span style={{ color: '#ff0055', animation: 'pulse 1s infinite' }}>● MODIFIED</span>}</h3>
      <label style={{ color: '#666', fontSize: '10px', letterSpacing: '1px', display: 'block', marginBottom: '5px' }}>DISPLAY TEXT</label>
      <input className="rune-input" value={activeText} onChange={(e) => setText(e.target.value)} maxLength={12} style={{ textAlign: 'right', fontSize: '20px', letterSpacing: '2px' }} />
      <label style={{ color: '#666', fontSize: '10px', letterSpacing: '1px', display: 'block', marginBottom: '5px' }}>TYPOGRAPHY STYLE</label>
      <select className="rune-select" value={activeFont} onChange={(e) => setFont(e.target.value)} style={{ padding: '10px', fontSize: '12px', marginBottom: '15px' }}>
        <option value="INDUSTRIAL">INDUSTRIAL</option><option value="CYBER">CYBER</option><option value="LUXURY">LUXURY</option><option value="MINIMAL">MINIMAL</option>
      </select>
      <label style={{ color: '#666', fontSize: '10px', letterSpacing: '1px', display: 'block', marginBottom: '5px' }}>PRIMARY ENERGY</label>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}><input type="color" value={activeColor} onChange={(e) => setColor(e.target.value)} style={{ height: '45px', width: '45px', border: '1px solid #333', background: 'none', cursor: 'pointer', padding: 0 }} /><input className="rune-input" value={activeColor.toUpperCase()} onChange={(e) => setColor(e.target.value)} style={{ marginBottom: 0, flexGrow: 1 }} /></div>
      {isModified && (<div onClick={() => { setColor(defaultColor); setText(defaultText); setFont('INDUSTRIAL'); }} style={{ textAlign: 'center', fontSize: '10px', color: '#888', letterSpacing: '1px', cursor: 'pointer', borderBottom: '1px dashed #555', paddingBottom: '2px', display: 'inline-block', width: '100%' }}>// REVERT TO FACTORY DEFAULTS</div>)}
    </div>
  )
}

// --- INTERVENTION MODAL ---
const InterventionModal = ({ onClose, onReset, onClaimOffer, isMobile }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 600, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
    <div style={{ width: '100%', maxWidth: '400px', border: '1px solid #ff0055', background: '#000', padding: '40px', textAlign: 'center', position: 'relative' }}>
      <div style={{ color: '#ff0055', fontSize: '60px', marginBottom: '20px' }}>⚠</div>
      <h1 style={{ color: '#fff', fontSize: '24px', letterSpacing: '2px', marginBottom: '10px' }}>WAIT.</h1>
      <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px' }}>YOU ARE ABOUT TO DESTROY YOUR CUSTOM CONFIGURATION.</p>
      <button onClick={onClaimOffer} className="rune-btn" style={{ width: '100%', background: '#fff', color: '#000', border: 'none', padding: '20px', fontWeight: 'bold', marginBottom: '15px', cursor: 'pointer', letterSpacing: '2px' }}>CLAIM 20% OFF ($1,199)</button>
      <button onClick={onReset} style={{ background: 'transparent', border: 'none', color: '#555', fontSize: '10px', letterSpacing: '1px', cursor: 'pointer', textDecoration: 'underline' }}>NO, DELETE MY WORK & RESET TO DEFAULT</button>
    </div>
  </div>
)

// --- MAIN APP ---
export default function Showroom() {
  const [introFinished, setIntroFinished] = useState(false)
  const [mode, setMode] = useState('DARK_MATTER') 
  const [viewMode, setViewMode] = useState('IDLE')
  const [activeColor, setActiveColor] = useState('#ffffff')
  const [activeText, setActiveText] = useState('RUNE')
  const [activeFont, setActiveFont] = useState('INDUSTRIAL')
  const [showIntervention, setShowIntervention] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(false)
  
  // MOBILE DETECT
  const isMobile = useIsMobile()

  useEffect(() => {
    const keys = Object.keys(ASSETS)
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    setMode(randomKey)
    setActiveColor(ASSETS[randomKey].defaultColor)
    setActiveText(randomKey)
  }, [])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setActiveColor(ASSETS[newMode].defaultColor)
    setActiveText(newMode)
    setActiveFont('INDUSTRIAL')
    setDiscountApplied(false)
  }

  const handleReset = () => {
    setActiveColor(ASSETS[mode]?.defaultColor || '#ffffff')
    setActiveText(mode)
    setActiveFont('INDUSTRIAL')
    setShowIntervention(false)
  }

  const handleClaimOffer = () => { setDiscountApplied(true); setShowIntervention(false); setViewMode('CONFIG_T2') }
  const handleCloseSuccess = () => { setViewMode('IDLE'); window.history.replaceState({}, document.title, window.location.pathname) }
  const fontUrl = FONTS[activeFont]
  const defaultColor = ASSETS[mode]?.defaultColor || '#ffffff'
  const defaultText = mode
  const isModified = (activeColor !== defaultColor) || (activeText !== defaultText) || (activeFont !== 'INDUSTRIAL')

  return (
    <>
      <GlobalStyles />
      {!introFinished && <div style={{ opacity: introFinished ? 0 : 1, transition: 'opacity 1s ease' }}><ChiralGate onEnter={() => setIntroFinished(true)} /></div>}

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: introFinished ? 1 : 0, transition: 'opacity 2s ease' }}>
        {mode === 'DARK_MATTER' && <DARK_MATTER primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'CRYSTALIX' && <DEEPTHINK1 primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'GATEWAY' && <GATEWAY primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'INFERNO' && <INFERNO primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'KINETIC' && <KINETIC primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'MERCURY' && <MERCURY primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'NARCISSIST' && <NARCISSIST primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'OBSERVER' && <OBSERVER primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'AUTOPSY' && <AUTOPSY primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'OBELISK' && <OBELISK primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'SWARM' && <SWARM primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'PARADOX' && <PARADOX primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'HORIZON' && <HORIZON primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'ECHO' && <ECHO primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'REACTOR' && <REACTOR primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'GLITCH_GOD' && <GLITCH_GOD primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'SILK' && <SILK primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'VOGUE' && <VOGUE primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'LIQUID_GOLD' && <LIQUID_GOLD primaryColor={activeColor} text={activeText} font={fontUrl} />}
        {mode === 'SOUL_COIL' && <SOUL_COIL primaryColor={activeColor} text={activeText} font={fontUrl} />}
      </div>

      <div style={{ opacity: (viewMode === 'IDLE' && introFinished) ? 1 : 0, transition: 'opacity 0.5s ease', pointerEvents: (viewMode === 'IDLE' && introFinished) ? 'auto' : 'none' }}>
        <BrandWatermark isMobile={isMobile} />
        <InfoCard mode={mode} isMobile={isMobile} />
        
        {/* TOP RIGHT CLUSTER - RESPONSIVE */}
        <div style={{ 
            position: 'fixed', 
            top: isMobile ? '80px' : '40px', 
            right: isMobile ? '20px' : '40px', 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-end' : 'center',
            gap: '20px', zIndex: 100 
        }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <select className="rune-select" value={mode} onChange={(e) => handleModeChange(e.target.value)}>
              {Object.keys(ASSETS).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#00ffea', fontSize: '10px' }}>▼</div>
          </div>
          <button onClick={() => setViewMode('ACQUIRE')} className="rune-btn" style={{ background: '#fff', color: '#000', border: '1px solid #fff', padding: '0 40px', fontSize: '14px', letterSpacing: '3px', fontFamily: "'Oswald', sans-serif", fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>ACQUIRE ASSET</button>
        </div>
        
        <ControlDeck 
          activeColor={activeColor} setColor={setActiveColor} 
          activeText={activeText} setText={setActiveText} 
          activeFont={activeFont} setFont={setActiveFont}
          defaultColor={defaultColor} defaultText={defaultText} 
          isModified={isModified} isMobile={isMobile}
        />
      </div>

      {viewMode === 'ACQUIRE' && <AcquisitionMatrix mode={mode} onClose={() => setViewMode('IDLE')} onConfigTier2={() => setViewMode('CONFIG_T2')} onConfigTier3={() => setViewMode('CONFIG_T3')} isModified={isModified} onResetRequest={() => setShowIntervention(true)} isMobile={isMobile} />}
      {showIntervention && <InterventionModal onClose={() => setShowIntervention(false)} onReset={handleReset} onClaimOffer={handleClaimOffer} isMobile={isMobile} />}
      {viewMode === 'CONFIG_T2' && <ConfigTier2 mode={mode} onClose={() => setViewMode('IDLE')} activeColor={activeColor} setColor={setActiveColor} activeText={activeText} setText={setActiveText} discountApplied={discountApplied} isMobile={isMobile} />}
      {viewMode === 'CONFIG_T3' && <ConfigTier3 mode={mode} onClose={() => setViewMode('IDLE')} isMobile={isMobile} />}
      {viewMode === 'SUCCESS' && <SuccessScreen onClose={handleCloseSuccess} isMobile={isMobile} />}
    </>
  )
}