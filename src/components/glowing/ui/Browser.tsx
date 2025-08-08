import styled, { css } from "styled-components"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import createSVGMask from "../utils/createSVGMask"


const Wrapper = styled.div<{m?: string}>`
  position: relative;
  ${p => p.m && `margin: ${p.m};`}
  &:before { 
    content: "";
    width: 665px;
    height: 470px;
    background: url(/grid.svg);
    background-size: cover;
    position: absolute;
    top: calc(50% - 235px);
    left: calc(50% - 332px);
  }
`

const BrowserPanel = styled.div`
  width: 400px;
  min-height: 200px;
  background: radial-gradient(63.94% 63.94% at 50% 0%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;



  &:after {
    content: "";
    background-image: url("data:image/svg+xml,%3Csvg width='52' height='12' viewBox='0 0 52 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='6' fill='%23020308' fill-opacity='0.12'/%3E%3Ccircle cx='6' cy='6' r='5.5' stroke='white' stroke-opacity='0.1'/%3E%3Ccircle cx='26' cy='6' r='6' fill='%23020308' fill-opacity='0.12'/%3E%3Ccircle cx='26' cy='6' r='5.5' stroke='white' stroke-opacity='0.1'/%3E%3Ccircle cx='46' cy='6' r='6' fill='%23020308' fill-opacity='0.12'/%3E%3Ccircle cx='46' cy='6' r='5.5' stroke='white' stroke-opacity='0.1'/%3E%3C/svg%3E%0A");
    position: absolute;
    top: 12px;
    left: 12px;
    width: 52px;
    height: 12px;
  }
`

const NavigatorLeftBG = styled.div<{width?: number}>`
  background: rgba(0, 0, 0, 0.16);
  border-bottom-right-radius: 6px;
  min-width: 84px;
  width: ${p => p.width}px;
  height: 36px;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;

  transition: 300ms all;

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    border-top-left-radius: 6px;
    border-bottom-right-radius: 6px;
    padding: 1px;
    transition: 300ms all;
    background: radial-gradient(100% 148.61% at 90% 148.61%, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 100%); 
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude; 
  }
`

const NavigatorRightBG = styled(NavigatorLeftBG)`
  height: 36px;
  border-bottom-right-radius: 0;
  min-width: 56px;
  left: unset;
  right: 0;

  &:before {
    border-top-left-radius: 0;
    border-bottom-left-radius: 6px;
    background: radial-gradient(100% 148.61% at 0% 148.61%, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 100%); 
  }
`

const Navigation = styled.div`
  display: flex;
  align-items: center;
`

const Tabs = styled.div`
  display: flex;
  align-items: center;
  margin-left: 84px;
  height: 36px;
  
`

const Item = styled.div<{active?: boolean}>`
  min-width: 80px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  text-align: center;

  background: ${ p => p.active ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 8.85%, #FFFFFF 100%);' : 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 8.85%, rgba(255, 255, 255, 0.5) 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  cursor: pointer;
  position: relative;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;

  &:before {
    content: '';
    width: 100%;
    height: 30px;
    position: absolute;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    top: -7px;
    left: 0;
    overflow: hidden;
    /* background: radial-gradient(39% 100% at 38% 0%,rgba(255,255,255,0.32) 0%,rgba(255,255,255,0) 100%), radial-gradient(100% 100% at 30.75% 0%,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0) 100%); */
    background: radial-gradient(39% 100% at 48% -20%,rgba(255,255,255,0.32) 0%,rgba(255,255,255,0) 100%),radial-gradient(100% 100% at 30.75% 0%,rgba(255,255,255,0.12) 60%,rgba(255,255,255,0) 100%);
    transition: 300ms all;
    opacity: ${p => p.active ? .5 : 0};
    transition-delay: ${p => p.active ? '220ms' : '0'};
  }
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 165px;
  padding: 30px 0px 20px 0px;
`

interface Props { 
  children: React.ReactNode
  m?: string
  onActiveTabChange: (val: number) => void
}

export default function Browser(props: Props) {
  const TabsRef = useRef<HTMLDivElement | null>(null)
  
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const refs = useRef<HTMLDivElement[]>([]);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (refs.current.length > 0) {
      const activeRef = refs.current[activeTab - 1];
      setLeft(activeRef.offsetLeft);
      // @ts-ignore
      setRight(activeRef.parentNode.parentNode.offsetWidth - (activeRef.offsetLeft + activeRef.offsetWidth));

      props.onActiveTabChange(activeTab)
    }
  }, [activeTab]);


  return (
    <Wrapper m={props.m}>
      <BrowserPanel>
        <Navigation>
          <NavigatorLeftBG width={left} />
          <Tabs ref={TabsRef}>
            <Item ref={el => { if (el) refs.current.push(el) }} active={activeTab === 1} onClick={() => setActiveTab(1)}>Login</Item>
          </Tabs>
          <NavigatorRightBG width={right} />
        </Navigation>
        <Content>
          {props.children}
        </Content>
      </BrowserPanel>
    </Wrapper>
  )
}