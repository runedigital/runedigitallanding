import React from 'react';
import styled, { keyframes } from 'styled-components';

const TEAM = [
  {
    name: "Joel Parkinson",
    role: "Founder & Lead Engineer",
    bio: "Full-stack developer with 10+ years building enterprise software. Previously led development teams at fintech startups. Now focused on making AI orchestration accessible to every developer.",
    skills: ["Python", "React", "Google Cloud", "Vertex AI", "Agent Systems"],
    focus: "Building the future of multi-agent coordination"
  }
];

const WHY_GOOGLE = {
  title: "Why Google Cloud",
  points: [
    {
      feature: "Vertex AI",
      reason: "Model Garden gives us access to 100+ foundation models. One API, unified deployment."
    },
    {
      feature: "Cloud Run",
      reason: "Scale-to-zero containers for agent workloads. Pay only when agents are thinking."
    },
    {
      feature: "BigQuery",
      reason: "Cost analytics across all API calls. BURNRATE is built on BigQuery streaming."
    },
    {
      feature: "Gemini",
      reason: "1M token context window for complex multi-agent planning and orchestration."
    }
  ]
};

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
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

const Section = styled.section`
  max-width: 1000px;
  margin: 0 auto 80px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 40px;
  letter-spacing: 4px;

  span {
    color: #00ffea;
  }
`;

const TeamCard = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  border: 1px solid #2a2a2a;
  padding: 40px;
  transition: all 0.3s;

  &:hover {
    border-color: #00ffea;
    box-shadow: 0 0 30px rgba(0, 255, 234, 0.1);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #00ffea;
  font-weight: 700;
  letter-spacing: 2px;
`;

const Info = styled.div``;

const Name = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: 2px;
`;

const Role = styled.p`
  font-size: 1.1rem;
  color: #00ffea;
  margin: 0 0 20px;
  font-weight: 500;
  letter-spacing: 2px;
`;

const Bio = styled.p`
  font-size: 1rem;
  color: #999;
  line-height: 1.7;
  margin: 0 0 24px;
`;

const Focus = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 20px;
  font-style: italic;
  letter-spacing: 1px;

  &::before {
    content: '→ ';
    color: #00ffea;
  }
`;

const Skills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Skill = styled.span`
  font-size: 0.8rem;
  padding: 6px 14px;
  background: rgba(0, 255, 234, 0.1);
  border: 1px solid rgba(0, 255, 234, 0.2);
  color: #00ffea;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 255, 234, 0.2);
    transform: scale(1.05);
  }
`;

const GoogleSection = styled.div`
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  border: 1px solid #30363d;
  padding: 48px;
`;

const GoogleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-top: 32px;
`;

const GoogleCard = styled.div`
  padding: 24px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #21262d;
  transition: all 0.3s;

  &:hover {
    border-color: #4285f4;
    transform: translateY(-4px);
  }
`;

const GoogleFeature = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 2px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #4285f4;
    animation: ${pulse} 2s infinite;
  }
`;

const GoogleReason = styled.p`
  font-size: 0.9rem;
  color: #8b949e;
  line-height: 1.6;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 60px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  text-align: center;
  padding: 32px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  border: 1px solid #2a2a2a;
  transition: all 0.3s;

  &:hover {
    border-color: #00ffea;
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #00ffea;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 3px;
`;

export default function Team({ onBack }) {
  return (
    <Container>
      <BackLink onClick={onBack}>
        ← RETURN TO SHOWROOM
      </BackLink>

      <Section>
        <SectionTitle>THE <span>TEAM</span></SectionTitle>
        
        {TEAM.map((member) => (
          <TeamCard key={member.name}>
            <Avatar>JP</Avatar>
            <Info>
              <Name>{member.name}</Name>
              <Role>{member.role}</Role>
              <Bio>{member.bio}</Bio>
              <Focus>{member.focus}</Focus>
              <Skills>
                {member.skills.map((skill) => (
                  <Skill key={skill}>{skill}</Skill>
                ))}
              </Skills>
            </Info>
          </TeamCard>
        ))}
      </Section>

      <Section>
        <StatsGrid>
          <Stat>
            <StatNumber>6</StatNumber>
            <StatLabel>Products</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>49</StatNumber>
            <StatLabel>Live Demos</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>1</StatNumber>
            <StatLabel>Mission</StatLabel>
          </Stat>
        </StatsGrid>
      </Section>

      <Section>
        <GoogleSection>
          <SectionTitle style={{ marginBottom: 0 }}>
            WHY <span>GOOGLE CLOUD</span>
          </SectionTitle>
          <GoogleGrid>
            {WHY_GOOGLE.points.map((point) => (
              <GoogleCard key={point.feature}>
                <GoogleFeature>{point.feature}</GoogleFeature>
                <GoogleReason>{point.reason}</GoogleReason>
              </GoogleCard>
            ))}
          </GoogleGrid>
        </GoogleSection>
      </Section>
    </Container>
  );
}
