"use client"

import { useState, useEffect, useMemo } from "react"
import { TrendingDownIcon, TrendingUpIcon, TicketIcon } from "lucide-react"
import NumberFlow from '@number-flow/react'

import { motion, AnimatePresence } from "framer-motion"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { NewHires } from "@/components/interactive/cards/new-hires"
import { GrowthRateCard } from "@/components/interactive/cards/connect-globe"
import { ActivityRankings } from "@/components/interactive/cards/activity-rankings"
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
  expPoints?: number
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

            // Fetch leaderboard data for activity rankings
            const now = new Date()
            const currentMonth = now.getMonth() + 1
            const currentYear = now.getFullYear()
            const monthYear = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
            const leaderboardRes = await fetch(`/api/productivity-scores?memberId=${memberId}&monthYear=${monthYear}`)
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
                <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                  {/* Active Tickets Skeleton */}
                  <Card className="@container/card">
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
                  
                  {/* Closed Tickets Skeleton */}
                  <Card className="@container/card">
                    <CardHeader className="relative">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
                        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      </div>
                      <div className="absolute right-4 top-4">
                        <div className="h-6 w-20 bg-muted animate-pulse rounded-lg"></div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-48 bg-muted animate-pulse rounded"></div>
                      <div className="mt-2">
                        <div className="flex gap-1">
                          <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
                          <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                          <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                  
                  {/* Placeholder Skeleton for Activity Rankings */}
                  <Card className="@container/card">
                    <CardHeader className="relative">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-24 bg-muted animate-pulse rounded mt-2"></div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                      <div className="h-4 w-40 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                    </CardFooter>
                  </Card>
                  
                  {/* Connect Globe Skeleton */}
                  <Card className="@container/card">
                    <CardHeader className="relative">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-12 bg-muted animate-pulse rounded mt-2"></div>
                      <div className="absolute right-4 top-4">
                        <div className="h-6 w-16 bg-muted animate-pulse rounded-lg"></div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                      <div className="h-4 w-36 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-40 bg-muted animate-pulse rounded"></div>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                  <NewHires employees={employees} />
                  <ActivityRankings 
                    leaderboardData={leaderboardData} 
                    maxRows={5}
                    title="Activity Rankings"
                    description="Top 5 performers for this month based on activity points."
                  />
                  <GrowthRateCard />
                </div>
              )}
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
