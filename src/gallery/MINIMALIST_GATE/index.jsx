// C:\Users\Gaming\_RUNE_HQ\PLAYGROUND\src\gallery\MINIMALIST_GATE\index.jsx

import React from 'react'

const MinimalistGate = ({ onEnter }) => {
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: '#020202', display: 'flex', flexDirection: 'column', 
      justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      fontFamily: 'monospace', color: '#fff', textAlign: 'center'
    }}>
      
      <h1 style={{ 
        fontSize: '48px', letterSpacing: '10px', fontWeight: 600, 
        color: '#fff', textTransform: 'uppercase', marginBottom: '10px'
      }}>
        RUNE DIGITAL
      </h1>
      
      <p style={{ color: '#888', fontSize: '14px', letterSpacing: '4px', marginBottom: '50px' }}>
        SYSTEM ENTRY REQUIRED
      </p>

      <button 
        onClick={onEnter}
        style={{
          background: '#ff0055', color: '#000', border: 'none', 
          padding: '20px 60px', fontSize: '16px', letterSpacing: '5px', 
          cursor: 'pointer', fontWeight: 'bold', 
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => { e.target.style.letterSpacing = '10px' }}
        onMouseLeave={(e) => { e.target.style.letterSpacing = '5px' }}
      >
        INITIALIZE SHOWROOM
      </button>

      <div style={{ position: 'fixed', bottom: '20px', fontSize: '10px', color: '#333' }}>
        // HIGH PERFORMANCE GUARANTEED //
      </div>

    </div>
  )
}

export default MinimalistGate;