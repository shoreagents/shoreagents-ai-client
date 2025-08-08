"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  UserIcon, 
  ClockIcon, 
  PlusIcon,
  CoffeeIcon,
  SunIcon,
  MoonIcon,
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon,
  PlayIcon,
  PauseIcon,
  UtensilsIcon
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BreakSession {
  id: number
  agent_user_id: number
  break_type: 'Morning' | 'Lunch' | 'Afternoon'
  start_time: string
  end_time: string | null
  duration_minutes: number | null
  created_at: string
  pause_time: string | null
  resume_time: string | null
  pause_used: boolean
  time_remaining_at_pause: number | null
  break_date: string
  // Joined data
  first_name: string | null
  last_name: string | null
  profile_picture: string | null
  email: string | null
  department_name: string | null
}

export default function BreaksPage() {
  const { user } = useAuth()
  const [breakSessions, setBreakSessions] = useState<BreakSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    today: 0,
    averageDuration: 0
  })
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second for timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch break sessions data
  useEffect(() => {
    const fetchBreakSessions = async () => {
      console.log('🔍 Fetching break sessions for memberId:', user?.memberId)
      console.log('🔍 Full user data:', user)
      
      // Clear any previous errors and set loading
      setError(null)
      setLoading(true)
      
      if (!user?.memberId && user?.userType !== 'Internal') {
        console.log('❌ No member ID found and user is not Internal')
        console.log('❌ User data:', user)
        setError('User member ID not found')
        setLoading(false)
        return
      }

      try {
        console.log('📡 Making API request to /api/breaks')
        const memberId = user.userType === 'Internal' ? 'all' : user.memberId
        const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format
        const response = await fetch(`/api/breaks?memberId=${memberId}&date=${today}`)
        
        console.log('📊 Response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.log('❌ API error:', errorText)
          throw new Error(`Failed to fetch break sessions: ${response.status}`)
        }

        const data = await response.json()
        console.log('✅ Break sessions data received:', data)
        
        setBreakSessions(data.breakSessions)
        setStats({
          total: data.stats.total,
          active: data.stats.active,
          today: data.stats.today,
          averageDuration: data.stats.averageDuration
        })
        setError(null) // Clear any previous errors
      } catch (err) {
        console.error('❌ Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch break sessions')
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if user is available
    if (user) {
      fetchBreakSessions()
    }
  }, [user])

  const getBreakTypeIcon = (breakType: string) => {
    switch (breakType) {
      case 'Morning':
        return <SunIcon className="h-4 w-4 text-orange-500" />
      case 'Lunch':
        return <UtensilsIcon className="h-4 w-4 text-amber-500" />
      case 'Afternoon':
        return <MoonIcon className="h-4 w-4 text-blue-500" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getBreakTypeColor = (breakType: string) => {
    switch (breakType) {
      case 'Morning':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Lunch':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Afternoon':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusBadge = (session: BreakSession) => {
    if (session.end_time) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Used</Badge>
    } else if (session.pause_time && !session.resume_time) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Paused</Badge>
    } else {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Started</Badge>
    }
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeOnly = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getElapsedTime = (session: BreakSession) => {
    const start = new Date(session.start_time || new Date())
    const now = currentTime
    let endReference = session.end_time ? new Date(session.end_time) : now

    // Calculate paused duration (single pause supported by schema)
    let pausedMs = 0
    if (session.pause_time) {
      const pauseStart = new Date(session.pause_time)
      if (session.resume_time) {
        const pauseEnd = new Date(session.resume_time)
        pausedMs += Math.max(0, pauseEnd.getTime() - pauseStart.getTime())
      } else {
        // Currently paused: freeze elapsed by subtracting ongoing pause window
        pausedMs += Math.max(0, now.getTime() - pauseStart.getTime())
      }
    }

    const elapsedMs = Math.max(0, endReference.getTime() - start.getTime() - pausedMs)
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60))
    const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000)

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  const getPausedForText = (session: BreakSession) => {
    if (session.pause_time && !session.resume_time && !session.end_time) {
      const pausedMs = Math.max(0, currentTime.getTime() - new Date(session.pause_time).getTime())
      const minutes = Math.floor(pausedMs / (1000 * 60))
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return hours > 0 ? `Paused for ${hours}h ${mins}m` : `Paused for ${mins}m`
    }
    return null
  }

  const getBreakStatusText = (activeCount: number, totalCount: number) => {
    if (totalCount === 0) return "No one is currently on break."
    
    const percentage = (activeCount / totalCount) * 100
    
    if (percentage === 0) return "No one is currently on break."
    if (percentage > 0 && percentage < 20) return "A few team members are currently on break."
    if (percentage >= 20 && percentage < 40) return "Several team members are currently on break."
    if (percentage >= 40 && percentage < 70) return "Half the team is currently taking this break."
    if (percentage >= 70 && percentage < 100) return "Most of the team is currently on break."
    if (percentage === 100) return "Everyone is currently on break."
    
    return "No one is currently on break."
  }



  if (loading) {
    return (
      <>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <div className="mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">Breaks</h1>
                      <p className="text-sm text-muted-foreground">
                        Monitor real-time break activity and track employee break sessions across morning, lunch, and afternoon periods.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Loading skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 lg:px-6">
                  {/* Morning Break Skeleton */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <div>
                        <CardDescription>Morning Break</CardDescription>
                        <div className="text-2xl font-semibold tabular-nums flex items-center gap-2 mt-2">
                          <UserIcon className="h-5 w-5" />
                          <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                        </div>
                      </div>
                      <SunIcon className="h-6 w-6 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="border-t border-border pt-3">
                          <div className="space-y-2">
                            <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 text-xs text-muted-foreground font-medium">
                              <span>Name</span>
                              <span>Started Time</span>
                              <span>Elapsed Time</span>
                            </div>
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse"></div>
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                </div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lunch Break Skeleton */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <div>
                        <CardDescription>Lunch Break</CardDescription>
                        <div className="text-2xl font-semibold tabular-nums flex items-center gap-2 mt-2">
                          <UserIcon className="h-5 w-5" />
                          <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                        </div>
                      </div>
                      <UtensilsIcon className="h-6 w-6 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="border-t border-border pt-3">
                          <div className="space-y-2">
                            <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 text-xs text-muted-foreground font-medium">
                              <span>Name</span>
                              <span>Started Time</span>
                              <span>Elapsed Time</span>
                            </div>
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse"></div>
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                </div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Afternoon Break Skeleton */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <div>
                        <CardDescription>Afternoon Break</CardDescription>
                        <div className="text-2xl font-semibold tabular-nums flex items-center gap-2 mt-2">
                          <UserIcon className="h-5 w-5" />
                          <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                        </div>
                      </div>
                      <ClockIcon className="h-6 w-6 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="border-t border-border pt-3">
                          <div className="space-y-2">
                            <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 text-xs text-muted-foreground font-medium">
                              <span>Name</span>
                              <span>Started Time</span>
                              <span>Elapsed Time</span>
                            </div>
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse"></div>
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                </div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                                         </CardContent>
                   </Card>
                 </div>
               </div>

               {/* Break Sessions Table Skeleton */}
               <div className="px-4 lg:px-6">
                 <Card>
                   <CardHeader>
                     <CardTitle>Break Sessions</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-4">
                       {/* Table Header Skeleton */}
                       <div className="grid grid-cols-4 gap-4 pb-2 border-b text-xs text-muted-foreground font-medium">
                         <span>Employee</span>
                         <span className="text-center">Morning Break</span>
                         <span className="text-center">Lunch Break</span>
                         <span className="text-center">Afternoon Break</span>
                       </div>
                       {/* Table Rows Skeleton */}
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className="grid grid-cols-4 gap-4 items-center py-2">
                           <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                             <div className="space-y-1">
                               <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                               <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                             </div>
                           </div>
                           <div className="h-6 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
                           <div className="h-6 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
                           <div className="h-6 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
                         </div>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </div>
           </div>
         </SidebarInset>
       </>
     )
   }

   if (error) {
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
                      <h1 className="text-2xl font-bold">Break Sessions</h1>
                      <p className="text-sm text-muted-foreground">
                        Monitor and manage employee break times
                      </p>
                    </div>
                    <Button>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Start Break
                    </Button>
                  </div>
                </div>
                
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardContent className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <p className="text-lg font-medium text-destructive">Error</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </>
    )
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
                <div className="mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">Breaks</h1>
                    <p className="text-sm text-muted-foreground">
                      Monitor real-time break activity and track employee break sessions across morning, lunch, and afternoon periods.
                    </p>
                  </div>
                </div>
              </div>



              {/* Break Type Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 lg:px-6">
                                 <Card>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                     <div>
                       <CardDescription>Morning Break</CardDescription>
                       <div className="text-2xl font-semibold tabular-nums flex items-center gap-2 mt-2">
                         <UserIcon className="h-5 w-5" />
                         {breakSessions.filter(session => session.break_type === 'Morning' && !session.end_time).length}
                       </div>
                     </div>
                     <SunIcon className="h-6 w-6 text-yellow-600" />
                   </CardHeader>
                   <CardContent>
                                                              <CardTitle className="text-sm font-medium">
                       {getBreakStatusText(
                         breakSessions.filter(session => session.break_type === 'Morning' && !session.end_time).length,
                         breakSessions.filter(session => session.break_type === 'Morning').length
                       )}
                     </CardTitle>
                                         <div className="border-t border-border mt-3 pt-3">
                       <div className="space-y-2">
                         <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 text-xs text-muted-foreground font-medium">
                           <span>Name</span>
                           <span>Started Time</span>
                           <span>Elapsed Time</span>
                         </div>
                         <div className="max-h-48 overflow-y-auto space-y-2">
                           {breakSessions
                             .filter(session => session.break_type === 'Morning' && !session.end_time)
                             .map((session, index) => (
                               <div key={session.id} className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center">
                                 <div className="flex items-center gap-2">
                                   <Avatar className="h-6 w-6">
                                     <AvatarImage src={session.profile_picture || undefined} alt={`${session.first_name} ${session.last_name}`} />
                                     <AvatarFallback className="text-xs">
                                       {session.first_name?.[0]}{session.last_name?.[0]}
                                     </AvatarFallback>
                                   </Avatar>
                                   <span className="text-sm font-medium">
                                     {session.first_name} {session.last_name}
                                   </span>
                                 </div>
                                 {!session.end_time && (
                                   <>
                                     <span className="text-xs text-muted-foreground">
                                       {formatTimeOnly(session.start_time)}
                                     </span>
                                      <div className="flex flex-col items-end">
                                        <span className="text-xs font-mono text-primary">
                                          {getElapsedTime(session)}
                                        </span>
                                        {getPausedForText(session) && (
                                          <span className="text-[10px] text-muted-foreground">{getPausedForText(session)}</span>
                                        )}
                                      </div>
                                   </>
                                 )}
                               </div>
                             ))}
                           {breakSessions.filter(session => session.break_type === 'Morning' && !session.end_time).length === 0 && (
                             <p className="text-xs text-muted-foreground">No morning break sessions</p>
                           )}
                         </div>
                       </div>
                     </div>
                  </CardContent>
                </Card>

                                 <Card>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                     <div>
                       <CardDescription>Lunch Break</CardDescription>
                       <div className="text-2xl font-semibold tabular-nums flex items-center gap-2 mt-2">
                         <UserIcon className="h-5 w-5" />
                         {breakSessions.filter(session => session.break_type === 'Lunch' && !session.end_time).length}
                       </div>
                     </div>
                     <UtensilsIcon className="h-6 w-6 text-amber-600" />
                   </CardHeader>
                   <CardContent>
                                                              <CardTitle className="text-sm font-medium">
                       {getBreakStatusText(
                         breakSessions.filter(session => session.break_type === 'Lunch' && !session.end_time).length,
                         breakSessions.filter(session => session.break_type === 'Lunch').length
                       )}
                     </CardTitle>
                                         <div className="border-t border-border mt-3 pt-3">
                       <div className="space-y-2">
                         <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 text-xs text-muted-foreground font-medium">
                           <span>Name</span>
                           <span>Started Time</span>
                           <span>Elapsed Time</span>
                         </div>
                         <div className="max-h-48 overflow-y-auto space-y-2">
                           {breakSessions
                             .filter(session => session.break_type === 'Lunch' && !session.end_time)
                             .map((session, index) => (
                               <div key={session.id} className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center">
                                 <div className="flex items-center gap-2">
                                   <Avatar className="h-6 w-6">
                                     <AvatarImage src={session.profile_picture || undefined} alt={`${session.first_name} ${session.last_name}`} />
                                     <AvatarFallback className="text-xs">
                                       {session.first_name?.[0]}{session.last_name?.[0]}
                                     </AvatarFallback>
                                   </Avatar>
                                   <span className="text-sm font-medium">
                                     {session.first_name} {session.last_name}
                                   </span>
                                 </div>
                                 {!session.end_time && (
                                   <>
                                     <span className="text-xs text-muted-foreground">
                                       {formatTimeOnly(session.start_time)}
                                     </span>
                                      <div className="flex flex-col items-end">
                                        <span className="text-xs font-mono text-primary">
                                          {getElapsedTime(session)}
                                        </span>
                                        {getPausedForText(session) && (
                                          <span className="text-[10px] text-muted-foreground">{getPausedForText(session)}</span>
                                        )}
                                      </div>
                                   </>
                                 )}
                               </div>
                             ))}
                           {breakSessions.filter(session => session.break_type === 'Lunch' && !session.end_time).length === 0 && (
                             <p className="text-xs text-muted-foreground">No lunch break sessions</p>
                           )}
                         </div>
                       </div>
                     </div>
                  </CardContent>
                </Card>

                                 <Card>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                     <div>
                       <CardDescription>Afternoon Break</CardDescription>
                       <div className="text-2xl font-semibold tabular-nums flex items-center gap-2 mt-2">
                         <UserIcon className="h-5 w-5" />
                         {breakSessions.filter(session => session.break_type === 'Afternoon' && !session.end_time).length}
                       </div>
                     </div>
                     <ClockIcon className="h-6 w-6 text-blue-600" />
                   </CardHeader>
                  <CardContent>
                                                              <CardTitle className="text-sm font-medium">
                       {getBreakStatusText(
                         breakSessions.filter(session => session.break_type === 'Afternoon' && !session.end_time).length,
                         breakSessions.filter(session => session.break_type === 'Afternoon').length
                       )}
                     </CardTitle>
                                         <div className="border-t border-border mt-3 pt-3">
                       <div className="space-y-2">
                         <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 text-xs text-muted-foreground font-medium">
                           <span>Name</span>
                           <span>Started Time</span>
                           <span>Elapsed Time</span>
                         </div>
                         <div className="max-h-48 overflow-y-auto space-y-2">
                           {breakSessions
                             .filter(session => session.break_type === 'Afternoon' && !session.end_time)
                             .map((session, index) => (
                               <div key={session.id} className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center">
                                 <div className="flex items-center gap-2">
                                   <Avatar className="h-6 w-6">
                                     <AvatarImage src={session.profile_picture || undefined} alt={`${session.first_name} ${session.last_name}`} />
                                     <AvatarFallback className="text-xs">
                                       {session.first_name?.[0]}{session.last_name?.[0]}
                                     </AvatarFallback>
                                   </Avatar>
                                   <span className="text-sm font-medium">
                                     {session.first_name} {session.last_name}
                                   </span>
                                 </div>
                                 {!session.end_time && (
                                   <>
                                     <span className="text-xs text-muted-foreground">
                                       {formatTimeOnly(session.start_time)}
                                     </span>
                                      <div className="flex flex-col items-end">
                                        <span className="text-xs font-mono text-primary">
                                          {getElapsedTime(session)}
                                        </span>
                                        {getPausedForText(session) && (
                                          <span className="text-[10px] text-muted-foreground">{getPausedForText(session)}</span>
                                        )}
                                      </div>
                                   </>
                                 )}
                               </div>
                             ))}
                           {breakSessions.filter(session => session.break_type === 'Afternoon' && !session.end_time).length === 0 && (
                             <p className="text-xs text-muted-foreground">No afternoon break sessions</p>
                           )}
                         </div>
                       </div>
                     </div>
                  </CardContent>
                </Card>
              </div>

              {/* Break Sessions Table */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Break Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                            <TableHead className="text-center">Morning Break</TableHead>
                            <TableHead className="text-center">Lunch Break</TableHead>
                            <TableHead className="text-center">Afternoon Break</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {breakSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                   <AvatarImage src={session.profile_picture || undefined} alt={`${session.first_name} ${session.last_name}`} />
                                  <AvatarFallback>
                                    {session.first_name?.[0]}{session.last_name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{session.first_name} {session.last_name}</div>
                                  <div className="text-sm text-muted-foreground">{session.email}</div>
                                </div>
                              </div>
                            </TableCell>
                             
                             <TableCell className="text-center">
                               {(() => {
                                 const morningSession = breakSessions.find(s => s.agent_user_id === session.agent_user_id && s.break_type === 'Morning');
                                 if (!morningSession) return <span className="text-muted-foreground text-sm">-</span>;
                                 return (
                                   <TooltipProvider>
                                     <Tooltip delayDuration={300}>
                                       <TooltipTrigger>
                                         {getStatusBadge(morningSession)}
                                       </TooltipTrigger>
                                        <TooltipContent>
                                          {morningSession.end_time ? (
                                            <>
                                              <p>{formatTimeOnly(morningSession.start_time)} - {formatTimeOnly(morningSession.end_time)}</p>
                                            </>
                                          ) : morningSession.pause_time && !morningSession.resume_time ? (
                                            <p>Paused since {formatTimeOnly(morningSession.pause_time)}</p>
                                          ) : (
                                            <p>{formatTimeOnly(morningSession.start_time)}</p>
                                          )}
                                        </TooltipContent>
                                     </Tooltip>
                                   </TooltipProvider>
                                 );
                               })()}
                            </TableCell>
                             
                             <TableCell className="text-center">
                               {(() => {
                                 const lunchSession = breakSessions.find(s => s.agent_user_id === session.agent_user_id && s.break_type === 'Lunch');
                                 if (!lunchSession) return <span className="text-muted-foreground text-sm">-</span>;
                                 return (
                                   <TooltipProvider>
                                     <Tooltip delayDuration={300}>
                                       <TooltipTrigger>
                                         {getStatusBadge(lunchSession)}
                                       </TooltipTrigger>
                                        <TooltipContent>
                                          {lunchSession.end_time ? (
                                            <>
                                              <p>{formatTimeOnly(lunchSession.start_time)} - {formatTimeOnly(lunchSession.end_time)}</p>
                                            </>
                                          ) : lunchSession.pause_time && !lunchSession.resume_time ? (
                                            <p>Paused since {formatTimeOnly(lunchSession.pause_time)}</p>
                                          ) : (
                                            <p>{formatTimeOnly(lunchSession.start_time)}</p>
                                          )}
                                        </TooltipContent>
                                     </Tooltip>
                                   </TooltipProvider>
                                 );
                               })()}
                            </TableCell>
                             
                            <TableCell className="text-center">
                               {(() => {
                                 const afternoonSession = breakSessions.find(s => s.agent_user_id === session.agent_user_id && s.break_type === 'Afternoon');
                                 if (!afternoonSession) return <span className="text-muted-foreground text-sm">-</span>;
                                 return (
                                   <TooltipProvider>
                                     <Tooltip delayDuration={300}>
                                       <TooltipTrigger>
                                         {getStatusBadge(afternoonSession)}
                                       </TooltipTrigger>
                                        <TooltipContent>
                                          {afternoonSession.end_time ? (
                                            <>
                                              <p>{formatTimeOnly(afternoonSession.start_time)} - {formatTimeOnly(afternoonSession.end_time)}</p>
                                            </>
                                          ) : afternoonSession.pause_time && !afternoonSession.resume_time ? (
                                            <p>Paused since {formatTimeOnly(afternoonSession.pause_time)}</p>
                                          ) : (
                                            <p>{formatTimeOnly(afternoonSession.start_time)}</p>
                                          )}
                                        </TooltipContent>
                                     </Tooltip>
                                   </TooltipProvider>
                                 );
                               })()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
