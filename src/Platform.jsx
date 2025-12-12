import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  padding: 80px 40px;
  font-family: 'Oswald', sans-serif;
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: 4px;

  span {
    color: #00ffea;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #888;
  letter-spacing: 1px;
`;

const ArchDiagram = styled.div`
  max-width: 1200px;
  margin: 0 auto 80px;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  border: 1px solid #30363d;
  padding: 60px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #00ffea, #4285f4, #00ffea);
  }
`;

const LayerRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: ${props => props.$last ? '0' : '40px'};
  position: relative;
  flex-wrap: wrap;

  &::after {
    content: ${props => props.$arrow ? "'↓'" : "''"};
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    color: #444;
    font-size: 1.5rem;
  }
`;

const Node = styled.div`
  padding: 20px 32px;
  background: ${props => props.$color || 'rgba(0, 255, 234, 0.1)'};
  border: 2px solid ${props => props.$borderColor || 'rgba(0, 255, 234, 0.3)'};
  text-align: center;
  min-width: 160px;
  transition: all 0.3s;
  animation: ${pulse} 3s infinite;
  animation-delay: ${props => props.$delay || '0s'};

  &:hover {
    transform: scale(1.05);
    border-color: ${props => props.$hoverColor || '#00ffea'};
    box-shadow: 0 0 30px ${props => props.$glowColor || 'rgba(0, 255, 234, 0.3)'};
  }
`;

const NodeTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  letter-spacing: 2px;
`;

const NodeDesc = styled.div`
  font-size: 0.75rem;
  color: #888;
  letter-spacing: 1px;
`;

const Section = styled.section`
  max-width: 1000px;
  margin: 0 auto 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: 3px;

  &::before {
    content: '';
    width: 4px;
    height: 32px;
    background: #00ffea;
  }
`;

const CapabilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const Capability = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  border: 1px solid #2a2a2a;
  transition: all 0.3s;

  &:hover {
    border-color: ${props => props.$color || '#00ffea'};
    transform: translateY(-4px);
  }
`;

const CapIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 16px;
`;

const CapTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: 2px;
`;

const CapDesc = styled.p`
  font-size: 0.9rem;
  color: #888;
  line-height: 1.6;
  margin: 0;
`;

const CodeBlock = styled.pre`
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  padding: 24px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #00ffea;
  line-height: 1.6;
`;

