import React, { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial, Sphere, Sparkles, Text, Float } from '@react-three/drei'
import * as THREE from 'three'

// --- SHADER MATERIAL (Unchanged) ---
const InfernoMaterial = shaderMaterial(
 { time: 0, colorStart: new THREE.Color('#ff5500'), colorEnd: new THREE.Color('#aa0000') },
 `
  varying vec2 vUv;
  varying float vDisplacement;
  uniform float time;
  // ... (Keeping your original shader logic intact) ...
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
   const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
   const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
   vec3 i = floor(v + dot(v, C.yyy) );
   vec3 x0 = v - i + dot(i, C.xxx) ;
   vec3 g = step(x0.yzx, x0.xyz);
   vec3 l = 1.0 - g;
   vec3 i1 = min( g.xyz, l.zxy );
   vec3 i2 = max( g.xyz, l.zxy );
   vec3 x1 = x0 - i1 + C.xxx;
   vec3 x2 = x0 - i2 + C.yyy;
   vec3 x3 = x0 - D.yyy;
   i = mod289(i); 
   vec4 p = permute( permute( permute( 
      i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
      + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
   float n_ = 0.142857142857; 
   vec3 ns = n_ * D.wyz - D.xzx;
   vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
   vec4 x_ = floor(j * ns.z);
   vec4 y_ = floor(j - 7.0 * x_ );
   vec4 x = x_ *ns.x + ns.yyyy;
   vec4 y = y_ *ns.x + ns.yyyy;
   vec4 h = 1.0 - abs(x) - abs(y);
   vec4 b0 = vec4( x.xy, y.xy );
   vec4 b1 = vec4( x.zw, y.zw );
   vec4 s0 = floor(b0)*2.0 + 1.0;
   vec4 s1 = floor(b1)*2.0 + 1.0;
   vec4 sh = -step(h, vec4(0.0));
   vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
   vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
   vec3 p0 = vec3(a0.xy,h.x);
   vec3 p1 = vec3(a0.zw,h.y);
   vec3 p2 = vec3(a1.xy,h.z);
   vec3 p3 = vec3(a1.zw,h.w);
   vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
   p0 *= norm.x;
   p1 *= norm.y;
   p2 *= norm.z;
   p3 *= norm.w;
   vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
   m = m * m;
   return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }
  void main() {
   vUv = uv;
   float base = snoise(position * 0.6 + time * 0.3);
   float ridges = 1.0 - abs(snoise(position * 2.5 + time * 1.0));
   ridges = pow(ridges, 2.5); 
   float combined = base * 0.3 + ridges * 0.6;
   vDisplacement = combined;
   vec3 newPos = position + normal * combined * 0.6;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
 `,
 `
  varying float vDisplacement;
  uniform vec3 colorStart;
  uniform vec3 colorEnd;
  void main() {
   float mixStrength = smoothstep(-0.2, 0.8, vDisplacement);
   vec3 color = mix(colorEnd, colorStart, mixStrength);
   if(vDisplacement > 0.4) {
    float heat = (vDisplacement - 0.4) * 3.0;
    color += vec3(1.0, 1.0, 0.8) * heat;
   }
   gl_FragColor = vec4(color, 1.0);
  }
 `
)
extend({ InfernoMaterial })

function Fireball({ color }) {
 const materialRef = useRef()
 const { cStart, cEnd } = useMemo(() => {
  const c1 = new THREE.Color(color)
  const c2 = new THREE.Color(color).multiplyScalar(0.15) 
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
  <Sphere args={[1.5, 128, 128]}> 
   <infernoMaterial ref={materialRef} transparent />
  </Sphere>
 )
}

function AssetTitle({ text, color, font }) {
 return (
  <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
   <Text
    font={font}
    fontSize={0.8}
    letterSpacing={0.1}
    color={color}
    position={[0, 0, 2.5]} 
    anchorX="center"
    anchorY="middle"
    outlineWidth={0.03}
    outlineColor="#000000"
   >
    {text.toUpperCase()}
    <meshStandardMaterial emissive={color} emissiveIntensity={3} toneMapped={false} />
   </Text>
  </Float>
 )
}

// --- THE FIXED COMPONENT ---
// No Canvas. No Effects. Just the Object.
export default function Inferno({ primaryColor = '#ff3300', text = 'INFERNO', font }) {
 return (
  <group>
   <Fireball color={primaryColor} />
   <AssetTitle text={text} color={primaryColor} font={font} />
   <Sparkles count={200} color={primaryColor} size={8} speed={4} scale={10} noise={1} opacity={1} />
  </group>
 )
}