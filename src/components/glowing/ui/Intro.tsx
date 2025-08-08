import styled from "styled-components"
import { Badge } from "@/components/ui/badge"

const H1 = styled.h1`
  font-family: "Inter";
  font-weight: 400;
  font-size: 56px;
  line-height: 64px;
  /* identical to box height, or 120% */

  text-align: center;

  background: radial-gradient(123.44% 123.44% at 56.63% 100%, #ECECEE 6.77%, rgba(255, 255, 255, 0.45) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

`

const P = styled.p`
  font-family: 'Inter V', 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 40px;
  /* identical to box height, or 160% */

  text-align: center;
  letter-spacing: -0.01em;

  background: radial-gradient(123.44% 123.44% at 56.63% 100%, rgba(236, 236, 238, 0.5) 6.77%, rgba(255, 255, 255, 0.225) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  max-width: 800px;
`

export default function Intro() {
  return (
    <Wrapper>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <H1>ShoreAgents</H1>
        <Badge className="text-4xl w-16 h-16 bg-teal-100 text-teal-800 border-teal-200 shadow-none font-bold flex items-center justify-center rounded-lg p-0 leading-none">
          AI
        </Badge>
      </div>
      <P>An all-in-one intelligent management platform powered by AI for streamlined and efficient business operations.</P>
    </Wrapper>
  )
}