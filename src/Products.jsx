import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Generated from orchestrator agents
const PRODUCTS = [
  {
    name: "BURNRATE",
    tagline: "API cost tracking for AI/ML teams",
    description: "Real-time dashboard for monitoring and optimizing API spend across your AI stack.",
    stage: "Live",
    target: "ML Engineers, DevOps",
    demo: "/lab/BURNRATE.html",
    features: ["Real-time cost tracking", "Usage analytics", "Budget alerts"],
    color: "#ff6b6b"
  },
  {
    name: "Enterprise Command",
    tagline: "Multi-tier ops dashboard",
    description: "Unified operations visibility across your entire infrastructure with role-based access.",
    stage: "Live", 
    target: "Enterprise Ops Teams",
    demo: "/lab/ENTERPRISE_COMMAND.html",
    features: ["Centralized metrics", "Role-based views", "Integration APIs"],
    color: "#4ecdc4"
  },
  {
    name: "Neural Hub",
    tagline: "Agent orchestration platform",
    description: "Coordinate multi-agent workflows with typed state, routers, and failure semantics.",
    stage: "Beta",
    target: "AI Developers",
    demo: "/lab/NEURAL_HUB.html",
    features: ["Agent coordination", "State machines", "Workflow automation"],
    color: "#45b7d1"
  },
  {
    name: "MIMIC",
    tagline: "AI game with self-aware enemies",
    description: "Meta-horror game where the AI knows it's AI. Enemies learn, adapt, and remember.",
    stage: "Prototype",
    target: "Game Studios, R&D",
    demo: null,
    features: ["Adaptive AI", "Persistent memory", "Dynamic difficulty"],
    color: "#96ceb4"
  },
  {
    name: "Pheromone Computing",
    tagline: "Biomimetic agent coordination",
    description: "Novel R&D applying ant colony optimization patterns to multi-agent systems.",
    stage: "R&D",
    target: "Researchers",
    demo: null,
    features: ["Stigmergic signals", "Emergent behavior", "Decentralized control"],
    color: "#a29bfe"
  },
  {
    name: "GAP HUNTER",
    tagline: "Market pain point detection",
    description: "Fine-tuned model for identifying underserved needs in vertical markets.",
    stage: "R&D",
    target: "Product Teams",
    demo: null,
    features: ["Pain point analysis", "Opportunity scoring", "Market mapping"],
    color: "#fd79a8"
  }
];

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 5px var(--glow-color), 0 0 10px var(--glow-color); }
  50% { box-shadow: 0 0 15px var(--glow-color), 0 0 30px var(--glow-color); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  padding: 80px 40px;
  font-family: 'Oswald', sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: 4px;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #888;
  max-width: 600px;
  margin: 0 auto;
  letter-spacing: 1px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Card = styled.div`
  --glow-color: ${props => props.$color || '#00ffcc'};
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  border: 1px solid #2a2a2a;
  border-radius: 0;
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    border-color: var(--glow-color);
    transform: translateY(-8px) scale(1.02);
    animation: ${glowPulse} 2s infinite;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--glow-color);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const ProductName = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 2px;
`;

const Stage = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: ${props => {
    switch(props.$stage) {
      case 'Live': return 'rgba(76, 217, 100, 0.2)';
      case 'Beta': return 'rgba(255, 204, 0, 0.2)';
      case 'Prototype': return 'rgba(90, 200, 250, 0.2)';
      default: return 'rgba(142, 142, 147, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.$stage) {
      case 'Live': return '#4cd964';
      case 'Beta': return '#ffcc00';
      case 'Prototype': return '#5ac8fa';
      default: return '#8e8e93';
    }
  }};
`;

const Tagline = styled.p`
  font-size: 1.1rem;
  color: ${props => props.$color || '#00ffcc'};
  margin: 0 0 12px 0;
  font-weight: 500;
  letter-spacing: 1px;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #999;
  line-height: 1.6;
  margin: 0 0 20px 0;
`;

const Target = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 16px;
  letter-spacing: 1px;
  
  span {
    color: #888;
    font-weight: 500;
  }
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Feature = styled.li`
  font-size: 0.75rem;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #aaa;
  letter-spacing: 1px;
  transition: all 0.2s;

  ${Card}:hover & {
    border-color: ${props => props.$color || '#00ffcc'};
    color: #fff;
  }
`;

const DemoButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid ${props => props.$color || '#00ffcc'};
  color: ${props => props.$color || '#00ffcc'};
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: 2px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$color || '#00ffcc'};
    color: #000;
    transform: scale(1.05);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const NoDemo = styled.span`
  font-size: 0.85rem;
  color: #555;
  font-style: italic;
  letter-spacing: 1px;
`;

const BackLink = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 40px;
  cursor: pointer;
  transition: color 0.2s;
  letter-spacing: 2px;

  &:hover {
    color: #00ffea;
  }
`;

export default function Products({ onBack }) {
  return (
    <Container>
      <BackLink onClick={onBack}>
        ← RETURN TO SHOWROOM
      </BackLink>
      
      <Header>
        <Title>PRODUCTS</Title>
        <Subtitle>
          AI orchestration tools built on Google Cloud. 
          From cost tracking to agent coordination.
        </Subtitle>
      </Header>

      <Grid>
        {PRODUCTS.map((product) => (
          <Card key={product.name} $color={product.color}>
            <CardHeader>
              <ProductName>{product.name}</ProductName>
              <Stage $stage={product.stage}>{product.stage}</Stage>
            </CardHeader>

            <Tagline $color={product.color}>{product.tagline}</Tagline>
            <Description>{product.description}</Description>
            
            <Target>
              <span>TARGET:</span> {product.target}
            </Target>

            <Features>
              {product.features.map((f) => (
                <Feature key={f} $color={product.color}>{f}</Feature>
              ))}
            </Features>

            {product.demo ? (
              <DemoButton href={product.demo} $color={product.color}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                TRY LIVE DEMO
              </DemoButton>
            ) : (
              <NoDemo>DEMO COMING SOON</NoDemo>
            )}
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
