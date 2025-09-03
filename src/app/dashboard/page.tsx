"use client"

import { useState, useEffect, useMemo } from "react"
import { TrendingDownIcon, TrendingUpIcon, TicketIcon } from "lucide-react"
import NumberFlow from '@number-flow/react'
import { useRouter } from "next/navigation"

import { motion, AnimatePresence } from "framer-motion"

import { AppSidebar } from "@/components/app-sidebar"

import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { NewHires } from "@/components/interactive/cards/new-hires"
import { GrowthRateCard } from "@/components/interactive/cards/connect-globe"
import { ActivityRankings } from "@/components/interactive/cards/activity-rankings"
import { OrbitingCircles } from "@/components/magicui/orbiting-circles"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Ticket {
  id: number
  status: string
  created_at: string
  resolved_at: string | null
  resolved_by: number | null
}

interface TicketStats {
  daily: {
    current: number
    previous: number
    change: number
  }
  weekly: {
    current: number
    previous: number
    change: number
  }
  monthly: {
    current: number
    previous: number
    change: number
  }
}

interface EmployeeSummary {
  id: string
  hireDate: string | null
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department: string
  position: string
  hireDate?: string
  status: 'Active' | 'Inactive'
  avatar?: string
  departmentId?: number
  workEmail?: string
  birthday?: string
  city?: string
  address?: string
  gender?: string
}

interface CountStats {
  daily: { current: number; previous: number }
  weekly: { current: number; previous: number }
  monthly: { current: number; previous: number }
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<TicketStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [prevDirection, setPrevDirection] = useState<'positive' | 'negative' | null>(null)
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [newHireStats, setNewHireStats] = useState<CountStats | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const router = useRouter()
  const [isTalentPoolHovered, setIsTalentPoolHovered] = useState(false)

  const handleTalentPoolClick = () => {
    router.push('/talent-pool')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tickets
        const ticketsResponse = await fetch('/api/tickets')
        if (ticketsResponse.ok) {
          const ticketsData = await ticketsResponse.json()
          console.log('Fetched tickets:', ticketsData.length)
          setTickets(ticketsData)
        }

        // Fetch stats if user is available
        if (user?.id) {
          console.log('Fetching stats for user:', user.id)
          const statsResponse = await fetch(`/api/tickets/stats?userId=${user.id}`)
          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            console.log('Fetched stats:', statsData)
            setStats(statsData)
          } else {
            console.error('Stats response not ok:', statsResponse.status)
          }
        }

