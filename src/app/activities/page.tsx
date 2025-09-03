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
  ArrowDown,
  FilterIcon
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

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
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Date filtering
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'custom'>('today')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  
  // Sorting
  const [sortField, setSortField] = useState<'date' | 'name' | 'activeTime' | 'inactiveTime'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Get date range based on filter
  const getDateRange = () => {
    const today = new Date()
    const todayISO = today.toISOString().split('T')[0]
    
    switch (dateFilter) {
      case 'today':
        return { startDate: todayISO, endDate: todayISO }
      case 'week':
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - 7)
        return { startDate: weekStart.toISOString().split('T')[0], endDate: todayISO }
      case 'month':
        const monthStart = new Date(today)
        monthStart.setDate(today.getDate() - 30)
        return { startDate: monthStart.toISOString().split('T')[0], endDate: todayISO }
      case 'custom':
        return { startDate: customStartDate, endDate: customEndDate }
      default:
        return { startDate: todayISO, endDate: todayISO }
    }
  }

  // Fetch activities data
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return
      
      setLoading(true)
      setError(null)
      
      try {
        const { startDate, endDate } = getDateRange()
        const memberId = user.userType === 'Internal' ? 'all' : user.memberId
        
        const params = new URLSearchParams({
          memberId: String(memberId),
          startDate,
          endDate
        })
        
        const response = await fetch(`/api/activities?${params}`)
        
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
  }, [user, dateFilter, customStartDate, customEndDate])

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

  const getActivityStatus = (isActive: boolean, lastSessionStart: string | null) => {
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
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>
      }
    }
    return <Badge variant="outline">Unknown</Badge>
  }

  // Sorting logic
  const handleSort = (field: 'date' | 'name' | 'activeTime' | 'inactiveTime') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (field: 'date' | 'name' | 'activeTime' | 'inactiveTime') => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-foreground" /> : 
      <ArrowDown className="h-4 w-4 text-foreground" />
  }

  const sortedActivities = [...activities].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case 'date':
        aValue = new Date(a.today_date).getTime()
        bValue = new Date(b.today_date).getTime()
        break
      case 'name':
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase()
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase()
        break
      case 'activeTime':
        aValue = a.today_active_seconds
        bValue = b.today_active_seconds
        break
      case 'inactiveTime':
        aValue = a.today_inactive_seconds
        bValue = b.today_inactive_seconds
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
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">Activities</h1>
                      <p className="text-sm text-muted-foreground">
                        Track user activities and productivity metrics by date.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Loading skeleton */}
                <div className="px-4 lg:px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <Skeleton className="h-4 w-20" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-8 w-16" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Array.from({ length: 6 }).map((_, i) => (
                              <TableHead key={i}>
                                <Skeleton className="h-4 w-20" />
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 10 }).map((_, i) => (
                            <TableRow key={i}>
                              {Array.from({ length: 6 }).map((_, j) => (
                                <TableCell key={j}>
                                  <Skeleton className="h-4 w-24" />
                                </TableCell>
                              ))}
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
                      <h1 className="text-2xl font-bold">Activities</h1>
                      <p className="text-sm text-muted-foreground">
                        Track user activities and productivity metrics by date.
                      </p>
                    </div>
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
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">Activities</h1>
                    <p className="text-sm text-muted-foreground">
                      Track user activities and productivity metrics by date.
                    </p>
                  </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <UsersIcon className="h-4 w-4" />
                          Total Users
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.total_users}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Total Days
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.total_days}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <ActivityIcon className="h-4 w-4" />
                          Avg Active Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatTime(stats.avg_active_seconds || 0)}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <ClockIcon className="h-4 w-4" />
                          Total Active Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatTime(stats.total_active_seconds || 0)}</div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Filters */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FilterIcon className="h-5 w-5" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor="dateFilter">Date Range</Label>
                        <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">Last 30 Days</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {dateFilter === 'custom' && (
                        <>
                          <div className="flex-1">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={customStartDate}
                              onChange={(e) => setCustomStartDate(e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Activities Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Data</CardTitle>
                    <CardDescription>
                      Showing {activities.length} activity records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('date')}
                          >
                            <div className="flex items-center gap-1">
                              Date
                              {getSortIcon('date')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center gap-1">
                              User
                              {getSortIcon('name')}
                            </div>
                          </TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead 
                            className="text-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('activeTime')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              Active Time
                              {getSortIcon('activeTime')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('inactiveTime')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              Inactive Time
                              {getSortIcon('inactiveTime')}
                            </div>
                          </TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedActivities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">
                              {formatDate(activity.today_date)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={activity.profile_picture || undefined} alt={`${activity.first_name} ${activity.last_name}`} />
                                  <AvatarFallback>
                                    {activity.first_name?.[0]}{activity.last_name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {activity.first_name} {activity.last_name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {activity.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {activity.department_name || 'N/A'}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="font-mono text-sm">{formatTime(activity.today_active_seconds)}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="font-mono text-sm">{formatTime(activity.today_inactive_seconds)}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              {getActivityStatus(activity.is_currently_active, activity.last_session_start)}
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
