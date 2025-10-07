"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { IconMail, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { NormalButton, LoaderButton } from "@/components/glowing"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"
import Stars from "@/components/glowing/ui/Stars"
import Intro from "@/components/glowing/ui/Intro"
import Browser from "@/components/glowing/ui/Browser"

const BACKGROUNDS = [
  "#0B020D",
  "#010609", 
  "#020308",
  "#090401",
  "#010902"
]

const Container = styled.div<{bg: string}>`
  width: 100vw;
  height: 100vh;
  background: radial-gradient(63.94% 63.94% at 50% 0%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), ${p => p.bg};
  transition: 1s all;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Content = styled.div`
  display: flex;
  gap: 32px;
`

const CustomInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  color: white;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.2s ease-in-out;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
  }
`

const variants = {
  hidden: { opacity: 0, y: 15 },
  open: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: .5,
      staggerChildren: 0.1
    } 
  },
  out: {
    opacity: 0,
    y: 15,
    transition: {
      duration: .2,
      staggerChildren: 0.1,
      when: "afterChildren"
    },
  }
}

enum ActiveTab {
  'Login' = 1,
  'Admin' = 2,
  'Finance' = 3
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState(ActiveTab.Login)
  const [bg, setBg] = React.useState(0)
  const [isLoaded, setIsLoaded] = React.useState(false)

  const router = useRouter()
  const { login, user } = useAuth()

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])



  // Set loaded after a short delay to ensure components are ready
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      toast.success("Successfully signed in")
      router.push('/dashboard')
    } else {
      const errorMessage = result.error || 'Login failed'
      toast.error(errorMessage)
    }
    
    setIsLoading(false)
  }

  return (
    <Container bg={BACKGROUNDS[bg]}>
      <Stars />
      {isLoaded && <Intro />}
      
      {isLoaded && <Browser m="60px 0 0 0" onActiveTabChange={(activeIndex) => {
        setActiveTab(activeIndex)
        setBg(activeIndex - 1) // Change background based on tab index (0-based)
      }}>
        <AnimatePresence mode="wait">
          {activeTab === 1 && 
            <Content 
              as={motion.div}
              key={ActiveTab.Login}
              variants={variants}
              initial="hidden"
              animate="open"
              exit="out"
            >
              <div className="w-80 text-center">
                <form onSubmit={handleSubmit} className="space-y-4" name="login-form">
                                      <div className="space-y-2">
                      <Label htmlFor="email" className="text-white text-left block font-sans">Email</Label>
                      <div className="relative">
                        <IconMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                        <CustomInput
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                          autoComplete="username"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white text-left block font-sans">Password</Label>
                      <div className="relative">
                        <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                        <CustomInput
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <IconEyeOff className="h-4 w-4" />
                          ) : (
                            <IconEye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                  <div className="flex items-center justify-end">
                    <span
                      className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </span>
                  </div>
                </form>
                
                <div className="w-full flex justify-center mt-6">
                  <NormalButton type="submit" onClick={handleSubmit}>
                    Sign In
                  </NormalButton>
                </div>
              </div>
            </Content>
          }

          {activeTab === 2 && 
            <Content 
              as={motion.div}
              key="admin"
              variants={variants}
              initial="hidden"
              animate="open"
              exit="out"
            >
              <div className="w-80 text-center">
                <div className="text-white text-2xl font-semibold mb-4">
                  Admin Portal
                </div>
                <div className="text-white/70 text-lg">
                  Coming Soon...
                </div>
              </div>
            </Content>
          }

          {activeTab === 3 && 
            <Content 
              as={motion.div}
              key="finance"
              variants={variants}
              initial="hidden"
              animate="open"
              exit="out"
            >
              <div className="w-80 text-center">
                <div className="text-white text-2xl font-semibold mb-4">
                  Finance Portal
                </div>
                <div className="text-white/70 text-lg">
                  Coming Soon...
                </div>
              </div>
            </Content>
          }


        </AnimatePresence>
      </Browser>}
    </Container>
  )
} 