        // Fetch employees for new hires card
        if (user) {
          const memberId = (user as any).userType === 'Internal' ? 'all' : (user as any).memberId
          if (memberId) {
            const employeesRes = await fetch(`/api/team/employees?memberId=${memberId}`)
            if (employeesRes.ok) {
              const employeesJson = await employeesRes.json()
              setEmployees(employeesJson.employees || [])
            }

            // Fetch leaderboard data for activity rankings (only top 3)
            const now = new Date()
            const currentMonth = now.getMonth() + 1
            const currentYear = now.getFullYear()
            const monthYear = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
            const leaderboardRes = await fetch(`/api/productivity-scores?memberId=${memberId}&monthYear=${monthYear}&limit=3`)
            if (leaderboardRes.ok) {
              const leaderboardJson = await leaderboardRes.json()
              setLeaderboardData(leaderboardJson.productivityScores || [])
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  // Calculate active tickets (all tickets except closed ones and For Approval)
  const activeTickets = tickets.filter(ticket => ticket.status !== 'Closed' && ticket.status !== 'For Approval')
  const activeTicketsCount = activeTickets.length
  
  // Calculate all closed tickets
  const allClosedTickets = tickets.filter(ticket => ticket.status === 'Closed')
  const allClosedTicketsCount = allClosedTickets.length

  console.log('Ticket counts:', {
    totalTickets: tickets.length,
    allClosedTickets: allClosedTicketsCount,
    activeTickets: activeTicketsCount,
    userId: user?.id
  })
  
  // Get the current closed tickets value based on viewMode
  const getCurrentClosedTicketsValue = () => {
    if (stats) {
      switch (viewMode) {
        case 'daily':
          return stats.daily.current
        case 'weekly':
          return stats.weekly.current
        case 'monthly':
          return stats.monthly.current
        default:
          return stats.daily.current
      }
    }
    // If no stats available, show 0 for all periods
    return 0
  }

  // Memoize the closed tickets value to prevent unnecessary re-renders
  const currentClosedTicketsValue = useMemo(() => getCurrentClosedTicketsValue(), [stats, viewMode, allClosedTicketsCount])



  // Get current direction and check if it changed
  const getCurrentDirection = () => {
    if (!stats) return 'positive'
    switch (viewMode) {
      case 'daily':
        return stats.daily.change >= 0 ? 'positive' : 'negative'
      case 'weekly':
        return stats.weekly.change >= 0 ? 'positive' : 'negative'
      case 'monthly':
        return stats.monthly.change >= 0 ? 'positive' : 'negative'
      default:
        return 'positive'
    }
  }

  const currentDirection = getCurrentDirection()
  const directionChanged = prevDirection !== null && prevDirection !== currentDirection

  // Update previous direction when it changes
  useEffect(() => {
    if (prevDirection !== currentDirection) {
      setPrevDirection(currentDirection)
    }
  }, [currentDirection, prevDirection])
  
  // Calculate tickets by status (excluding For Approval)
  const getTicketsByStatus = (status: string) => {
    return tickets.filter(ticket => ticket.status === status && ticket.status !== 'For Approval').length
  }
  
  const statusCounts = {
    approved: getTicketsByStatus('Approved'),
    inProgress: getTicketsByStatus('In Progress'),
    stuck: getTicketsByStatus('Stuck'),
    actioned: getTicketsByStatus('Actioned'),
    onHold: getTicketsByStatus('On Hold'),
    closed: getTicketsByStatus('Closed')
  }
  
  // Get status colors (same as tickets page)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-blue-700 dark:text-white border-blue-600/20 bg-blue-50 dark:bg-blue-600/20"
      case "In Progress":
        return "text-orange-700 dark:text-white border-orange-600/20 bg-orange-50 dark:bg-orange-600/20"
      case "Stuck":
        return "text-red-700 dark:text-white border-red-600/20 bg-red-50 dark:bg-red-600/20"
      case "Actioned":
        return "text-purple-700 dark:text-white border-purple-600/20 bg-purple-50 dark:bg-purple-600/20"
      case "On Hold":
        return "text-gray-700 dark:text-white border-gray-600/20 bg-gray-50 dark:bg-gray-600/20"
      case "Closed":
        return "text-green-700 dark:text-white border-green-600/20 bg-green-50 dark:bg-green-600/20"
      default:
        return "text-gray-700 dark:text-white border-gray-600/20 bg-gray-50 dark:bg-gray-600/20"
    }
  }

  return (
    <>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Overview of your IT support system and metrics.</p>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                  {/* 1. Salmon (2x2) */}
                  <Card className="@container/card sm:col-span-2 lg:col-span-2 lg:row-span-2 h-full">
                    <CardHeader className="relative">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
                        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="flex flex-wrap gap-1">
                        <div className="h-6 w-16 bg-muted animate-pulse rounded-full"></div>
                        <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
                        <div className="h-6 w-14 bg-muted animate-pulse rounded-full"></div>
                      </div>
                    </CardFooter>
                  </Card>
                  
                  {/* 2. Broccoli (1x1) */}
                  <Card className="@container/card sm:col-span-1 lg:col-span-1 lg:row-span-1 h-full">
                    <CardHeader className="relative">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
                        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm"></CardFooter>
                  </Card>
                  
                  {/* 3. Tamago (1x1) */}
                  <Card className="@container/card sm:col-span-1 lg:col-span-1 lg:row-span-1 h-full">
                    <CardHeader className="relative">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm"></CardFooter>
                  </Card>
                  
                  {/* 4. Pork (1x2) */}
                  <Card className="@container/card sm:col-span-1 lg:col-span-1 lg:row-span-2 h-full">
                    <CardHeader className="relative">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-12 bg-muted animate-pulse rounded mt-2"></div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm"></CardFooter>
                  </Card>

                  {/* 5. Edamame (2x1) */}
                  <Card className="@container/card sm:col-span-2 lg:col-span-2 lg:row-span-1 h-full">
                    <CardHeader className="relative">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-24 bg-muted animate-pulse rounded mt-2"></div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm"></CardFooter>
                  </Card>

                  {/* 6. Tomato (1x1) */}
                  <Card className="@container/card sm:col-span-1 lg:col-span-1 lg:row-span-1 h-full">
                    <CardHeader className="relative">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                    </CardHeader>
                  </Card>

                  {/* 7. Tofu (1x1) */}
                  <Card className="@container/card sm:col-span-1 lg:col-span-1 lg:row-span-1 h-full">
                    <CardHeader className="relative">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                    </CardHeader>
                  </Card>

                  {/* 8. Tempura (2x1) */}
                  <Card className="@container/card sm:col-span-2 lg:col-span-2 lg:row-span-1 h-full">
                    <CardHeader className="relative">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                    </CardHeader>
                  </Card>

                  {/* 9. Gyoza (1x1) */}
                  <Card className="@container/card sm:col-span-1 lg:col-span-1 lg:row-span-1 h-full">
                    <CardHeader className="relative">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                    </CardHeader>
                  </Card>
                </div>
              ) : (
                <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                  {/* 1. Salmon (2x2) - New Hires */}
                  <NewHires employees={employees} className="sm:col-span-2 lg:col-span-2 lg:row-span-2" />

                  {/* 2. Broccoli (1x1) - Closed */}
                  <NewHires employees={employees} className="lg:col-span-1 lg:row-span-1" />

                  {/* 3. Tamago (1x1) - In Progress */}
                  <Card className="lg:col-span-1 lg:row-span-1">
                    <CardHeader>
                      <CardTitle className="text-base">In Progress</CardTitle>
                      <CardDescription>{statusCounts.inProgress} tickets</CardDescription>
                    </CardHeader>
                  </Card>

                  {/* 4. Pork (1x2) - Connect Globe */}
                  <GrowthRateCard className="lg:col-span-1 lg:row-span-2" />

                  {/* 5. Edamame (2x3) - Top 3 Performers */}
                  <ActivityRankings 
                    leaderboardData={leaderboardData} 
                    className="lg:col-span-2 lg:row-span-3"
                  />

                  {/* 6. Tomato (1x2) - Stuck */}
                  <Card className="lg:col-span-1 lg:row-span-2">
                    <CardHeader>
                      <CardTitle className="text-base">Stuck</CardTitle>
                      <CardDescription>{statusCounts.stuck} tickets</CardDescription>
                    </CardHeader>
                  </Card>

                  {/* 7. Tofu (1x1) - On Hold */}
                  <Card className="lg:col-span-1 lg:row-span-1">
                    <CardHeader>
                      <CardTitle className="text-base">On Hold</CardTitle>
                      <CardDescription>{statusCounts.onHold} tickets</CardDescription>
                    </CardHeader>
                  </Card>

                  {/* 8. Tempura (1x2) - Talent Pool */}
                  <Card 
                    className="lg:col-span-1 lg:row-span-2 bg-gradient-to-b from-white/60 via-white/20 to-blue-500/30 dark:from-black/70 dark:via-black/30 dark:to-blue-400/40 relative overflow-hidden group cursor-pointer" 
                    onClick={handleTalentPoolClick}
                    onMouseEnter={() => setIsTalentPoolHovered(true)}
                    onMouseLeave={() => setIsTalentPoolHovered(false)}
                  >
                    <CardHeader>
                      <CardTitle>Talent Pool</CardTitle>
                      <CardDescription>Explore and discover skilled candidates available for your team.</CardDescription>
                    </CardHeader>
                    <div className="absolute bottom-0 left-0 right-0 h-[100px]">
                      <div className="relative flex h-full w-full items-center justify-center">
                        {/* Inner ring - 150px */}
                        <div>
                          <div className="absolute inset-0" style={{width: '150px', height: '150px', left: 'calc(50% - 75px)', top: 'calc(50% - 75px)', opacity: 1, transform: 'none'}}>
                            <motion.div 
                              className="size-full rounded-full border border-white/10 bg-gradient-radial from-white/10 via-white/5 to-transparent"
                              animate={isTalentPoolHovered ? {
                                borderColor: "rgba(255, 255, 255, 0.4)",
                                background: "radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)"
                              } : {
                                borderColor: "rgba(255, 255, 255, 0.1)",
                                background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)"
                              }}
                              transition={isTalentPoolHovered ? 
                                { duration: 0.6, delay: 0 } : 
                                { duration: 0.6, delay: 0.4 }
                              }
                            ></motion.div>
                          </div>
                        </div>
                        
                        {/* Center circle */}
                        <div className="absolute flex items-center justify-center" style={{width: '40px', height: '40px', left: 'calc(50% - 20px)', top: 'calc(50% - 20px)'}}>
                          <div className="w-10 h-10 rounded-full bg-primary/80 border-2 border-white/30"></div>
                        </div>
                        
                        {/* Orbiting elements on inner ring */}
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': 30, '--radius': 74, '--angle': 0, '--icon-size': '24px'}}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Anne.jpg" alt="Anne" />
                              <AvatarFallback className="text-xs">A</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': 30, '--radius': 74, '--angle': 120, '--icon-size': '24px'}}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Arelle.jpg" alt="Arelle" />
                              <AvatarFallback className="text-xs">Ar</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': 30, '--radius': 74, '--angle': 240, '--icon-size': '24px'}}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Jineva.jpg" alt="Jineva" />
                              <AvatarFallback className="text-xs">J</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        
                        {/* Middle ring - 210px */}
                        <div>
                          <div className="absolute inset-0" style={{width: '210px', height: '210px', left: 'calc(50% - 105px)', top: 'calc(50% - 105px)', opacity: 1, transform: 'none'}}>
                            <motion.div 
                              className="size-full rounded-full border border-white/15 bg-gradient-radial from-white/15 via-white/8 to-transparent"
                              animate={isTalentPoolHovered ? {
                                borderColor: "rgba(255, 255, 255, 0.45)",
                                background: "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)"
                              } : {
                                borderColor: "rgba(255, 255, 255, 0.15)",
                                background: "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)"
                              }}
                              transition={isTalentPoolHovered ? 
                                { duration: 0.6, delay: 0.2 } : 
                                { duration: 0.6, delay: 0.2 }
                              }
                            ></motion.div>
                          </div>
                        </div>
                        
                        {/* Orbiting elements on middle ring */}
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full" style={{'--duration': 60, '--radius': 104, '--angle': 0, '--icon-size': '24px'}}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Joshua.jpg" alt="Joshua" />
                              <AvatarFallback className="text-xs">Jo</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full" style={{'--duration': 60, '--radius': 104, '--angle': 120, '--icon-size': '24px'}}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Kevin.jpg" alt="Kevin" />
                              <AvatarFallback className="text-xs">K</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full" style={{'--duration': 60, '--radius': 104, '--angle': 240, '--icon-size': '24px'}}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Klein.jpg" alt="Klein" />
                              <AvatarFallback className="text-xs">Kl</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        
                        {/* Outer ring - 270px */}
                        <div>
                          <div className="absolute inset-0" style={{width: '270px', height: '270px', left: 'calc(50% - 135px)', top: 'calc(50% - 135px)', opacity: 1, transform: 'none'}}>
                            <motion.div 
                              className="size-full rounded-full border border-white/20 bg-gradient-radial from-white/20 via-white/10 to-transparent"
                              animate={isTalentPoolHovered ? {
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                background: "radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%)"
                              } : {
                                borderColor: "rgba(255, 255, 255, 0.2)",
                                background: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)"
                              }}
                              transition={isTalentPoolHovered ? 
                                { duration: 0.6, delay: 0.4 } : 
                                { duration: 0.6, delay: 0 }
                              }
                            ></motion.div>
                          </div>
                        </div>
                        
                        {/* Orbiting elements on outer ring */}
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': 60, '--radius': 134, '--angle': 0, '--icon-size': '24px'}}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Lovell.jpg" alt="Lovell" />
                              <AvatarFallback className="text-xs">L</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': 60, '--radius': 134, '--angle': 120, '--icon-size': '24px'}}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Naomi.jpg" alt="Naomi" />
                              <AvatarFallback className="text-xs">N</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': 60, '--radius': 134, '--angle': 240, '--icon-size': '24px'}}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Marc.jpg" alt="Marc" />
                              <AvatarFallback className="text-xs">M</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* 9. Gyoza (1x1) - Approved */}
                  <Card className="lg:col-span-1 lg:row-span-1 h-full">
                    <CardHeader>
                      <CardTitle className="text-base">Approved</CardTitle>
                      <CardDescription>{statusCounts.approved} tickets</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              )}
              {/* Removed Total Visitors section */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
