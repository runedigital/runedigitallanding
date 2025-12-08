import React, { useState, useEffect } from 'react'

const OrchestrationDemo = () => {
  const [decisionsCount, setDecisionsCount] = useState(0)
  const [successRate, setSuccessRate] = useState(85)
  const [avgTime, setAvgTime] = useState(50)
  const [timelineItems, setTimelineItems] = useState([
    { time: '14:23:15', agent: 'Enterprise Architect', message: 'Initiated platform architecture evaluation' },
    { time: '14:23:42', agent: 'Enterprise Architect', message: 'Completed 12 architectural decisions' },
    { time: '14:24:01', agent: 'Security Architect', message: 'Started security framework assessment' }
  ])

  const agents = [
    { name: 'Enterprise Architect', tier: 'Tier 1', status: 'EXECUTING' },
    { name: 'Training Director', tier: 'Tier 1', status: 'AWAITING' },
    { name: 'GoToMarket Director', tier: 'Tier 1', status: 'EXECUTING' },
    { name: 'Platform Engineer', tier: 'Tier 2', status: 'IDLE' },
    { name: 'API Designer', tier: 'Tier 2', status: 'IDLE' },
    { name: 'Security Architect', tier: 'Tier 2', status: 'EXECUTING' },
    { name: 'Customer Success', tier: 'Tier 2', status: 'IDLE' }
  ]

  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setDecisionsCount(prev => prev + Math.floor(Math.random() * 3) + 1)
      setSuccessRate(prev => Math.max(85, Math.min(99, prev + (Math.random() - 0.5) * 5)))
      setAvgTime(Math.floor(Math.random() * 200) + 50)
    }, 2000)

    return () => clearInterval(metricsInterval)
  }, [])

  useEffect(() => {
    const timelineInterval = setInterval(() => {
      const agentList = agents.map(a => a.name)
      const messages = [
        'Architecture review completed',
        'Training module drafted',
        'Go-to-market strategy finalized',
        'API specification updated',
        'Security assessment done'
      ]
      
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      const agent = agentList[Math.floor(Math.random() * agentList.length)]
      const message = messages[Math.floor(Math.random() * messages.length)]
      
      setTimelineItems(prev => [
        ...prev.slice(-9),
        { time, agent, message }
      ])
    }, 4000)

    return () => clearInterval(timelineInterval)
  }, [])

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)',
      minHeight: '100vh',
      color: '#fff',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Grid */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(0, 255, 163, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 163, 0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Glow Effects */}
      <div style={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        background: '#00ffa3',
        borderRadius: '50%',
        filter: 'blur(150px)',
        opacity: 0.1,
        top: '-200px',
        left: '-200px',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        background: '#00d4ff',
        borderRadius: '50%',
        filter: 'blur(150px)',
        opacity: 0.1,
        bottom: '-200px',
        right: '-200px',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1800px', margin: '0 auto' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '2rem', letterSpacing: '1px' }}>
          Multi-Agent <span style={{ color: '#00ffa3' }}>Orchestration</span> Engine
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <MetricCard label="Decisions Processed" value={decisionsCount} />
          <MetricCard label="Active Agents" value={agents.length} />
          <MetricCard label="Success Rate" value={`${Math.round(successRate)}%`} />
          <MetricCard label="Avg Processing Time" value={`${avgTime}ms`} />
        </div>

        {/* Dashboard Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Tier 1 */}
          <Card title="Tier 1 Executive Agents">
            {agents.filter(a => a.tier === 'Tier 1').map((agent, i) => (
              <AgentItem key={i} agent={agent} />
            ))}
          </Card>

          {/* Tier 2 */}
          <Card title="Tier 2 Specialist Agents">
            {agents.filter(a => a.tier === 'Tier 2').map((agent, i) => (
              <AgentItem key={i} agent={agent} />
            ))}
          </Card>

          {/* Task Queue */}
          <Card title="Active Decision Queue">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <TaskItem status="COMPLETE" task="Platform Architecture Review" />
              <TaskItem status="PROCESSING" task="API Specification Draft" />
              <TaskItem status="QUEUED" task="Security Framework Design" />
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <Card title="Execution Timeline">
          <div style={{ maxHeight: '400px', overflowY: 'auto', paddingLeft: '1.5rem', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '0',
              top: '0',
              bottom: '0',
              width: '2px',
              background: 'linear-gradient(to bottom, #00ffa3, transparent)'
            }} />
            {timelineItems.map((item, i) => (
              <div key={i} style={{ marginBottom: '1rem', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '-2.25rem',
                  top: '0.5rem',
                  width: '12px',
                  height: '12px',
                  background: '#00ffa3',
                  borderRadius: '50%',
                  border: '3px solid #0a0a0f'
                }} />
                <div style={{
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  borderLeft: '2px solid #00ffa3',
                  fontSize: '12px'
                }}>
                  <div style={{ fontSize: '10px', color: '#888', marginBottom: '0.25rem', fontFamily: 'monospace' }}>
                    2025-12-08 {item.time}
                  </div>
                  <div style={{ color: '#ccc' }}>
                    <strong>{item.agent}:</strong> {item.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Info */}
        <Card title="About This Demo">
          <div style={{ color: '#aaa', lineHeight: 1.6, fontSize: '13px' }}>
            <p style={{ marginBottom: '1rem' }}>
              This is a live demonstration of RUNE's <strong>Multi-Agent Orchestration Engine</strong>.
              The system uses a hierarchical agent structure with Tier 1 Executive agents coordinating
              Tier 2 Specialist agents to process complex decision workflows.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Key Features:</strong>
            </p>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>• Parallel execution of 11+ agents across 2 tiers</li>
              <li>• Constrained generation (Point A → Point B framework)</li>
              <li>• Zero hallucination via structured decision spaces</li>
              <li>• Local LLM inference (Ollama + RTX 4070) + Cloud scalability (Vertex AI)</li>
              <li>• Immutable audit trail of all decisions (STATE.json)</li>
              <li>• Floater system for infinite context persistence</li>
            </ul>
            <p>
              This orchestration engine powers enterprise automation, decision pipelines, and
              high-volume AI-assisted workflows across industries.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

const MetricCard = ({ label, value }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)'
  }}>
    <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
      {label}
    </div>
    <div style={{ fontSize: '24px', fontWeight: 700, color: '#00ffa3', fontFamily: 'monospace' }}>
      {value}
    </div>
  </div>
)

const Card = ({ title, children }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = '#00ffa3'
    e.currentTarget.style.background = 'rgba(0, 255, 163, 0.05)'
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
  }}
  >
    <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#888', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ width: '6px', height: '6px', background: '#00ffa3', borderRadius: '50%' }} />
      {title}
    </div>
    {children}
  </div>
)

