import React, { useEffect, useRef, useState } from 'react'

export default function GateKeeper({ onEnter }) {
  const [clicked, setClicked] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const containerRef = useRef(null)
  const contentRef = useRef(null)
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
      const coordsEl = document.getElementById('xy')
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

      if (containerRef.current && !clicked) {
        const dx = (mouseX - window.innerWidth / 2) / window.innerWidth
        const dy = (mouseY - window.innerHeight / 2) / window.innerHeight
        containerRef.current.style.transform = `translate(-50%, -50%) rotateY(${dx * 40}deg) rotateX(${-dy * 40}deg)`
      }
      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    const frameId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frameId)
    }
  }, [clicked])

  const handleShatter = () => {
    if (clicked) return
    setClicked(true)

    // Create shards
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2

    for (let i = 0; i < 50; i++) {
      const shard = document.createElement('div')
      shard.className = 'shard'
      document.body.appendChild(shard)

      const w = Math.random() * 3 + 1
      const h = Math.random() * 50 + 10
      shard.style.width = w + 'px'
      shard.style.height = h + 'px'
      shard.style.left = cx + 'px'
      shard.style.top = cy + 'px'

      const ang = Math.random() * Math.PI * 2
      const vel = Math.random() * 15 + 2
      let vx = Math.cos(ang) * vel
      let vy = Math.sin(ang) * vel
      let r = Math.random() * 360
      let life = 1

      const tick = () => {
        const rect = shard.getBoundingClientRect()
        shard.style.left = rect.left + vx + 'px'
        shard.style.top = rect.top + vy + 'px'
        shard.style.transform = `rotate(${r}deg)`
        vy += 0.2
        r += 5
        life -= 0.015
        shard.style.opacity = life
        if (life > 0) requestAnimationFrame(tick)
        else shard.remove()
      }
      tick()
    }

    // Flash
    const flash = document.createElement('div')
    flash.style.position = 'fixed'
    flash.style.top = '0'
    flash.style.left = '0'
    flash.style.width = '100%'
    flash.style.height = '100%'
    flash.style.background = '#fff'
    flash.style.zIndex = '100'
    flash.style.transition = 'opacity 0.5s'
    document.body.appendChild(flash)
    setTimeout(() => (flash.style.opacity = '0'), 50)
    setTimeout(() => flash.remove(), 600)

    // Reveal content
    setTimeout(() => setShowContent(true), 800)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#020202',
      overflow: 'hidden',
      cursor: 'none',
      margin: 0,
      padding: 0
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=JetBrains+Mono:wght@300;700&display=swap');

        body { margin: 0; }

        .gatekeeper-scanlines {
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

        .gatekeeper-vignette {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, transparent 60%, black 100%);
          z-index: 80;
          pointer-events: none;
        }

        .gatekeeper-hud {
          position: fixed;
          font-size: 10px;
          color: #555;
          z-index: 85;
          pointer-events: none;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-family: 'JetBrains Mono', monospace;
        }

        .gk-tl { top: 30px; left: 30px; border-top: 1px solid #333; border-left: 1px solid #333; padding: 10px; }
        .gk-tr { top: 30px; right: 30px; border-top: 1px solid #333; border-right: 1px solid #333; padding: 10px; text-align: right; }
        .gk-bl { bottom: 30px; left: 30px; border-bottom: 1px solid #333; border-left: 1px solid #333; padding: 10px; }
        .gk-br { bottom: 30px; right: 30px; border-bottom: 1px solid #333; border-right: 1px solid #333; padding: 10px; text-align: right; }

        .gatekeeper-cursor {
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

        .gatekeeper-trail {
          position: fixed;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(197, 160, 89, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 9998;
        }

        .gatekeeper-artifact {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 50;
          perspective: 1000px;
          cursor: pointer;
        }

        .gk-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(197, 160, 89, 0.3);
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.1);
          pointer-events: none;
        }

        .gk-ring-1 { width: 380px; height: 380px; border-top: 2px solid #c5a059; border-bottom: 2px solid #c5a059; animation: gk-spin 20s linear infinite; }
        .gk-ring-2 { width: 280px; height: 280px; border-left: 1px solid #fff; border-right: 1px solid #fff; opacity: 0.5; animation: gk-spin-rev 15s linear infinite; }
        .gk-ring-3 { width: 140px; height: 140px; border: 1px dashed rgba(197, 160, 89, 0.8); animation: gk-spin 10s linear infinite; }

        .gk-core {
          width: 6px;
          height: 6px;
          background: #fff;
          box-shadow: 0 0 50px #c5a059;
          position: relative;
          z-index: 60;
        }

        @keyframes gk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes gk-spin-rev { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }

        .gatekeeper-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          opacity: 0;
          pointer-events: none;
          z-index: 70;
          width: 100%;
          transition: opacity 2s ease;
        }

        .gatekeeper-content.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .gk-title {
          font-family: 'Cinzel', serif;
          font-size: 5rem;
          color: #eee;
          margin: 0;
          letter-spacing: 0.3em;
          text-shadow: 0 0 30px rgba(197, 160, 89, 0.3);
        }

        .gk-subtitle {
          font-size: 0.8rem;
          letter-spacing: 0.5em;
          color: #c5a059;
          margin-top: 1rem;
          border-top: 1px solid #333;
          display: inline-block;
          padding-top: 10px;
          font-family: 'JetBrains Mono', monospace;
        }

        .gk-btn-row {
          margin-top: 60px;
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .gk-btn {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #c5a059;
          color: #c5a059;
          padding: 15px 40px;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 2px;
          cursor: none;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .gk-btn:hover {
          background: #c5a059;
          color: #000;
          box-shadow: 0 0 30px rgba(197, 160, 89, 0.4);
        }

        .shard {
          position: absolute;
          background: #c5a059;
          pointer-events: none;
          box-shadow: 0 0 15px #c5a059;
        }

        .gatekeeper-boot-text {
          position: absolute;
          top: 60%;
          width: 100%;
          text-align: center;
          color: #444;
          font-size: 10px;
          letter-spacing: 2px;
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      <div className="gatekeeper-vignette"></div>
      <div className="gatekeeper-scanlines"></div>
      <div ref={cursorRef} className="gatekeeper-cursor"></div>
      <div ref={trailRef} className="gatekeeper-trail"></div>

      {/* HUD */}
      <div className="gatekeeper-hud gk-tl">SYS.ROOT<br />ID: RUNE</div>
      <div className="gatekeeper-hud gk-tr">LATENCY: 12ms<br />SECURE</div>
      <div className="gatekeeper-hud gk-bl">COORDS: <span id="xy">0,0</span></div>
      <div className="gatekeeper-hud gk-br">VER 2.4.0<br />STABLE</div>

      {/* Artifact */}
      {!clicked && (
        <>
          <div ref={containerRef} className="gatekeeper-artifact" onClick={handleShatter}>
            <div className="gk-ring gk-ring-1"></div>
            <div className="gk-ring gk-ring-2"></div>
            <div className="gk-ring gk-ring-3"></div>
            <div className="gk-core"></div>
          </div>
          <div className="gatekeeper-boot-text">WAITING FOR INPUT...</div>
        </>
      )}

      {/* Content */}
      <div ref={contentRef} className={`gatekeeper-content ${showContent ? 'visible' : ''}`}>
        <h1 className="gk-title">RUNE</h1>
        <div className="gk-subtitle">DIGITAL ASSETS</div>
        <div className="gk-btn-row">
          <button onClick={onEnter} className="gk-btn">ENTER</button>
        </div>
      </div>
    </div>
  )
}
