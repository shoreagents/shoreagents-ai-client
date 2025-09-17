"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  ActivityIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ActivityDataCard } from "@/components/activity-data-card"
import { useRealtimeActivities, ActivityEntry as RealtimeActivityEntry } from "@/hooks/use-realtime-activities"

interface ActivityEntry {
  id: number
  user_id: number
  today_date: string
  today_active_seconds: number
  today_inactive_seconds: number
  is_currently_active: boolean
  last_session_start: string | null
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  email: string
  profile_picture: string | null
  department_name: string | null
  is_on_break: boolean
  current_break_type: string | null
  break_start_time: string | null
  pause_time: string | null
  resume_time: string | null
  is_in_meeting: boolean
  meeting_title: string | null
  meeting_type: string | null
  meeting_start_time: string | null
  is_in_event: boolean
  event_title: string | null
  event_location: string | null
  event_start_time: string | null
  event_end_time: string | null
  is_going: boolean | null
  is_back: boolean | null
  going_at: string | null
  back_at: string | null
  is_in_restroom: boolean
  restroom_count: number
  daily_restroom_count: number
  restroom_went_at: string | null
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
  avatar?: string
  departmentId?: number
  workEmail?: string
  birthday?: string
  city?: string
  address?: string
  gender?: string
  shift?: string
}

interface ActivityStats {
  total_users: number
  total_days: number
  total_active_seconds: number
  total_inactive_seconds: number
  avg_active_seconds: number
  avg_inactive_seconds: number
  max_active_seconds: number
  min_active_seconds: number
}

