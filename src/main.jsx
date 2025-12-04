import React from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import App from './App'
import Paywall from './Paywall'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Paywall>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
         <color attach="background" args={['#101010']} />
         <App />
      </Canvas>
    </Paywall>
  </React.StrictMode>,
)