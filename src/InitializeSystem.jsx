import React, { useEffect, useRef, useState } from 'react'

export default function InitializeSystem({ onEnter }) {
  const cursorRef = useRef(null)
  const trailRef = useRef(null)

  useEffect(() => {
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let trailX = mouseX
    let trailY = mouseY

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = mouseX + 'px'
        cursorRef.current.style.top = mouseY + 'px'
      }
      // Update HUD coords
      const coordsEl = document.getElementById('xy-init')
      if (coordsEl) {
        coordsEl.textContent = `${Math.round(mouseX)},${Math.round(mouseY)}`
      }
    }

    const animate = () => {
      trailX += (mouseX - trailX) * 0.15
      trailY += (mouseY - trailY) * 0.15
      if (trailRef.current) {
        trailRef.current.style.left = trailX + 'px'
        trailRef.current.style.top = trailY + 'px'
      }
      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    const frameId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#020202',
      overflow: 'auto',
      cursor: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=JetBrains+Mono:wght@300;700&display=swap');

        body { margin: 0; }

        .init-scanlines {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                      linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 90;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .init-vignette {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, transparent 60%, black 100%);
          z-index: 80;
          pointer-events: none;
        }

        .init-hud {
          position: fixed;
          font-size: 10px;
          color: #555;
          z-index: 85;
          pointer-events: none;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-family: 'JetBrains Mono', monospace;
        }

        .init-tl { top: 30px; left: 30px; border-top: 1px solid #333; border-left: 1px solid #333; padding: 10px; }
        .init-tr { top: 30px; right: 30px; border-top: 1px solid #333; border-right: 1px solid #333; padding: 10px; text-align: right; }
        .init-bl { bottom: 30px; left: 30px; border-bottom: 1px solid #333; border-left: 1px solid #333; padding: 10px; }
        .init-br { bottom: 30px; right: 30px; border-bottom: 1px solid #333; border-right: 1px solid #333; padding: 10px; text-align: right; }

        .init-cursor {
          position: fixed;
          width: 12px;
          height: 12px;
          border: 1px solid #c5a059;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
        }

        .init-trail {
          position: fixed;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(197, 160, 89, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 9998;
        }

        .init-container {
          position: relative;
          z-index: 50;
          max-width: 600px;
          text-align: center;
          padding: 60px 40px;
        }

        .init-title {
          font-family: 'Cinzel', serif;
          font-size: 3rem;
          color: #eee;
          margin: 0 0 30px 0;
          letter-spacing: 0.3em;
          text-shadow: 0 0 30px rgba(197, 160, 89, 0.3);
        }

        .init-section {
          margin: 40px 0;
          padding: 20px;
          border: 1px solid rgba(197, 160, 89, 0.2);
        }

        .init-section-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: #c5a059;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 15px;
        }

        .init-contact {
          font-family: 'JetBrains Mono', monospace;
          color: #aaa;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .init-contact a {
          color: #c5a059;
          text-decoration: none;
          border-bottom: 1px solid #c5a059;
          transition: all 0.3s;
        }

        .init-contact a:hover {
          color: #fff;
        }

        .init-pricing {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .init-price-card {
          flex: 0 1 150px;
          border: 1px solid #333;
          padding: 15px;
          background: rgba(0, 0, 0, 0.5);
          transition: all 0.3s;
        }

        .init-price-card:hover {
          border-color: #c5a059;
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.2);
        }

        .init-price-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #c5a059;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }

        .init-price-amount {
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          color: #eee;
          margin: 0;
        }

        .init-btn {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #c5a059;
          color: #c5a059;
          padding: 15px 50px;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 2px;
          cursor: none;
          transition: all 0.3s ease;
          margin-top: 40px;
        }

        .init-btn:hover {
          background: #c5a059;
          color: #000;
          box-shadow: 0 0 30px rgba(197, 160, 89, 0.4);
        }
      `}</style>

      <div className="init-vignette"></div>
      <div className="init-scanlines"></div>
      <div ref={cursorRef} className="init-cursor"></div>
      <div ref={trailRef} className="init-trail"></div>

      {/* HUD */}
      <div className="init-hud init-tl">SYS.ROOT<br />ID: RUNE</div>
      <div className="init-hud init-tr">LATENCY: 12ms<br />SECURE</div>
      <div className="init-hud init-bl">COORDS: <span id="xy-init">0,0</span></div>
      <div className="init-hud init-br">VER 2.4.0<br />STABLE</div>

      {/* Content */}
      <div className="init-container">
        <h1 className="init-title">INITIALIZE SYSTEM</h1>

        {/* Contact Section */}
        <div className="init-section">
          <div className="init-section-title">Contact Information</div>
          <div className="init-contact">
            For inquiries or custom solutions:<br />
            <a href="mailto:quotes@runedigitalstudio.com">quotes@runedigitalstudio.com</a>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="init-section">
          <div className="init-section-title">Pricing Tiers</div>
          <div className="init-pricing">
            <div className="init-price-card">
              <div className="init-price-name">Protocol 1</div>
              <div className="init-price-amount">$499</div>
            </div>
            <div className="init-price-card">
              <div className="init-price-name">Protocol 2</div>
              <div className="init-price-amount">$1,499</div>
            </div>
            <div className="init-price-card">
              <div className="init-price-name">Protocol 3</div>
              <div className="init-price-amount">$3,800+</div>
            </div>
          </div>
        </div>

        {/* Button */}
        <button onClick={onEnter} className="init-btn">Enter Showroom</button>
      </div>
    </div>
  )
}
