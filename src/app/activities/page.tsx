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
  
  
  // Sorting
  const [sortField, setSortField] = useState<'name' | 'status' | 'activeTime' | 'inactiveTime'>('activeTime')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

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

  const getActivityStatus = (isActive: boolean, lastSessionStart: string | null, hasActivityData: boolean, updatedAt: string) => {
    if (!hasActivityData) {
      return <span className="text-muted-foreground text-sm">-</span>
    }
    
    if (isActive) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    }
    if (lastSessionStart) {
      const lastActive = new Date(lastSessionStart)
      const now = new Date()
      const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60))
      
      if (diffMinutes < 5) {
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Recently Active</Badge>
      } else if (diffMinutes < 60) {
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Away</Badge>
      } else {
        return (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
              </TooltipTrigger>
              <TooltipContent className="w-auto">
                <div className="space-y-2">
                  <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
                    <span>Last Active:</span>
                    <div className="space-y-1">
                      <div className="font-bold">
                        Local: {formatTimeOnlyLocal(updatedAt)}
                      </div>
                      <div className="font-bold text-muted-foreground">
                        PH: {formatTimeOnly(updatedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
                    <span>Elapse Time:</span>
                    <span className="font-bold">{getElapsedTime(updatedAt)}</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
    }
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
          </TooltipTrigger>
          <TooltipContent className="w-auto">
            <div className="space-y-2">
              <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
                <span>Last Active:</span>
                <div className="space-y-1">
                  <div className="font-bold">
                    Local: {formatTimeOnlyLocal(updatedAt)}
                  </div>
                  <div className="font-bold text-muted-foreground">
                    PH: {formatTimeOnly(updatedAt)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
                <span>Elapse Time:</span>
                <span className="font-bold">{getElapsedTime(updatedAt)}</span>
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
      department_name: employee.department
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
          department_name: employee.department
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
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case 'name':
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
        break
      case 'status':
        // Sort by status priority: Active > Recently Active > Away > Inactive > Unknown
        const getStatusPriority = (employee: any) => {
          if (!employee.hasActivityData) return 5 // Unknown
          if (employee.activity.is_currently_active) return 1 // Active
          if (employee.activity.last_session_start) {
            const lastActive = new Date(employee.activity.last_session_start)
            const now = new Date()
            const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60))
            if (diffMinutes < 5) return 2 // Recently Active
            if (diffMinutes < 60) return 3 // Away
            return 4 // Inactive
          }
          return 4 // Inactive
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

  if (loading) {
    return (
      <>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col py-4 md:py-6">
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
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                  </div>
                                </TableHead>
                                {[...Array(5)].map((_, i) => (
                                  <TableHead key={i} className="text-center w-32">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div>
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[...Array(8)].map((_, i) => (
                                <TableRow key={i} className="h-14">
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                    </div>
                                  </TableCell>
                                  {[...Array(5)].map((_, j) => (
                                    <TableCell key={j} className="text-center">
                                      <div className="h-6 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
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
                        {[...Array(4)].map((_, i) => (
                          <Card key={i} className="bg-white dark:bg-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                              <div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                                <div className="text-2xl font-semibold tabular-nums flex items-center gap-2 mt-2">
                                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                  <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                                </div>
                              </div>
                              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                            </CardHeader>
                          </Card>
                        ))}
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
                <h1 className="text-2xl font-bold">Activities</h1>
                <p className="text-sm text-muted-foreground">
                  Track user activities and productivity metrics by date.
                </p>
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
                                  className={`text-center cursor-pointer w-32 ${sortField === 'status' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                  onClick={() => handleSort('status')}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    Status
                                    {sortField === 'status' && getSortIcon('status')}
                                  </div>
                                </TableHead>
                                <TableHead 
                                  className={`text-center cursor-pointer w-32 ${sortField === 'activeTime' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                  onClick={() => handleSort('activeTime')}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    Active Time
                                    {sortField === 'activeTime' && getSortIcon('activeTime')}
                                  </div>
                                </TableHead>
                                <TableHead 
                                  className={`text-center cursor-pointer w-32 ${sortField === 'inactiveTime' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                  onClick={() => handleSort('inactiveTime')}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    Inactive Time
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
                                    {getActivityStatus(employee.activity.is_currently_active, employee.activity.last_session_start, employee.hasActivityData, employee.activity.updated_at)}
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
                      <Card className="bg-white dark:bg-card">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-base">
                                    {selectedEmployee ? `${selectedEmployee.firstName}'s Activity Data` : 'Select an employee'}
                                  </CardTitle>
                                  <CardDescription>Activity breakdown across different time periods</CardDescription>
                                </div>
                                {selectedEmployee && (
                                  <div className="ml-4">
                                    {getActivityStatus(selectedEmployee.activity.is_currently_active, selectedEmployee.activity.last_session_start, selectedEmployee.hasActivityData, selectedEmployee.activity.updated_at)}
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              {selectedEmployee ? (
                                <div className="space-y-4">
                                  {/* Today - Always available, no loading state needed */}
                                  <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-2">Today</div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <Card className="bg-muted/50 dark:bg-muted/20 border-border">
                                        <CardContent className="p-3">
                                          <div className="flex items-center gap-2">
                                            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Active</span>
                                          </div>
                                          <div className="text-lg font-semibold tabular-nums mt-1">
                                            {formatTime(selectedEmployee.activity.today_active_seconds)}
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card className="bg-muted/50 dark:bg-muted/20 border-border">
                                        <CardContent className="p-3">
                                          <div className="flex items-center gap-2">
                                            <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Inactive</span>
                                          </div>
                                          <div className="text-lg font-semibold tabular-nums mt-1">
                                            {formatTime(selectedEmployee.activity.today_inactive_seconds)}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                  
                                  {/* Yesterday */}
                                  <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-2">Yesterday</div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <Card className="bg-muted/50 dark:bg-muted/20 border-border">
                                        <CardContent className="p-3">
                                          <div className="flex items-center gap-2">
                                            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Active</span>
                                          </div>
                                          <div className="text-lg font-semibold tabular-nums mt-1">
                                            {detailLoading ? (
                                              <Skeleton className="h-6 w-16" />
                                            ) : (
                                              formatTime(getYesterdayActivityData(selectedEmployee).today_active_seconds)
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card className="bg-muted/50 dark:bg-muted/20 border-border">
                                        <CardContent className="p-3">
                                          <div className="flex items-center gap-2">
                                            <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Inactive</span>
                                          </div>
                                          <div className="text-lg font-semibold tabular-nums mt-1">
                                            {detailLoading ? (
                                              <Skeleton className="h-6 w-16" />
                                            ) : (
                                              formatTime(getYesterdayActivityData(selectedEmployee).today_inactive_seconds)
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                  
                                  {/* This Week */}
                                  <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-2">This Week</div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <Card className="bg-muted/50 dark:bg-muted/20 border-border">
                                        <CardContent className="p-3">
                                          <div className="flex items-center gap-2">
                                            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Active</span>
                                          </div>
                                          <div className="text-lg font-semibold tabular-nums mt-1">
                                            {detailLoading ? (
                                              <Skeleton className="h-6 w-16" />
                                            ) : (
                                              formatTime(getWeekActivityData(selectedEmployee).total_active_seconds)
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card className="bg-muted/50 dark:bg-muted/20 border-border">
                                        <CardContent className="p-3">
                                          <div className="flex items-center gap-2">
                                            <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Inactive</span>
                                          </div>
                                          <div className="text-lg font-semibold tabular-nums mt-1">
                                            {detailLoading ? (
                                              <Skeleton className="h-6 w-16" />
                                            ) : (
                                              formatTime(getWeekActivityData(selectedEmployee).total_inactive_seconds)
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                  
                                  {/* This Month */}
                                  <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-2">This Month</div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <Card className="bg-muted/50 dark:bg-muted/20 border-border">
                                        <CardContent className="p-3">
                                          <div className="flex items-center gap-2">
                                            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Active</span>
                                          </div>
                                          <div className="text-lg font-semibold tabular-nums mt-1">
                                            {detailLoading ? (
                                              <Skeleton className="h-6 w-16" />
                                            ) : (
                                              formatTime(getMonthActivityData(selectedEmployee).total_active_seconds)
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card className="bg-muted/50 dark:bg-muted/20 border-border">
                                        <CardContent className="p-3">
                                          <div className="flex items-center gap-2">
                                            <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Inactive</span>
                                          </div>
                                          <div className="text-lg font-semibold tabular-nums mt-1">
                                            {detailLoading ? (
                                              <Skeleton className="h-6 w-16" />
                                            ) : (
                                              formatTime(getMonthActivityData(selectedEmployee).total_inactive_seconds)
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <div className="text-2xl font-semibold tabular-nums flex items-center justify-center gap-2">
                                    <ActivityIcon className="h-5 w-5" />
                                    0h 0m
                                  </div>
                                </div>
                              )}
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
