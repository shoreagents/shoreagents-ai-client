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
import { NoData } from "@/components/ui/no-data"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ActivityDataCard } from "@/components/activity-data-card"
import { useRealtimeActivities, ActivityEntry as RealtimeActivityEntry } from "@/hooks/use-realtime-activities"
import { ReloadButton } from "@/components/ui/reload-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator, SelectGroup, SelectLabel } from "@/components/ui/select"

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
  // Clinic statistics
  is_in_clinic: boolean
  in_clinic_at: string | null
  clinic_request_status: string | null
  clinic_priority: string | null
  clinic_complaint: string | null
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
  user_id?: number
  first_name?: string
  last_name?: string
  member_id?: number
  member_company?: string
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
  const [reloading, setReloading] = useState(false)
  
  // Member filter state
  const [memberId, setMemberId] = useState<string>('all')
  const [memberOptions, setMemberOptions] = useState<{ id: number; company: string }[]>([])
  
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
  const [sortField, setSortField] = useState<'name' | 'status' | 'activeTime' | 'inactiveTime'>('status')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Update current time every second for timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch member options - extract from employees data
  useEffect(() => {
    const extractMemberOptions = () => {
      if (employees.length > 0) {
        const uniqueMembers = employees
          .filter(emp => emp.member_id && emp.member_company)
          .reduce((acc, emp) => {
            if (!acc.find(m => m.id === emp.member_id)) {
              acc.push({
                id: emp.member_id!,
                company: emp.member_company!
              })
            }
            return acc
          }, [] as { id: number; company: string }[])
        
        // If no members found from employees, add the current user's member info
        if (uniqueMembers.length === 0 && user?.memberId) {
          uniqueMembers.push({
            id: user.memberId,
            company: 'Current Company'
          })
        }
        
        setMemberOptions(uniqueMembers)
      }
    }
    
    extractMemberOptions()
  }, [employees, user])

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user?.id && user?.userType !== 'Internal') {
        return
      }

      try {
        const params = new URLSearchParams({
          limit: '1000'
        })
        
        // Determine the correct memberId based on user type and current filter
        let actualMemberId = memberId
        if (memberId === 'all' && user?.userType !== 'Internal') {
          // For non-internal users, use their memberId instead of 'all'
          actualMemberId = user.memberId?.toString() || 'all'
        }
        
        params.append('memberId', actualMemberId)

        const response = await fetch(`/api/team/employees?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.status}`)
        }

        const data = await response.json()
        console.log('🔍 fetchEmployees - API response:', data)
        
        // Map the API response to include both naming conventions and member info
        const mappedEmployees = data.employees.map((emp: any) => ({
          ...emp,
          // Ensure both naming conventions are available
          first_name: emp.first_name || emp.firstName,
          last_name: emp.last_name || emp.lastName,
          firstName: emp.firstName || emp.first_name,
          lastName: emp.lastName || emp.last_name,
          // Add member info (these might need to be fetched separately)
          member_id: emp.member_id || user?.memberId,
          member_company: emp.member_company || 'Unknown Company',
          // Ensure user_id is available
          user_id: emp.user_id || parseInt(emp.id)
        }))
        
        setEmployees(mappedEmployees)
      } catch (err) {
        console.error('❌ Employees fetch error:', err)
        // Don't set error state for employees fetch failure, just log it
      }
    }

    if (user) {
      fetchEmployees()
    }
  }, [user, memberId])

  // Fetch activities data
  const fetchActivities = async () => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Determine the correct memberId based on user type
      let actualMemberId = 'all'
      if (user.userType !== 'Internal') {
        actualMemberId = user.memberId?.toString() || 'all'
      }
      
      const response = await fetch(`/api/activities?memberId=${actualMemberId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('🔍 fetchActivities - API response:', data)
      setActivities(data.activities)
      setStats(data.stats)
    } catch (err) {
      console.error('❌ Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch activities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [user])

  // Reload function
  const handleReload = async () => {
    setReloading(true)
    try {
      // Don't set loading to true during reload to keep the UI visible
      setError(null)
      
      const params = new URLSearchParams({
        limit: '1000'
      })
      
      // Determine the correct memberId based on user type and current filter
      let actualMemberId = memberId
      if (memberId === 'all' && user?.userType !== 'Internal') {
        // For non-internal users, use their memberId instead of 'all'
        actualMemberId = user.memberId?.toString() || 'all'
      }
      
      params.append('memberId', actualMemberId)

      const response = await fetch(`/api/team/employees?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Map the API response to include both naming conventions and member info
      const mappedEmployees = data.employees.map((emp: any) => ({
        ...emp,
        // Ensure both naming conventions are available
        first_name: emp.first_name || emp.firstName,
        last_name: emp.last_name || emp.lastName,
        firstName: emp.firstName || emp.first_name,
        lastName: emp.lastName || emp.last_name,
        // Add member info (these might need to be fetched separately)
        member_id: emp.member_id || user?.memberId,
        member_company: emp.member_company || 'Unknown Company',
        // Ensure user_id is available
        user_id: emp.user_id || parseInt(emp.id)
      }))
      
      setEmployees(mappedEmployees || [])
      
      // Fetch activities data
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
      const activitiesResponse = await fetch(`/api/activities?memberId=${actualMemberId}&date=${today}`)
      
      if (!activitiesResponse.ok) {
        throw new Error(`HTTP error! status: ${activitiesResponse.status}`)
      }
      
      const activitiesData = await activitiesResponse.json()
      setActivities(activitiesData.activities || [])
      setStats(activitiesData.stats || null)
      
    } catch (err) {
      console.error('❌ Reload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to reload data')
    } finally {
      setReloading(false)
    }
  }

  // Fetch detailed activity data when employee is selected (yesterday, week, month only)
  useEffect(() => {
    const fetchDetailedActivities = async () => {
      if (!selectedEmployee || !user) return
      
      setDetailLoading(true)
      
      try {
        const memberId = user.userType === 'Internal' ? 'all' : user.memberId?.toString() || 'all'
        
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

const getActivityStatus = (isActive: boolean, lastSessionStart: string | null, hasActivityData: boolean, updatedAt: string, isOnBreak: boolean, currentBreakType: string | null, breakStartTime: string | null, pauseTime: string | null, resumeTime: string | null, isInMeeting: boolean, meetingTitle: string | null, meetingType: string | null, meetingStartTime: string | null, isInEvent: boolean, eventTitle: string | null, eventLocation: string | null, eventStartTime: string | null, eventEndTime: string | null, isGoing: boolean | null, isBack: boolean | null, goingAt: string | null, backAt: string | null, isInRestroom: boolean, restroomCount: number, dailyRestroomCount: number, restroomWentAt: string | null, isInClinic: boolean, inClinicAt: string | null, clinicRequestStatus: string | null, clinicPriority: string | null, clinicComplaint: string | null) => {
  if (!hasActivityData) {
    return <span className="text-muted-foreground text-sm">-</span>
  }
  
  // Collect all active statuses
  const statuses = []
  
  // Check for break status
  if (isOnBreak) {
    // If on break but has pause_time data and no resume_time, don't add break status (it's paused)
    if (!(pauseTime && !resumeTime)) {
      statuses.push({
        type: 'break',
        badge: (
          <TooltipProvider key="break">
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
      })
    }
  }
  
  // Check for meeting status
  if (isInMeeting) {
    statuses.push({
      type: 'meeting',
      badge: (
        <TooltipProvider key="meeting">
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
    })
  }
  
  // Check for event status
  if (isInEvent) {
    statuses.push({
      type: 'event',
      badge: (
        <TooltipProvider key="event">
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
    })
  }
  
  // Check for restroom status
  if (isInRestroom) {
    statuses.push({
      type: 'restroom',
      badge: (
        <TooltipProvider key="restroom">
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
    })
  }
  
  // Check for clinic status
  if (isInClinic) {
    statuses.push({
      type: 'clinic',
      badge: (
        <TooltipProvider key="clinic">
          <Tooltip delayDuration={300}>
            <TooltipTrigger>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">In Clinic</Badge>
            </TooltipTrigger>
            <TooltipContent className="min-w-[12rem]">
              <div className="flex w-full flex-col items-center">
                <span className="font-bold text-sm">{clinicComplaint || 'Health Check'}</span>
                
                <div className="h-px w-full bg-foreground/20 my-2" />
                <div className="flex w-full flex-col gap-1">
                  {inClinicAt && (
                    <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                      <span className="text-muted-foreground">Arrived</span>
                      <div className="flex flex-col items-start">
                        <span className="font-bold">
                          Local: {formatTimeOnlyLocal(inClinicAt)}
                        </span>
                        <span className="font-bold text-muted-foreground text-xs">
                          PH: {formatTimeOnly(inClinicAt)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
                    <span className="text-muted-foreground">Elapse Time</span>
                    <span className="font-bold">
                      {inClinicAt ? getElapsedTime(inClinicAt) : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    })
  }
  
  // If there are other statuses, show them (multiple badges)
  if (statuses.length > 0) {
    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {statuses.map(status => status.badge)}
      </div>
    )
  }
  
  // If no other statuses, show Active/Inactive
  if (isActive) {
    return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
  }
  
  // Show Inactive with tooltip
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
    const employeeId = employee.user_id || employee.id
    const yesterdayActivity = yesterdayActivities.find(a => a.user_id.toString() === employeeId.toString())
    return yesterdayActivity || {
      id: 0,
      user_id: parseInt(employeeId.toString()),
      today_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }),
      today_active_seconds: 0,
      today_inactive_seconds: 0,
      is_currently_active: false,
      last_session_start: null,
      created_at: '',
      updated_at: '',
      first_name: employee.first_name || employee.firstName,
      last_name: employee.last_name || employee.lastName,
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
      restroom_went_at: null,
      // Clinic statistics
      is_in_clinic: false,
      in_clinic_at: null,
      clinic_request_status: null,
      clinic_priority: null,
      clinic_complaint: null
    }
  }

  // Get this week's total activity data for selected employee
  const getWeekActivityData = (employee: Employee) => {
    const employeeId = employee.user_id || employee.id
    const weekEmployeeActivities = weekActivities.filter(a => a.user_id.toString() === employeeId.toString())
    
    const totalActive = weekEmployeeActivities.reduce((sum, activity) => sum + activity.today_active_seconds, 0)
    const totalInactive = weekEmployeeActivities.reduce((sum, activity) => sum + activity.today_inactive_seconds, 0)
    
    return {
      total_active_seconds: totalActive,
      total_inactive_seconds: totalInactive
    }
  }

  // Get this month's total activity data for selected employee
  const getMonthActivityData = (employee: Employee) => {
    const employeeId = employee.user_id || employee.id
    const monthEmployeeActivities = monthActivities.filter(a => a.user_id.toString() === employeeId.toString())
    
    const totalActive = monthEmployeeActivities.reduce((sum, activity) => sum + activity.today_active_seconds, 0)
    const totalInactive = monthEmployeeActivities.reduce((sum, activity) => sum + activity.today_inactive_seconds, 0)
    
    return {
      total_active_seconds: totalActive,
      total_inactive_seconds: totalInactive
    }
  }

  // Calculate filtered stats based on member selection
  const getFilteredStats = () => {
    let filteredEmployees = employees
    
    if (memberId !== 'all') {
      if (memberId === 'none') {
        // Show only employees with no member assignment
        filteredEmployees = employees.filter(emp => !emp.member_id)
      } else {
        // Show only employees from the selected member company
        const selectedMemberId = parseInt(memberId)
        filteredEmployees = employees.filter(emp => emp.member_id === selectedMemberId)
      }
    }
    
    return {
      totalEmployees: filteredEmployees.length,
      filteredEmployees
    }
  }

  // Merge employees with their activity data
  const getMergedData = () => {
    const { filteredEmployees } = getFilteredStats()
    return filteredEmployees.map(employee => {
      // Try to match by user_id first, then by id
      const employeeId = employee.user_id || employee.id
      const activity = activities.find(a => a.user_id.toString() === employeeId.toString())
      const hasActivityData = !!activity
      return {
        ...employee,
        hasActivityData,
        activity: activity || {
          id: 0,
          user_id: parseInt(employeeId.toString()),
          today_date: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }),
          today_active_seconds: 0,
          today_inactive_seconds: 0,
          is_currently_active: false,
          last_session_start: null,
          created_at: '',
          updated_at: '',
          first_name: employee.first_name,
          last_name: employee.last_name,
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
          restroom_went_at: null,
          // Clinic statistics
          is_in_clinic: false,
          in_clinic_at: null,
          clinic_request_status: null,
          clinic_priority: null,
          clinic_complaint: null
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


  const mergedData = getMergedData()
  
  
  const sortedActivities = mergedData.sort((a, b) => {
    // Sort only by the selected field
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case 'name':
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase()
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase()
        break
      case 'status':
        // Sort by priority (lower number = higher priority)
        const getStatusPriority = (employee: any) => {
          if (!employee.hasActivityData) return 8 // Unknown - lowest priority
          
          // Check statuses in order of priority (1 = highest, 7 = lowest)
          if (employee.activity.is_in_meeting) return 3 // In Meeting
          if (employee.activity.is_in_event) return 4 // In Event
          if (employee.activity.is_in_restroom) return 5 // In Restroom
          if (employee.activity.is_in_clinic) return 6 // In Clinic
          if (employee.activity.is_on_break) {
            // Check if break is paused (counts as Active)
            if (employee.activity.pause_time && !employee.activity.resume_time) {
              return 7 // Paused Break (counts as Active)
            }
            return 2 // Regular On Break
          }
          if (employee.activity.is_currently_active) return 7 // Active - lowest priority
          if (employee.activity.last_session_start) return 1 // Inactive - highest priority
          return 1 // Inactive - highest priority
        }
        
        aValue = getStatusPriority(a)
        bValue = getStatusPriority(b)
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

    // Primary sort by selected field
    let primaryResult = 0
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      primaryResult = sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      primaryResult = sortDirection === 'asc' ? 
        aValue.localeCompare(bValue) : 
        bValue.localeCompare(aValue)
    }

    // If primary sort is equal (0), apply secondary sort based on status
    if (primaryResult === 0) {
      if (sortField === 'status') {
        // Get status priority to determine secondary sort method
        const getStatusPriority = (employee: any) => {
          if (!employee.hasActivityData) return 8
          if (employee.activity.is_in_meeting) return 3
          if (employee.activity.is_in_event) return 4
          if (employee.activity.is_in_restroom) return 5
          if (employee.activity.is_in_clinic) return 6
          if (employee.activity.is_on_break && !employee.activity.pause_time) return 2
          if (employee.activity.is_currently_active) return 7
          if (employee.activity.last_session_start) return 1
          return 1
        }
        
        const aPriority = getStatusPriority(a)
        const bPriority = getStatusPriority(b)
        
        // If both are Active (priority 7), sort by name
        if (aPriority === 7 && bPriority === 7) {
          const aName = `${a.firstName} ${a.lastName}`.toLowerCase()
          const bName = `${b.firstName} ${b.lastName}`.toLowerCase()
          return aName.localeCompare(bName)
        }
        
        // For all other statuses, sort by time (when they started that status)
        const getStatusStartTime = (employee: any) => {
          if (employee.activity.is_in_meeting) return new Date(employee.activity.meeting_start_time || 0).getTime()
          if (employee.activity.is_in_event) return new Date(employee.activity.going_at || 0).getTime()
          if (employee.activity.is_in_restroom) return new Date(employee.activity.restroom_went_at || 0).getTime()
          if (employee.activity.is_in_clinic) return new Date(employee.activity.in_clinic_at || 0).getTime()
          if (employee.activity.is_on_break) return new Date(employee.activity.break_start_time || 0).getTime()
          if (employee.activity.last_session_start) return new Date(employee.activity.last_session_start).getTime()
          return 0
        }
        
        const aTime = getStatusStartTime(a)
        const bTime = getStatusStartTime(b)
        return sortDirection === 'asc' ? bTime - aTime : aTime - bTime
      } else {
        // For non-status fields, sort by name as secondary criteria
        const aName = `${a.firstName} ${a.lastName}`.toLowerCase()
        const bName = `${b.firstName} ${b.lastName}`.toLowerCase()
        return aName.localeCompare(bName)
      }
    }

    return primaryResult
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

  // Calculate counts for each status
  const getStatusCounts = () => {
    const counts = {
      inactive: 0,
      onBreak: 0,
      inMeeting: 0,
      inEvent: 0,
      inRestroom: 0,
      inClinic: 0,
      active: 0,
      unknown: 0
    }

    sortedActivities.forEach(employee => {
      if (!employee.hasActivityData) {
        counts.unknown++
        return
      }

      // Check statuses in order of priority
      if (employee.activity.last_session_start && !employee.activity.is_currently_active) {
        counts.inactive++
      } else if (employee.activity.is_in_meeting) {
        counts.inMeeting++
      } else if (employee.activity.is_in_event) {
        counts.inEvent++
      } else if (employee.activity.is_in_restroom) {
        counts.inRestroom++
      } else if (employee.activity.is_in_clinic) {
        counts.inClinic++
      } else if (employee.activity.is_on_break) {
        // Check if break is paused (counts as active)
        if (employee.activity.pause_time && !employee.activity.resume_time) {
          counts.active++
        } else {
          counts.onBreak++
        }
      } else if (employee.activity.is_currently_active) {
        counts.active++
      } else {
        counts.unknown++
      }
    })

    return counts
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">Activities</h1>
                      <p className="text-sm text-muted-foreground">
                        Track user activities and productivity metrics by date.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-56">
                        <Select value={memberId} onValueChange={(v: string) => setMemberId(v)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by member">
                              {memberId === 'all' ? 'All Employees' : 
                               memberId === 'none' ? 'No Assigned Members' :
                               memberOptions.find(m => String(m.id) === memberId)?.company || 'Filter by member'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Employees</SelectItem>
                            <SelectItem value="none">No Assigned Members</SelectItem>
                            <SelectSeparator className="bg-border mx-2" />
                            <SelectGroup>
                              <SelectLabel className="text-muted-foreground">Members</SelectLabel>
                              {memberOptions.map((m) => (
                                <SelectItem key={m.id} value={String(m.id)}>{m.company}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <ReloadButton 
                        loading={reloading} 
                        onReload={handleReload}
                      />
                    </div>
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
                              {[...Array(12)].map((_, i) => (
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

                    {/* Column 2: Status Cards + Activity Data Card Skeleton */}
                    <div className="order-2 lg:order-2 lg:sticky lg:top-16 lg:self-start space-y-4">
                      {/* Status Cards Skeleton */}
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {Array.from({ length: 7 }).map((_, index) => (
                          <Card key={index} className="bg-white dark:bg-card min-w-[120px] flex-shrink-0">
                            <CardHeader className="space-y-0 pb-2">
                              <div>
                                <Skeleton className="h-4 w-16" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-xl font-semibold tabular-nums flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-6 w-6" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
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
                            {[...Array(6)].map((_, i) => (
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
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Activities</h1>
                    <p className="text-sm text-muted-foreground">
                      Track user activities and productivity metrics by date.
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-56">
                      <Select value={memberId} onValueChange={(v: string) => setMemberId(v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Filter by member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Employees</SelectItem>
                          <SelectItem value="none">No Assigned Members</SelectItem>
                          <SelectSeparator className="bg-border mx-2" />
                          <SelectGroup>
                            <SelectLabel className="text-muted-foreground">Members</SelectLabel>
                            {memberOptions.map((m) => (
                              <SelectItem key={m.id} value={String(m.id)}>{m.company}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <ReloadButton
                      loading={reloading}
                      onReload={handleReload}
                    />
                  </div>
                </div>
              </div>


              {/* Two Column Layout */}
              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Column 1: Activity Data Table */}
                  <div className="order-3 lg:order-1">
                    <Card className="overflow-hidden">
                       <CardContent className="p-0">
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
                                 {sortedActivities.map((employee, index) => {
                                   return (
                                 <TableRow 
                                   key={`employee-${employee.id || employee.user_id || index}`} 
                                   className="h-14 cursor-pointer hover:bg-accent/50"
                                   onClick={() => setSelectedEmployee(employee)}
                                 >
                                   <TableCell>
                                     <div className="flex items-center gap-3">
                                       <Avatar className="h-8 w-8">
                                         <AvatarImage src={employee.activity.profile_picture || undefined} alt={`${employee.first_name} ${employee.last_name}`} />
                                         <AvatarFallback>
                                           {employee.first_name?.[0]}{employee.last_name?.[0]}
                                         </AvatarFallback>
                                       </Avatar>
                                       <div>
                                         <div className="font-medium">
                                           {employee.first_name} {employee.last_name}
                                         </div>
                                       </div>
                                     </div>
                                   </TableCell>
             <TableCell className="text-center">
               {getActivityStatus(employee.activity.is_currently_active, employee.activity.last_session_start, employee.hasActivityData, employee.activity.updated_at, employee.activity.is_on_break, employee.activity.current_break_type, (employee.activity as any).break_start_time, employee.activity.pause_time, employee.activity.resume_time, employee.activity.is_in_meeting, employee.activity.meeting_title, employee.activity.meeting_type, employee.activity.meeting_start_time, employee.activity.is_in_event, employee.activity.event_title, employee.activity.event_location, employee.activity.event_start_time, employee.activity.event_end_time, employee.activity.is_going, employee.activity.is_back, employee.activity.going_at, employee.activity.back_at, employee.activity.is_in_restroom, employee.activity.restroom_count, employee.activity.daily_restroom_count, employee.activity.restroom_went_at, employee.activity.is_in_clinic, employee.activity.in_clinic_at, employee.activity.clinic_request_status, employee.activity.clinic_priority, employee.activity.clinic_complaint)}
             </TableCell>
                                   <TableCell className="text-center">
                                     {employee.activity.today_active_seconds > 0 ? (
                                       <span className="text-sm">{formatTime(employee.activity.today_active_seconds)}</span>
                                     ) : (
                                       <span className="text-muted-foreground text-sm">-</span>
                                     )}
                                   </TableCell>
                                    <TableCell className="text-center">
                                      {employee.activity.today_inactive_seconds > 0 ? (
                                        <span className="text-sm">{formatTime(employee.activity.today_inactive_seconds)}</span>
                                      ) : (
                                        <span className="text-muted-foreground text-sm">-</span>
                                      )}
                                    </TableCell>
                                 </TableRow>
                                   )
                                 })}
                             </TableBody>
                           </Table>
                           {sortedActivities.length === 0 && (
                             <div className="p-6">
                               <NoData message={employees.length === 0 ? 'No Employees Found' : 'No Activity Data'} />
                             </div>
                           )}
                      </CardContent>
                    </Card>
                  </div>

                   {/* Column 2: Status Cards + Activity Data Card (sticky) */}
                   <div className="order-2 lg:order-2 lg:sticky lg:top-16 lg:self-start space-y-4">
                     {/* Status Cards */}
                     <div className="flex gap-3 overflow-x-auto pb-2">
                       {/* Active Card */}
                       <Card className="bg-white dark:bg-card min-w-[120px] flex-shrink-0">
                         <CardHeader className="space-y-0 pb-2">
                           <div>
                             <CardTitle className="text-sm">Active</CardTitle>
                           </div>
                         </CardHeader>
                         <CardContent>
                           <div className="text-xl font-semibold tabular-nums flex items-center gap-2">
                             <div className="h-4 w-4 text-green-500">
                               <UsersIcon className="h-4 w-4" />
                             </div>
                             {getStatusCounts().active}
                           </div>
                         </CardContent>
                       </Card>

                       {/* Inactive Card */}
                       <Card className="bg-white dark:bg-card min-w-[120px] flex-shrink-0">
                         <CardHeader className="space-y-0 pb-2">
                           <div>
                             <CardTitle className="text-sm">Inactive</CardTitle>
                           </div>
                         </CardHeader>
                         <CardContent>
                           <div className="text-xl font-semibold tabular-nums flex items-center gap-2">
                             <div className="h-4 w-4 text-red-500">
                               <UsersIcon className="h-4 w-4" />
                             </div>
                             {getStatusCounts().inactive}
                           </div>
                         </CardContent>
                       </Card>

                       {/* On Break Card */}
                       <Card className="bg-white dark:bg-card min-w-[120px] flex-shrink-0">
                         <CardHeader className="space-y-0 pb-2">
                           <div>
                             <CardTitle className="text-sm">On Break</CardTitle>
                           </div>
                         </CardHeader>
                         <CardContent>
                           <div className="text-xl font-semibold tabular-nums flex items-center gap-2">
                             <div className="h-4 w-4 text-blue-500">
                               <UsersIcon className="h-4 w-4" />
                             </div>
                             {getStatusCounts().onBreak}
                           </div>
                         </CardContent>
                       </Card>

                       {/* In Meeting Card */}
                       <Card className="bg-white dark:bg-card min-w-[120px] flex-shrink-0">
                         <CardHeader className="space-y-0 pb-2">
                           <div>
                             <CardTitle className="text-sm">In Meeting</CardTitle>
                           </div>
                         </CardHeader>
                         <CardContent>
                           <div className="text-xl font-semibold tabular-nums flex items-center gap-2">
                             <div className="h-4 w-4 text-purple-500">
                               <UsersIcon className="h-4 w-4" />
                             </div>
                             {getStatusCounts().inMeeting}
                           </div>
                         </CardContent>
                       </Card>

                       {/* In Event Card */}
                       <Card className="bg-white dark:bg-card min-w-[120px] flex-shrink-0">
                         <CardHeader className="space-y-0 pb-2">
                           <div>
                             <CardTitle className="text-sm">In Event</CardTitle>
                           </div>
                         </CardHeader>
                         <CardContent>
                           <div className="text-xl font-semibold tabular-nums flex items-center gap-2">
                             <div className="h-4 w-4 text-indigo-500">
                               <UsersIcon className="h-4 w-4" />
                             </div>
                             {getStatusCounts().inEvent}
                           </div>
                         </CardContent>
                       </Card>

                       {/* In Restroom Card */}
                       <Card className="bg-white dark:bg-card min-w-[120px] flex-shrink-0">
                         <CardHeader className="space-y-0 pb-2">
                           <div>
                             <CardTitle className="text-sm">In Restroom</CardTitle>
                           </div>
                         </CardHeader>
                         <CardContent>
                           <div className="text-xl font-semibold tabular-nums flex items-center gap-2">
                             <div className="h-4 w-4 text-yellow-500">
                               <UsersIcon className="h-4 w-4" />
                             </div>
                             {getStatusCounts().inRestroom}
                           </div>
                         </CardContent>
                       </Card>

                       {/* In Clinic Card */}
                       <Card className="bg-white dark:bg-card min-w-[120px] flex-shrink-0">
                         <CardHeader className="space-y-0 pb-2">
                           <div>
                             <CardTitle className="text-sm">In Clinic</CardTitle>
                           </div>
                         </CardHeader>
                         <CardContent>
                           <div className="text-xl font-semibold tabular-nums flex items-center gap-2">
                             <div className="h-4 w-4 text-orange-500">
                               <UsersIcon className="h-4 w-4" />
                             </div>
                             {getStatusCounts().inClinic}
                           </div>
                         </CardContent>
                       </Card>
                     </div>

                     <ActivityDataCard 
                       selectedEmployee={selectedEmployee ? {
                         ...selectedEmployee,
                         firstName: selectedEmployee.first_name || selectedEmployee.firstName || '',
                         lastName: selectedEmployee.last_name || selectedEmployee.lastName || ''
                       } : null}
                       formatTime={formatTime}
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
      </SidebarInset>
    </>
  )
}