export default function Platform({ onBack }) {
  return (
    <Container>
      <BackLink onClick={onBack}>
        ← RETURN TO SHOWROOM
      </BackLink>

      <Header>
        <Title>THE <span>PLATFORM</span></Title>
        <Subtitle>
          Multi-tier agent orchestration built on Google Cloud infrastructure.
          Typed state, intelligent routing, graceful failure handling.
        </Subtitle>
      </Header>

      <ArchDiagram>
        {/* User Layer */}
        <LayerRow $arrow>
          <Node $color="rgba(66, 133, 244, 0.1)" $borderColor="rgba(66, 133, 244, 0.3)" $hoverColor="#4285f4" $glowColor="rgba(66, 133, 244, 0.3)" $delay="0s">
            <NodeTitle>USER REQUEST</NodeTitle>
            <NodeDesc>API / Dashboard / CLI</NodeDesc>
          </Node>
        </LayerRow>

        {/* Orchestration Layer */}
        <LayerRow $arrow>
          <Node $delay="0.2s">
            <NodeTitle>ROUTER</NodeTitle>
            <NodeDesc>Quality / Cost / Latency</NodeDesc>
          </Node>
          <Node $delay="0.3s">
            <NodeTitle>STATE MACHINE</NodeTitle>
            <NodeDesc>Typed State + Run IDs</NodeDesc>
          </Node>
          <Node $delay="0.4s">
            <NodeTitle>FAILURE HANDLER</NodeTitle>
            <NodeDesc>OK / RETRY / FAIL / HUMAN</NodeDesc>
          </Node>
        </LayerRow>

        {/* Agent Layer */}
        <LayerRow $arrow>
          <Node $color="rgba(251, 188, 5, 0.1)" $borderColor="rgba(251, 188, 5, 0.3)" $hoverColor="#fbbc05" $glowColor="rgba(251, 188, 5, 0.3)" $delay="0.5s">
            <NodeTitle>TIER 1: WRECKING CREW</NodeTitle>
            <NodeDesc>GPT-4o / Claude / Gemini</NodeDesc>
          </Node>
          <Node $color="rgba(234, 67, 53, 0.1)" $borderColor="rgba(234, 67, 53, 0.3)" $hoverColor="#ea4335" $glowColor="rgba(234, 67, 53, 0.3)" $delay="0.6s">
            <NodeTitle>TIER 2: SPECIALISTS</NodeTitle>
            <NodeDesc>Genesis / Harvest / Package</NodeDesc>
          </Node>
          <Node $color="rgba(52, 168, 83, 0.1)" $borderColor="rgba(52, 168, 83, 0.3)" $hoverColor="#34a853" $glowColor="rgba(52, 168, 83, 0.3)" $delay="0.7s">
            <NodeTitle>TIER 3: UTILITIES</NodeTitle>
            <NodeDesc>Index / Polish / Cleanup</NodeDesc>
          </Node>
        </LayerRow>

        {/* Infrastructure Layer */}
        <LayerRow $last>
          <Node $color="rgba(66, 133, 244, 0.1)" $borderColor="rgba(66, 133, 244, 0.3)" $hoverColor="#4285f4" $glowColor="rgba(66, 133, 244, 0.3)" $delay="0.8s">
            <NodeTitle>VERTEX AI</NodeTitle>
            <NodeDesc>Model Garden</NodeDesc>
          </Node>
          <Node $color="rgba(66, 133, 244, 0.1)" $borderColor="rgba(66, 133, 244, 0.3)" $hoverColor="#4285f4" $glowColor="rgba(66, 133, 244, 0.3)" $delay="0.9s">
            <NodeTitle>CLOUD RUN</NodeTitle>
            <NodeDesc>Agent Containers</NodeDesc>
          </Node>
          <Node $color="rgba(66, 133, 244, 0.1)" $borderColor="rgba(66, 133, 244, 0.3)" $hoverColor="#4285f4" $glowColor="rgba(66, 133, 244, 0.3)" $delay="1s">
            <NodeTitle>BIGQUERY</NodeTitle>
            <NodeDesc>Cost Analytics</NodeDesc>
          </Node>
          <Node $color="rgba(66, 133, 244, 0.1)" $borderColor="rgba(66, 133, 244, 0.3)" $hoverColor="#4285f4" $glowColor="rgba(66, 133, 244, 0.3)" $delay="1.1s">
            <NodeTitle>CLOUD STORAGE</NodeTitle>
            <NodeDesc>Artifact Store</NodeDesc>
          </Node>
        </LayerRow>
      </ArchDiagram>

      <Section>
        <SectionTitle>CORE CAPABILITIES</SectionTitle>
        <CapabilityGrid>
          <Capability $color="#4285f4">
            <CapIcon>🎯</CapIcon>
            <CapTitle>TYPED STATE</CapTitle>
            <CapDesc>
              Every agent interaction has structured inputs and outputs. 
              No stringly-typed chaos. Run IDs track every decision.
            </CapDesc>
          </Capability>

          <Capability $color="#fbbc05">
            <CapIcon>🔀</CapIcon>
            <CapTitle>INTELLIGENT ROUTER</CapTitle>
            <CapDesc>
              Route requests based on quality requirements, cost constraints, 
              and latency SLAs. Right model for right task.
            </CapDesc>
          </Capability>

          <Capability $color="#ea4335">
            <CapIcon>🛡️</CapIcon>
            <CapTitle>FAILURE SEMANTICS</CapTitle>
            <CapDesc>
              OK | RETRYABLE_FAIL | HARD_FAIL | NEEDS_HUMAN. 
              Every agent response is typed for graceful degradation.
            </CapDesc>
          </Capability>

          <Capability $color="#34a853">
            <CapIcon>🧪</CapIcon>
            <CapTitle>EVAL HARNESS</CapTitle>
            <CapDesc>
              Built-in evaluation framework. Test agent outputs against 
              golden datasets before production deployment.
            </CapDesc>
          </Capability>

          <Capability $color="#00ffea">
            <CapIcon>🔐</CapIcon>
            <CapTitle>PERMISSIONED TOOLS</CapTitle>
            <CapDesc>
              Agents request tool access through capability contracts. 
              No implicit permissions. Audit everything.
            </CapDesc>
          </Capability>

          <Capability $color="#a29bfe">
            <CapIcon>🐜</CapIcon>
            <CapTitle>PHEROMONE SIGNALS</CapTitle>
            <CapDesc>
              Novel R&D: agents leave coordination signals for other agents.
              Stigmergic communication without direct messaging.
            </CapDesc>
          </Capability>
        </CapabilityGrid>
      </Section>

      <Section>
        <SectionTitle>AGENT DEFINITION EXAMPLE</SectionTitle>
        <CodeBlock>
{`@dataclass
class AgentResult:
    status: Literal["OK", "RETRYABLE_FAIL", "HARD_FAIL", "NEEDS_HUMAN"]
    output: TypedOutput
    run_id: str
    cost_usd: float
    latency_ms: int

def content_agent(state: OrchestrationState) -> AgentResult:
    """Generate typed content with failure handling."""
    try:
        result = call_vertex_ai(
            model="gemini-2.0-flash",
            prompt=state.to_prompt(),
            output_schema=ContentSchema
        )
        return AgentResult(status="OK", output=result, ...)
    except RetryableError:
        return AgentResult(status="RETRYABLE_FAIL", ...)
    except HardError:
        return AgentResult(status="HARD_FAIL", ...)`}
        </CodeBlock>
      </Section>
    </Container>
  );
}