export default function ActivitiesPage() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [yesterdayActivities, setYesterdayActivities] = useState<ActivityEntry[]>([])
  const [weekActivities, setWeekActivities] = useState<ActivityEntry[]>([])
  const [monthActivities, setMonthActivities] = useState<ActivityEntry[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  
  // Realtime functionality
  const { isConnected: isRealtimeConnected, error: realtimeError } = useRealtimeActivities({
    onActivityCreated: (newActivity: ActivityEntry) => {
      console.log('🆕 New activity created:', newActivity)
      // Add new activity to the list if it's for today
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
      if (newActivity.today_date === today) {
        setActivities(prev => {
          // Check if activity already exists (avoid duplicates)
          const exists = prev.some(activity => activity.id === newActivity.id)
          if (exists) return prev
          
          // Add new activity
          return [...prev, newActivity]
        })
      }
    },
    onActivityUpdated: (updatedActivity: ActivityEntry, oldActivity?: ActivityEntry) => {
      console.log('📝 Activity updated:', updatedActivity, 'Old:', oldActivity)
      // Update existing activity in the list
      setActivities(prev => 
        prev.map(activity => 
          activity.id === updatedActivity.id ? updatedActivity : activity
        )
      )
    },
    onActivityDeleted: (deletedActivity: ActivityEntry) => {
      console.log('🗑️ Activity deleted:', deletedActivity)
      // Remove activity from the list
      setActivities(prev => 
        prev.filter(activity => activity.id !== deletedActivity.id)
      )
    }
  })
  
  // Sorting
  const [sortField, setSortField] = useState<'name' | 'status' | 'activeTime' | 'inactiveTime'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Update current time every second for timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user?.memberId && user?.userType !== 'Internal') {
        return
      }

      try {
        const memberId = user.userType === 'Internal' ? 'all' : user.memberId
        const response = await fetch(`/api/team/employees?memberId=${memberId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.status}`)
        }

        const data = await response.json()
        setEmployees(data.employees)
      } catch (err) {
        console.error('❌ Employees fetch error:', err)
        // Don't set error state for employees fetch failure, just log it
      }
    }

    if (user) {
      fetchEmployees()
    }
  }, [user])

  // Fetch activities data
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return
      
      setLoading(true)
      setError(null)
      
      try {
        const memberId = user.userType === 'Internal' ? 'all' : user.memberId
        
        const response = await fetch(`/api/activities?memberId=${memberId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch activities: ${response.status}`)
        }
        
        const data = await response.json()
        setActivities(data.activities)
        setStats(data.stats)
      } catch (err) {
        console.error('❌ Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch activities')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [user])

  // Fetch detailed activity data when employee is selected (yesterday, week, month only)
  useEffect(() => {
    const fetchDetailedActivities = async () => {
      if (!selectedEmployee || !user) return
      
      setDetailLoading(true)
      
      try {
        const memberId = user.userType === 'Internal' ? 'all' : user.memberId
        
        // Get date ranges
        const today = new Date()
        
        // Yesterday's date
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        const yesterdayStr = yesterday.toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
        
        // Week range (Sunday to Saturday)
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay()) // Start from Sunday
        const endOfWeek = new Date(today)
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())) // End on Saturday
        
        const startDate = startOfWeek.toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
        const endDate = endOfWeek.toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
        
        // Month range
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        
        const monthStartDate = startOfMonth.toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
        const monthEndDate = endOfMonth.toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
        
        // Fetch only yesterday, week, and month data (today is already available)
        const [yesterdayResponse, weekResponse, monthResponse] = await Promise.all([
          fetch(`/api/activities?memberId=${memberId}&date=${yesterdayStr}`),
          fetch(`/api/activities?memberId=${memberId}&startDate=${startDate}&endDate=${endDate}`),
          fetch(`/api/activities?memberId=${memberId}&startDate=${monthStartDate}&endDate=${monthEndDate}`)
        ])
        
        // Process responses
        const [yesterdayData, weekData, monthData] = await Promise.all([
          yesterdayResponse.ok ? yesterdayResponse.json() : { activities: [] },
          weekResponse.ok ? weekResponse.json() : { activities: [] },
          monthResponse.ok ? monthResponse.json() : { activities: [] }
        ])
        
        setYesterdayActivities(yesterdayData.activities || [])
        setWeekActivities(weekData.activities || [])
        setMonthActivities(monthData.activities || [])
        
      } catch (err) {
        console.error('❌ Detailed activities fetch error:', err)
        // Reset data on error
        setYesterdayActivities([])
        setWeekActivities([])
        setMonthActivities([])
      } finally {
        setDetailLoading(false)
      }
    }

    fetchDetailedActivities()
  }, [selectedEmployee, user])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTimeOnly = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Manila'
    })
  }

  const formatTimeOnlyLocal = (dateTime: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateTime))
  }

  const getElapsedTime = (updatedAt: string) => {
    const inactiveTime = new Date(updatedAt)
    const now = currentTime
    const elapsedMs = Math.max(0, now.getTime() - inactiveTime.getTime())
    
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

  const getBreakElapsedTime = (breakStartTime: string, pauseTime: string | null, resumeTime: string | null) => {
    const start = new Date(breakStartTime)
    const now = currentTime
    
    // Calculate paused duration (same logic as breaks page)
    let pausedMs = 0
    if (pauseTime) {
      const pauseStart = new Date(pauseTime)
      if (resumeTime) {
        const pauseEnd = new Date(resumeTime)
        pausedMs += Math.max(0, pauseEnd.getTime() - pauseStart.getTime())
      } else {
        // Currently paused: freeze elapsed by subtracting ongoing pause window
        pausedMs += Math.max(0, now.getTime() - pauseStart.getTime())
      }
    }

    const elapsedMs = Math.max(0, now.getTime() - start.getTime() - pausedMs)
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

const getActivityStatus = (isActive: boolean, lastSessionStart: string | null, hasActivityData: boolean, updatedAt: string, isOnBreak: boolean, currentBreakType: string | null, breakStartTime: string | null, pauseTime: string | null, resumeTime: string | null, isInMeeting: boolean, meetingTitle: string | null, meetingType: string | null, meetingStartTime: string | null, isInEvent: boolean, eventTitle: string | null, eventLocation: string | null, eventStartTime: string | null, eventEndTime: string | null, isGoing: boolean | null, isBack: boolean | null, goingAt: string | null, backAt: string | null, isInRestroom: boolean, restroomCount: number, dailyRestroomCount: number, restroomWentAt: string | null) => {
  if (!hasActivityData) {
    return <span className="text-muted-foreground text-sm">-</span>
  }
  
  // Check if user is inactive first (highest priority)
  if (lastSessionStart && !isActive) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
          </TooltipTrigger>
          <TooltipContent className="min-w-[12rem]">
            <div className="flex w-full flex-col gap-1">
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Last Active</span>
                  <div className="flex flex-col items-start">
                    <span className="font-bold">
                      Local: {lastSessionStart ? formatTimeOnlyLocal(lastSessionStart) : 'Never'}
                    </span>
                    <span className="font-bold text-muted-foreground text-xs">
                      PH: {lastSessionStart ? formatTimeOnly(lastSessionStart) : 'Never'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Elapse Time</span>
                  <span className="font-bold">{lastSessionStart ? getElapsedTime(lastSessionStart) : 'Unknown'}</span>
                </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  // Check if no last session start (also inactive)
  if (!lastSessionStart) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
          </TooltipTrigger>
          <TooltipContent className="min-w-[12rem]">
            <div className="flex w-full flex-col gap-1">
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Last Active</span>
                  <div className="flex flex-col items-start">
                    <span className="font-bold">
                      Local: {lastSessionStart ? formatTimeOnlyLocal(lastSessionStart) : 'Never'}
                    </span>
                    <span className="font-bold text-muted-foreground text-xs">
                      PH: {lastSessionStart ? formatTimeOnly(lastSessionStart) : 'Never'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Elapse Time</span>
                  <span className="font-bold">{lastSessionStart ? getElapsedTime(lastSessionStart) : 'Unknown'}</span>
                </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  // Check if user is on break second
  if (isOnBreak) {
    // If on break but has pause_time data and no resume_time, show as Active (break is paused)
    if (pauseTime && !resumeTime) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    }
    
    // Show On Break with tooltip
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">On Break</Badge>
          </TooltipTrigger>
          <TooltipContent className="min-w-[12rem]">
            <div className="flex w-full flex-col items-center">
              <span className="font-bold text-sm">{currentBreakType ? `${currentBreakType} Break` : 'Break'}</span>
              <div className="h-px w-full bg-foreground/20 my-2" />
              <div className="flex w-full flex-col gap-1">
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Started</span>
                  <div className="flex flex-col items-start">
                    <span className="font-bold">
                      Local: {breakStartTime ? formatTimeOnlyLocal(breakStartTime) : formatTimeOnlyLocal(updatedAt)}
                    </span>
                    <span className="font-bold text-muted-foreground text-xs">
                      PH: {breakStartTime ? formatTimeOnly(breakStartTime) : formatTimeOnly(updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Elapse Time</span>
                  <span className="font-bold">
                    {breakStartTime ? getBreakElapsedTime(breakStartTime, pauseTime, resumeTime) : getElapsedTime(updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  // Check if user is in meeting third
  if (isInMeeting) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">In Meeting</Badge>
          </TooltipTrigger>
          <TooltipContent className="min-w-[12rem]">
            <div className="flex w-full flex-col items-center">
              <span className="font-bold text-sm">{meetingTitle || 'Unknown Meeting'}</span>
              <div className="h-px w-full bg-foreground/20 my-2" />
              <div className="flex w-full flex-col gap-1">
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Started</span>
                  <div className="flex flex-col items-start">
                    <span className="font-bold">
                      Local: {meetingStartTime ? formatTimeOnlyLocal(meetingStartTime) : 'Unknown'}
                    </span>
                    <span className="font-bold text-muted-foreground text-xs">
                      PH: {meetingStartTime ? formatTimeOnly(meetingStartTime) : 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Elapse Time</span>
                  <span className="font-bold">
                    {meetingStartTime ? getElapsedTime(meetingStartTime) : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  // Check if user is in event fourth
  if (isInEvent) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Badge className="bg-pink-200 text-pink-800 border-pink-200">In Event</Badge>
          </TooltipTrigger>
          <TooltipContent className="min-w-[12rem]">
            <div className="flex w-full flex-col items-center">
              <span className="font-bold text-sm">{eventTitle || 'Unknown Event'}</span>
              
              {/* Event Schedule - moved to top */}
              <div className="grid grid-cols-[1fr_2fr] gap-4 w-full mt-2">
                <span className="text-muted-foreground">Event Schedule</span>
                <div className="flex flex-col items-start">
                  <span className="font-bold">
                    Local: {eventStartTime ? (() => {
                      // Create a date object treating the database time as Philippines timezone
                      const date = new Date(eventStartTime);
                      // Get the time components
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      const seconds = String(date.getSeconds()).padStart(2, '0');
                      
                      // Create ISO string with Philippines timezone offset
                      const phTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+08:00`;
                      const phTime = new Date(phTimeString);
                      
                      return phTime.toLocaleString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      });
                    })() : 'Unknown'} - {eventEndTime ? (() => {
                      // Create a date object treating the database time as Philippines timezone
                      const date = new Date(eventEndTime);
                      // Get the time components
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      const seconds = String(date.getSeconds()).padStart(2, '0');
                      
                      // Create ISO string with Philippines timezone offset
                      const phTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+08:00`;
                      const phTime = new Date(phTimeString);
                      
                      return phTime.toLocaleString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      });
                    })() : 'Unknown'}
                  </span>
                  <span className="font-bold text-muted-foreground text-xs">
                    PH: {eventStartTime ? new Date(eventStartTime).toLocaleString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }) : 'Unknown'} - {eventEndTime ? new Date(eventEndTime).toLocaleString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }) : 'Unknown'}
                  </span>
                </div>
              </div>
              
              <div className="h-px w-full bg-foreground/20 my-2" />
              <div className="flex w-full flex-col gap-1">
                {goingAt && (
                  <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                    <span className="text-muted-foreground">Went at</span>
                    <div className="flex flex-col items-start">
                      <span className="font-bold">
                        Local: {formatTimeOnlyLocal(goingAt)}
                      </span>
                      <span className="font-bold text-muted-foreground text-xs">
                        PH: {formatTimeOnly(goingAt)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Elapse Time</span>
                  <span className="font-bold">
                    {goingAt ? getElapsedTime(goingAt) : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  // Check if user is in restroom fifth
  if (isInRestroom) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">In Restroom</Badge>
          </TooltipTrigger>
          <TooltipContent className="min-w-[12rem]">
            <div className="flex w-full flex-col items-center">
              <div className="flex w-full flex-col gap-1">
                {restroomWentAt && (
                  <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                    <span className="text-muted-foreground">Went at</span>
                    <div className="flex flex-col items-start">
                      <span className="font-bold">
                        Local: {formatTimeOnlyLocal(restroomWentAt)}
                      </span>
                      <span className="font-bold text-muted-foreground text-xs">
                        PH: {formatTimeOnly(restroomWentAt)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Elapse Time</span>
                  <span className="font-bold">
                    {restroomWentAt ? getElapsedTime(restroomWentAt) : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
    
    // Check if user is active sixth (lowest priority)
    if (isActive) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    }
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
          </TooltipTrigger>
          <TooltipContent className="min-w-[12rem]">
            <div className="flex w-full flex-col gap-1">
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Last Active</span>
                  <div className="flex flex-col items-start">
                    <span className="font-bold">
                      Local: {lastSessionStart ? formatTimeOnlyLocal(lastSessionStart) : 'Never'}
                    </span>
                    <span className="font-bold text-muted-foreground text-xs">
                      PH: {lastSessionStart ? formatTimeOnly(lastSessionStart) : 'Never'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                  <span className="text-muted-foreground">Elapse Time</span>
                  <span className="font-bold">{lastSessionStart ? getElapsedTime(lastSessionStart) : 'Unknown'}</span>
                </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Get yesterday's activity data for selected employee
  const getYesterdayActivityData = (employee: Employee) => {
    const yesterdayActivity = yesterdayActivities.find(a => a.user_id.toString() === employee.id)
    return yesterdayActivity || {
      id: 0,
      user_id: parseInt(employee.id),
      today_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }),
      today_active_seconds: 0,
      today_inactive_seconds: 0,
      is_currently_active: false,
      last_session_start: null,
      created_at: '',
      updated_at: '',
      first_name: employee.firstName,
      last_name: employee.lastName,
      email: employee.email,
      profile_picture: employee.avatar || null,
      department_name: employee.department,
      is_on_break: false,
      current_break_type: null,
      break_start_time: null,
      pause_time: null,
      resume_time: null,
      is_in_meeting: false,
      meeting_title: null,
      meeting_type: null,
      meeting_start_time: null,
      is_in_event: false,
      event_title: null,
      event_location: null,
      event_start_time: null,
      event_end_time: null,
      is_going: null,
      is_back: null,
      going_at: null,
      back_at: null,
      is_in_restroom: false,
      restroom_count: 0,
      daily_restroom_count: 0,
      restroom_went_at: null
    }
  }

  // Get this week's total activity data for selected employee
  const getWeekActivityData = (employee: Employee) => {
    const weekEmployeeActivities = weekActivities.filter(a => a.user_id.toString() === employee.id)
    
    const totalActive = weekEmployeeActivities.reduce((sum, activity) => sum + activity.today_active_seconds, 0)
    const totalInactive = weekEmployeeActivities.reduce((sum, activity) => sum + activity.today_inactive_seconds, 0)
    
    return {
      total_active_seconds: totalActive,
      total_inactive_seconds: totalInactive
    }
  }

  // Get this month's total activity data for selected employee
  const getMonthActivityData = (employee: Employee) => {
    const monthEmployeeActivities = monthActivities.filter(a => a.user_id.toString() === employee.id)
    
    const totalActive = monthEmployeeActivities.reduce((sum, activity) => sum + activity.today_active_seconds, 0)
    const totalInactive = monthEmployeeActivities.reduce((sum, activity) => sum + activity.today_inactive_seconds, 0)
    
    return {
      total_active_seconds: totalActive,
      total_inactive_seconds: totalInactive
    }
  }

  // Merge employees with their activity data
  const getMergedData = () => {
    return employees.map(employee => {
      const activity = activities.find(a => a.user_id.toString() === employee.id)
      const hasActivityData = !!activity
      return {
        ...employee,
        hasActivityData,
        activity: activity || {
          id: 0,
          user_id: parseInt(employee.id),
          today_date: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }),
          today_active_seconds: 0,
          today_inactive_seconds: 0,
          is_currently_active: false,
          last_session_start: null,
          created_at: '',
          updated_at: '',
          first_name: employee.firstName,
          last_name: employee.lastName,
          email: employee.email,
          profile_picture: employee.avatar || null,
          department_name: employee.department,
          is_on_break: false,
          current_break_type: null,
          pause_time: null,
          resume_time: null,
          is_in_meeting: false,
          meeting_title: null,
          meeting_type: null,
          meeting_start_time: null,
          is_in_event: false,
          event_title: null,
          event_location: null,
          event_start_time: null,
          event_end_time: null,
          is_going: null,
          is_back: null,
          going_at: null,
          back_at: null,
          is_in_restroom: false,
          restroom_count: 0,
          daily_restroom_count: 0,
          restroom_went_at: null
        }
      }
    })
  }

  // Sorting logic
  const handleSort = (field: 'name' | 'status' | 'activeTime' | 'inactiveTime') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (field: 'name' | 'status' | 'activeTime' | 'inactiveTime') => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-foreground" /> : 
      <ArrowDown className="h-4 w-4 text-foreground" />
  }


  const sortedActivities = getMergedData().sort((a, b) => {
    // Sort only by the selected field
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case 'name':
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
        break
      case 'status':
        // Sort alphabetically by status name
        const getStatusName = (employee: any) => {
          if (!employee.hasActivityData) return 'Unknown'
          
          if (employee.activity.is_in_meeting) return 'In Meeting'
          if (employee.activity.is_in_event) return 'In Event'
          if (employee.activity.is_in_restroom) return 'In Restroom'
          if (employee.activity.is_on_break) {
            return employee.activity.pause_time ? 'Active' : 'On Break'
          }
          if (employee.activity.is_currently_active) return 'Active'
          if (employee.activity.last_session_start) return 'Inactive'
          return 'Inactive'
        }
        
        aValue = getStatusName(a).toLowerCase()
        bValue = getStatusName(b).toLowerCase()
        break
      case 'activeTime':
        aValue = a.activity.today_active_seconds
        bValue = b.activity.today_active_seconds
        break
      case 'inactiveTime':
        aValue = a.activity.today_inactive_seconds
        bValue = b.activity.today_inactive_seconds
        break
      default:
        return 0
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? 
        aValue.localeCompare(bValue) : 
        bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  // Calculate inactive employees count
  const getInactiveEmployeesCount = () => {
    return sortedActivities.filter(employee => {
      if (!employee.hasActivityData) return false
      if (employee.activity.is_currently_active) return false
      if (employee.activity.last_session_start) {
        return true // Inactive if has last session start but not currently active
      }
      return true // Inactive if no last session start
    }).length
  }

  // Calculate active employees count
  const getActiveEmployeesCount = () => {
    return sortedActivities.filter(employee => {
      if (!employee.hasActivityData) return false
      if (employee.activity.is_currently_active) return true
      return false // Only currently active employees are considered active
    }).length
  }

  if (loading) {
    return (
      <>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col py-4 md:py-6">
                {/* Activities Header Section */}
                <div className="px-4 lg:px-6 mb-4 min-h-[72px]">
                  <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-80" />
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="px-4 lg:px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Column 1: Activity Data Table Skeleton */}
                    <div className="order-3 lg:order-1">
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow variant="no-hover" className="h-12">
                                <TableHead className="w-48">
                                  <div className="flex items-center gap-1">
                                    <Skeleton className="h-4 w-16" />
                                  </div>
                                </TableHead>
                                {[...Array(3)].map((_, i) => (
                                  <TableHead key={i} className="text-center w-32">
                                    <Skeleton className="h-4 w-20 mx-auto" />
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[...Array(8)].map((_, i) => (
                                <TableRow key={i} className="h-20">
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <Skeleton className="h-10 w-10 rounded-full" />
                                      <Skeleton className="h-5 w-28" />
                                    </div>
                                  </TableCell>
                                  {[...Array(3)].map((_, j) => (
                                    <TableCell key={j} className="text-center">
                                      <Skeleton className="h-7 w-20 mx-auto" />
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Column 2: Stats Cards Skeleton */}
                    <div className="order-2 lg:order-2 lg:sticky lg:top-16 lg:self-start">
                      <div className="space-y-4">
                        {/* Status Cards Row Skeleton */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Active Card Skeleton */}
                          <Card className="bg-white dark:bg-card">
                            <CardHeader className="space-y-0 pb-4">
                              <div>
                                <Skeleton className="h-4 w-16 mb-2" />
                                <Skeleton className="h-3 w-32" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-semibold tabular-nums flex items-center gap-2">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-8 w-8" />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Inactive Card Skeleton */}
                          <Card className="bg-white dark:bg-card">
                            <CardHeader className="space-y-0 pb-4">
                              <div>
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-3 w-36" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-semibold tabular-nums flex items-center gap-2">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-8 w-8" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Activity Data Card Skeleton */}
                        <Card className="bg-white dark:bg-card">
                          <CardHeader>
                            <div>
                              <Skeleton className="h-4 w-40 mb-2" />
                              <Skeleton className="h-3 w-64" />
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-4">
                              {[...Array(4)].map((_, i) => (
                                <div key={i}>
                                  <Skeleton className="h-3 w-16 mb-2" />
                                  <div className="grid grid-cols-2 gap-3">
                                    <Card className="bg-muted/50 dark:bg-muted/20 border-border">
                                      <CardContent className="p-3">
                                        <Skeleton className="h-3 w-24 mb-2" />
                                        <Skeleton className="h-6 w-12" />
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-muted/50 dark:bg-muted/20 border-border">
                                      <CardContent className="p-3">
                                        <Skeleton className="h-3 w-28 mb-2" />
                                        <Skeleton className="h-6 w-12" />
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
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
              <div className="flex flex-col py-4 md:py-6">
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
            <div className="flex flex-col py-4 md:py-6">
              {/* Activities Header Section */}
              <div className="px-4 lg:px-6 mb-4 min-h-[72px]">
                <div>
                  <h1 className="text-2xl font-bold">Activities</h1>
                  <p className="text-sm text-muted-foreground">
                    Track user activities and productivity metrics by date.
                  </p>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Column 1: Activity Data Table */}
                  <div className="order-3 lg:order-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="">
                          <Table>
                            <TableHeader>
                              <TableRow variant="no-hover" className="h-12">
                                <TableHead 
                                  className={`w-48 cursor-pointer ${sortField === 'name' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                  onClick={() => handleSort('name')}
                                >
                                  <div className="flex items-center gap-1">
                                    Name
                                    {sortField === 'name' && getSortIcon('name')}
                                  </div>
                                </TableHead>
                                <TableHead 
                                  className={`text-center cursor-pointer w-24 ${sortField === 'status' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                  onClick={() => handleSort('status')}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    Status
                                    {sortField === 'status' && getSortIcon('status')}
                                  </div>
                                </TableHead>
                                 <TableHead 
                                   className={`text-center cursor-pointer w-40 ${sortField === 'activeTime' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                   onClick={() => handleSort('activeTime')}
                                 >
                                   <div className="flex items-center justify-center gap-1">
                                     Today's Total Active Time
                                     {sortField === 'activeTime' && getSortIcon('activeTime')}
                                   </div>
                                 </TableHead>
                                 <TableHead 
                                   className={`text-center cursor-pointer w-40 ${sortField === 'inactiveTime' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                   onClick={() => handleSort('inactiveTime')}
                                 >
                                   <div className="flex items-center justify-center gap-1">
                                     Today's Total Inactive Time
                                     {sortField === 'inactiveTime' && getSortIcon('inactiveTime')}
                                   </div>
                                 </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedActivities.map((employee) => (
                                <TableRow 
                                  key={employee.id} 
                                  className="h-14 cursor-pointer hover:bg-accent/50"
                                  onClick={() => setSelectedEmployee(employee)}
                                >
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={employee.activity.profile_picture || undefined} alt={`${employee.firstName} ${employee.lastName}`} />
                                        <AvatarFallback>
                                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">
                                          {employee.firstName} {employee.lastName}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
            <TableCell className="text-center">
              {getActivityStatus(employee.activity.is_currently_active, employee.activity.last_session_start, employee.hasActivityData, employee.activity.updated_at, employee.activity.is_on_break, employee.activity.current_break_type, (employee.activity as any).break_start_time, employee.activity.pause_time, employee.activity.resume_time, employee.activity.is_in_meeting, employee.activity.meeting_title, employee.activity.meeting_type, employee.activity.meeting_start_time, employee.activity.is_in_event, employee.activity.event_title, employee.activity.event_location, employee.activity.event_start_time, employee.activity.event_end_time, employee.activity.is_going, employee.activity.is_back, employee.activity.going_at, employee.activity.back_at, employee.activity.is_in_restroom, employee.activity.restroom_count, employee.activity.daily_restroom_count, employee.activity.restroom_went_at)}
            </TableCell>
                                  <TableCell className="text-center">
                                    {employee.activity.today_active_seconds > 0 ? (
                                      <span className="font-mono text-sm">{formatTime(employee.activity.today_active_seconds)}</span>
                                    ) : (
                                      <span className="text-muted-foreground text-sm">-</span>
                                    )}
                                  </TableCell>
                                   <TableCell className="text-center">
                                     {employee.activity.today_inactive_seconds > 0 ? (
                                       <span className="font-mono text-sm">{formatTime(employee.activity.today_inactive_seconds)}</span>
                                     ) : (
                                       <span className="text-muted-foreground text-sm">-</span>
                                     )}
                                   </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Column 2: Stats Cards (sticky) */}
                  <div className="order-2 lg:order-2 lg:sticky lg:top-16 lg:self-start">
                    <div className="space-y-4">
                      {/* Status Cards Row */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Active Employees Card */}
                        <Card className="bg-white dark:bg-card">
                          <CardHeader className="space-y-0 pb-4">
                            <div>
                              <CardTitle className="text-base">Active</CardTitle>
                              <CardDescription>Employees currently active.</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-semibold tabular-nums flex items-center gap-2">
                              <div className="h-5 w-5 text-green-500">
                                <UsersIcon className="h-5 w-5" />
                              </div>
                              {getActiveEmployeesCount()}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Inactive Employees Card */}
                        <Card className="bg-white dark:bg-card">
                          <CardHeader className="space-y-0 pb-4">
                            <div>
                              <CardTitle className="text-base">Inactive</CardTitle>
                              <CardDescription>Employees currently inactive.</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-semibold tabular-nums flex items-center gap-2">
                              <div className="h-5 w-5 text-red-500">
                                <UsersIcon className="h-5 w-5" />
                              </div>
                              {getInactiveEmployeesCount()}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

        <ActivityDataCard 
          selectedEmployee={selectedEmployee}
          formatTime={formatTime}
          getMergedData={getMergedData}
          detailLoading={detailLoading}
          getYesterdayActivityData={getYesterdayActivityData}
          getWeekActivityData={getWeekActivityData}
          getMonthActivityData={getMonthActivityData}
          user={user}
        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