const AgentItem = ({ agent }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    borderLeft: '3px solid #00ffa3',
    fontSize: '13px',
    marginBottom: '0.75rem'
  }}>
    <span style={{ fontWeight: 600, color: '#fff', fontFamily: 'monospace' }}>
      {agent.name}
    </span>
    <span style={{
      fontSize: '11px',
      padding: '3px 8px',
      borderRadius: '3px',
      background: agent.status === 'EXECUTING' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(0, 212, 255, 0.1)',
      color: agent.status === 'EXECUTING' ? '#00ff88' : '#00d4ff',
      fontWeight: 600
    }}>
      {agent.status}
    </span>
  </div>
)

const TaskItem = ({ task, status }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    borderLeft: '3px solid ' + (status === 'COMPLETE' ? '#00ff88' : status === 'PROCESSING' ? '#ff4757' : '#888'),
    fontSize: '13px',
    marginBottom: '0.75rem'
  }}>
    <span style={{ fontWeight: 600, color: '#fff' }}>
      {task}
    </span>
    <span style={{
      fontSize: '11px',
      padding: '3px 8px',
      borderRadius: '3px',
      background: status === 'COMPLETE' ? 'rgba(0, 255, 136, 0.15)' : status === 'PROCESSING' ? 'rgba(255, 71, 87, 0.1)' : 'rgba(100, 100, 100, 0.1)',
      color: status === 'COMPLETE' ? '#00ff88' : status === 'PROCESSING' ? '#ff4757' : '#888',
      fontWeight: 600
    }}>
      {status}
    </span>
  </div>
)

export default OrchestrationDemo
