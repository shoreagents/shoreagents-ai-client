"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MedalIcon, 
  AwardIcon,
  StarIcon,
  CrownIcon,
  CalendarIcon
} from "lucide-react"
import { IconArrowUp, IconArrowDown } from "@tabler/icons-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface LeaderboardEntry {
  id: number
  user_id: number
  first_name: string
  last_name: string
  email: string
  profile_picture: string | null
  department_name: string | null
  productivity_score: number
  total_active_seconds: number
  total_inactive_seconds: number
  total_seconds: number
  active_percentage: number
  rank: number
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Default month used for daily/weekly trend; timeframe selector removed but month selector kept
  const [timeframe] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly')
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const now = new Date()
    return now.getMonth() + 1
  })
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const now = new Date()
    return Math.max(now.getFullYear(), 2025)
  })
  const [monthYear, setMonthYear] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // Update monthYear when month or year changes
  useEffect(() => {
    setMonthYear(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`)
  }, [selectedMonth, selectedYear])

  // Daily trend types (from activity_data)
  interface DailyTopUser {
    user_id: number
    first_name: string
    last_name: string
    profile_picture: string | null
    points: number
  }
  interface DailyTrendPoint {
    date: string // YYYY-MM-DD
    total_active_seconds: number
    total_inactive_seconds: number
    top1?: DailyTopUser | null
    top2?: DailyTopUser | null
    top3?: DailyTopUser | null
    top4?: DailyTopUser | null
    top5?: DailyTopUser | null
  }

  const [trendDaily, setTrendDaily] = useState<DailyTrendPoint[]>([])
  const [trendLoading, setTrendLoading] = useState(false)
  const [trendError, setTrendError] = useState<string | null>(null)
  
  // Sorting state
  const [sortField, setSortField] = useState<'rank' | 'name' | 'points' | 'activeTime'>('rank')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Fetch productivity scores data
  useEffect(() => {
    const fetchProductivityScores = async () => {
      console.log('🔍 Fetching productivity scores for memberId:', user?.memberId)
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
        console.log('📡 Making API request to /api/productivity-scores')
        const memberId = user.userType === 'Internal' ? 'all' : user.memberId
        const params = new URLSearchParams({
          memberId: String(memberId),
          timeframe: timeframe
        })
        
        if (monthYear) {
          params.append('monthYear', monthYear)
        }
        
        const response = await fetch(`/api/productivity-scores?${params}`)
        
        console.log('📊 Response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.log('❌ API error:', errorText)
          throw new Error(`Failed to fetch productivity scores: ${response.status}`)
        }

        const data = await response.json()
        console.log('✅ Productivity scores data received:', data)
        
        setLeaderboardData(data.productivityScores)
        setError(null) // Clear any previous errors
      } catch (err) {
        console.error('❌ Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch productivity scores')
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if user is available
    if (user) {
      fetchProductivityScores()
    }
  }, [user, timeframe, monthYear])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <CrownIcon className="h-4 w-4 text-yellow-500" />
      case 2:
        return <MedalIcon className="h-4 w-4 text-gray-500" />
      case 3:
        return <AwardIcon className="h-4 w-4 text-amber-600" />
      case 4:
        return <StarIcon className="h-4 w-4 text-blue-500" />
      case 5:
        return <StarIcon className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🥇 1st</Badge>
      case 2:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">🥈 2nd</Badge>
      case 3:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">🥉 3rd</Badge>
      default:
        return <Badge variant="outline">#{rank}</Badge>
    }
  }



  const formatPoints = (seconds: number) => {
    return seconds.toLocaleString()
  }
  
  const formatActiveTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  // Sorting logic
  const handleSort = (field: 'rank' | 'name' | 'points' | 'activeTime') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: 'rank' | 'name' | 'points' | 'activeTime') => {
    if (sortField !== field) {
      return null
    }
    return sortDirection === 'asc' ? 
      <IconArrowUp className="h-4 w-4 text-primary" /> : 
      <IconArrowDown className="h-4 w-4 text-primary" />
  }

  const sortedLeaderboardData = [...leaderboardData].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case 'rank':
        aValue = a.rank
        bValue = b.rank
        break
      case 'name':
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase()
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase()
        break
      case 'points':
        aValue = a.total_active_seconds
        bValue = b.total_active_seconds
        break
      case 'activeTime':
        aValue = a.total_active_seconds
        bValue = b.total_active_seconds
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
  
  

  // Generate month options
  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ]

  // Generate year options from current year down to 2025
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const startYear = 2025
    const options = []
    for (let year = currentYear; year >= startYear; year--) {
      options.push({ value: year, label: year.toString() })
    }
    return options
  }

  const yearOptions = generateYearOptions()

  // Fetch daily trend (activity_data) for selected month
  useEffect(() => {
    const fetchDailyTrend = async () => {
      if (!user) return
      try {
        setTrendError(null)
        setTrendLoading(true)
        const memberId = user.userType === 'Internal' ? 'all' : user.memberId
        const params = new URLSearchParams({
          memberId: String(memberId),
          trend: 'daily',
          monthYear,
        })
        const res = await fetch(`/api/productivity-scores?${params}`)
        if (!res.ok) {
          throw new Error(`Failed to fetch daily trend: ${res.status}`)
        }
        const json = await res.json()
        setTrendDaily(Array.isArray(json.trendDaily) ? json.trendDaily : [])
      } catch (e) {
        setTrendError(e instanceof Error ? e.message : 'Failed to fetch daily trend')
        setTrendDaily([])
      } finally {
        setTrendLoading(false)
      }
    }
    fetchDailyTrend()
  }, [user, monthYear])

  // Selected month label helpers
  const selectedMonthDate = new Date(monthYear + '-01')
  const selectedMonthName = selectedMonthDate.toLocaleDateString('en-US', { month: 'long' })
  const selectedYearValue = selectedMonthDate.getFullYear()

  const chartConfig = {
    totalActive: {
      label: "Total Active Seconds",
      // Fixed light-mode color across themes
      color: "hsl(12 76% 61%)",
    },
  } satisfies ChartConfig

  // Daily data for chart (hide dates with no data)
  const dailyChartData = trendDaily.filter((d) =>
    (d.total_active_seconds ?? 0) > 0 || (d.total_inactive_seconds ?? 0) > 0
  )

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
                      <h1 className="text-2xl font-bold">Ranking</h1>
                      <p className="text-sm text-muted-foreground">
                        View team rankings based on productivity scores and activity metrics.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Loading skeleton */}
                <div className="px-4 lg:px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activity Rankings skeleton */}
                  <Card>
                    <CardHeader>
                        <CardTitle>
                          <Skeleton className="h-6 w-40" />
                        </CardTitle>
                        <CardDescription>
                          <Skeleton className="h-4 w-80 mt-2" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">
                                <Skeleton className="h-4 w-12" />
                              </TableHead>
                              <TableHead>
                                <Skeleton className="h-4 w-32" />
                              </TableHead>
                              <TableHead className="text-center">
                                <Skeleton className="h-4 w-16" />
                              </TableHead>
                              <TableHead className="text-center">
                                <Skeleton className="h-4 w-24" />
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                           <TableBody>
                             {Array.from({ length: 20 }).map((_, i) => (
                              <TableRow key={i} className={i < 3 ? "bg-muted/50" : ""}>
                                <TableCell className="font-medium">
                                  <Skeleton className="h-4 w-8" />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <div className="space-y-1">
                                      <Skeleton className="h-4 w-32" />
                                      <Skeleton className="h-3 w-20" />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Skeleton className="h-4 w-20" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Right column skeletons */}
                    <div>
                      {/* Top Performers skeleton */}
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-36" />
                          <Skeleton className="h-4 w-72 mt-2" />
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="relative">
                            {/* Month label skeleton */}
                            <Skeleton className="absolute left-6 bottom-4 h-5 w-24" />
                            {/* Podium skeleton */}
                            <div className="flex items-end justify-center gap-4 h-80">
                              {/* 2nd Place */}
                              <div className="flex flex-col items-center">
                                <div className="relative mb-2">
                                  <Skeleton className="h-16 w-16 rounded-full border-4 border-gray-300" />
                                  <Skeleton className="absolute -top-1 -right-1 h-6 w-6 rounded-full" />
                                </div>
                                <div className="text-center mb-2">
                                  <Skeleton className="h-4 w-20 mb-1" />
                                  <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="w-20 h-32 rounded-t-lg" />
                              </div>
                              {/* 1st Place */}
                              <div className="flex flex-col items-center">
                                <div className="relative mb-2">
                                  <Skeleton className="h-20 w-20 rounded-full border-4 border-yellow-400" />
                                  <Skeleton className="absolute -top-1 -right-1 h-6 w-6 rounded-full" />
                                </div>
                                <div className="text-center mb-2">
                                  <Skeleton className="h-4 w-24 mb-1" />
                                  <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="w-24 h-40 rounded-t-lg" />
                              </div>
                              {/* 3rd Place */}
                              <div className="flex flex-col items-center">
                                <div className="relative mb-2">
                                  <Skeleton className="h-16 w-16 rounded-full border-4 border-amber-600" />
                                  <Skeleton className="absolute -top-1 -right-1 h-6 w-6 rounded-full" />
                                </div>
                                <div className="text-center mb-2">
                                  <Skeleton className="h-4 w-20 mb-1" />
                                  <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="w-20 h-32 rounded-t-lg" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Daily Performance skeleton */}
                      <Card className="mt-6">
                        <CardHeader className="pb-0">
                          <Skeleton className="h-6 w-40" />
                          <Skeleton className="h-4 w-80 mt-2" />
                        </CardHeader>
                        <CardContent className="px-0 pt-4 sm:px-0 sm:pt-6">
                          <div className="relative">
                            {/* Chart area skeleton */}
                            <Skeleton className="h-[250px] w-full rounded" />
                            {/* Chart elements skeleton */}
                            <div className="absolute inset-0 flex flex-col justify-between p-4">
                              {/* Y-axis labels */}
                              <div className="flex flex-col justify-between h-full">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Skeleton key={i} className="h-3 w-8" />
                                ))}
                              </div>
                              {/* X-axis labels */}
                              <div className="flex justify-between mt-2">
                                {Array.from({ length: 7 }).map((_, i) => (
                                  <Skeleton key={i} className="h-3 w-8" />
                                ))}
                              </div>
                            </div>
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
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">Ranking</h1>
                      <p className="text-sm text-muted-foreground">
                        View team rankings based on productivity scores and activity metrics.
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
              {/* Removed empty spacer to eliminate extra top gap */}

              {/* Two Column Layout */}
              <div className="px-4 lg:px-6">
                {/* Single responsive header */}
                <div className="mb-4 lg:mb-6">
                  <h1 className="text-2xl font-bold">Ranking</h1>
                  <p className="text-sm text-muted-foreground">
                    View team rankings based on productivity scores and activity metrics.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Column 1: Activity Rankings */}
                  <div className="order-3 lg:order-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="">
                          <Table>
                            <TableHeader>
                              <TableRow variant="no-hover" className="h-12">
                                <TableHead 
                                  className={`w-16 cursor-pointer ${sortField === 'rank' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                  onClick={() => handleSort('rank')}
                                >
                                  <div className="flex items-center gap-1">
                                    Rank
                                    {sortField === 'rank' && getSortIcon('rank')}
                                  </div>
                                </TableHead>
                                <TableHead 
                                  className={`cursor-pointer ${sortField === 'name' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                  onClick={() => handleSort('name')}
                                >
                                  <div className="flex items-center gap-1">
                                    Team Member
                                    {sortField === 'name' && getSortIcon('name')}
                                  </div>
                                </TableHead>
                                <TableHead 
                                  className={`text-center cursor-pointer ${sortField === 'points' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                  onClick={() => handleSort('points')}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    Points
                                    {sortField === 'points' && getSortIcon('points')}
                                  </div>
                                </TableHead>
                                <TableHead 
                                  className={`text-center cursor-pointer ${sortField === 'activeTime' ? 'text-primary font-medium bg-accent/50' : ''}`}
                                  onClick={() => handleSort('activeTime')}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    Active Time
                                    {sortField === 'activeTime' && getSortIcon('activeTime')}
                                  </div>
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedLeaderboardData.map((entry, index) => (
                                <TableRow key={entry.id} className={`h-14 ${index < 3 ? "bg-muted/50" : ""}`}>
                                  <TableCell className="font-medium">
                                    <span className={`text-sm font-medium ${
                                      entry.rank === 1 ? 'text-yellow-500' :
                                      entry.rank === 2 ? 'text-gray-500' :
                                      entry.rank === 3 ? 'text-amber-600' :
                                      entry.rank === 4 ? 'text-blue-500' :
                                      entry.rank === 5 ? 'text-purple-500' :
                                      'text-muted-foreground'
                                    }`}>#{entry.rank}</span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={entry.profile_picture || undefined} alt={`${entry.first_name} ${entry.last_name}`} />
                                        <AvatarFallback>
                                          {entry.first_name?.[0]}{entry.last_name?.[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium flex items-center gap-2">
                                          {entry.first_name} {entry.last_name}
                                          {getRankIcon(entry.rank)}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <span className="font-mono text-sm">{formatPoints(entry.total_active_seconds)}</span>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <span className="font-mono text-sm">{formatActiveTime(entry.total_active_seconds)}</span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Column 2: Fixed-height period header + Top Performers, Daily Performance (sticky) */}
                  <div className="order-2 lg:order-2 lg:sticky lg:top-16 lg:self-start">
                    <div className="mb-4 min-h-[72px] flex w-full items-center justify-end gap-3 lg:justify-end">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {monthOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Top Performers */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            Top Performers
                          </CardTitle>
                          {/* Mobile month label (top-right) with same styling as old */}
                          <CardTitle className="lg:hidden flex items-center gap-2">
                            {selectedMonthName} {selectedYearValue}
                          </CardTitle>
                        </div>
                        <CardDescription>
                          Highlighting those who lead in activity and stay consistently engaged this month.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="relative">
                          {/* Removed decorative trophy image */}
                          
                          {/* Month label: desktop bottom-left */}
                          <CardTitle className="hidden lg:flex absolute left-6 bottom-4 items-center gap-2">
                            {selectedMonthName} {selectedYearValue}
                          </CardTitle>
                          
                          {/* Podium Base */}
                          <div className="flex items-end justify-center gap-4 h-80">
                            {/* 2nd Place Pillar */}
                            {leaderboardData[1] && (
                              <div className="flex flex-col items-center">
                                <div className="relative mb-2">
                                  <Avatar className="h-16 w-16 border-4 border-gray-300">
                                    <AvatarImage src={leaderboardData[1].profile_picture || undefined} />
                                    <AvatarFallback className="text-lg">
                                      {leaderboardData[1].first_name?.[0]}{leaderboardData[1].last_name?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                    2
                                  </div>
                                  <MedalIcon className="absolute -bottom-1 -right-1 h-5 w-5 text-gray-500 bg-white rounded-full p-0.5" />
                                </div>
                                <div className="text-center mb-2">
                                  <div className="font-semibold text-sm">
                                    {leaderboardData[1].first_name} {leaderboardData[1].last_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Points: {formatPoints(leaderboardData[1].total_active_seconds)}</div>
                                </div>
                                <div className="w-20 h-32 bg-gradient-to-t from-gray-400/20 to-gray-300/10 rounded-t-lg backdrop-blur-sm border border-gray-200/20"></div>
                              </div>
                            )}

                            {/* 1st Place Pillar */}
                            {leaderboardData[0] && (
                              <div className="flex flex-col items-center">
                                <div className="relative mb-2">
                                  <Avatar className="h-20 w-20 border-4 border-yellow-400">
                                    <AvatarImage src={leaderboardData[0].profile_picture || undefined} />
                                    <AvatarFallback className="text-xl">
                                      {leaderboardData[0].first_name?.[0]}{leaderboardData[0].last_name?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                    1
                                  </div>
                                  <CrownIcon className="absolute -bottom-1 -right-1 h-5 w-5 text-yellow-500 bg-white rounded-full p-0.5" />
                                </div>
                                <div className="text-center mb-2">
                                  <div className="font-bold text-sm">
                                    {leaderboardData[0].first_name} {leaderboardData[0].last_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Points: {formatPoints(leaderboardData[0].total_active_seconds)}</div>
                                </div>
                                <div className="w-24 h-40 bg-gradient-to-t from-yellow-400/20 to-yellow-300/10 rounded-t-lg backdrop-blur-sm border border-yellow-200/20"></div>
                              </div>
                            )}

                            {/* 3rd Place Pillar */}
                            {leaderboardData[2] && (
                              <div className="flex flex-col items-center">
                                <div className="relative mb-2">
                                  <Avatar className="h-16 w-16 border-4 border-amber-600">
                                    <AvatarImage src={leaderboardData[2].profile_picture || undefined} />
                                    <AvatarFallback className="text-lg">
                                      {leaderboardData[2].first_name?.[0]}{leaderboardData[2].last_name?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                    3
                                  </div>
                                  <AwardIcon className="absolute -bottom-1 -right-1 h-5 w-5 text-amber-700 bg-white rounded-full p-0.5" />
                                </div>
                                <div className="text-center mb-2">
                                  <div className="font-semibold text-sm">
                                    {leaderboardData[2].first_name} {leaderboardData[2].last_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Points: {formatPoints(leaderboardData[2].total_active_seconds)}</div>
                                </div>
                                <div className="w-20 h-32 bg-gradient-to-t from-amber-600/20 to-amber-500/10 rounded-t-lg backdrop-blur-sm border border-amber-400/20"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Productivity Trends Chart (Daily from activity_data) */}
                    <Card className="mt-6 @container/card">
                      <CardHeader className="relative pb-0">
                        <CardTitle className="flex items-center gap-2">
                          Daily Performance
                        </CardTitle>
                        <CardDescription>
                          <span className="@[540px]/card:block hidden">Track daily points for {selectedMonthName}—tap or hover to reveal the top 5 stars.</span>
                          <span className="@[540px]/card:hidden">Track daily points for {selectedMonthName}—tap or hover to reveal the top 5 stars.</span>
                        </CardDescription>
                        {/* No range toggle for daily chart; controlled by month selector above */}
                      </CardHeader>
                      <CardContent className="px-0 pt-4 sm:px-0 sm:pt-6">
                        {trendError && (
                          <div className="text-center text-sm text-destructive mb-2">{trendError}</div>
                        )}
                        {!trendLoading && !trendError && dailyChartData.length === 0 && (
                          <div className="text-center text-sm text-muted-foreground mb-2">No activity data for {monthYear}.</div>
                        )}
                        <div className="relative">
                        <ChartContainer
                          config={chartConfig}
                          className="aspect-auto h-[250px] w-full"
                        >
                            <AreaChart data={dailyChartData} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
                            <defs>
                          <linearGradient id="fillTotalActive" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                  offset="5%"
                              stopColor="var(--color-totalActive)"
                                  stopOpacity={1.0}
                                />
                                <stop
                                  offset="95%"
                              stopColor="var(--color-totalActive)"
                                  stopOpacity={0.1}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="date"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              minTickGap={32}
                              tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              }}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={
                                <ChartTooltipContent
                                  className="min-w-[16rem]"
                                  labelClassName="text-center w-full"
                                  labelFormatter={(value) => {
                                    const date = new Date(value)
                                    const dateText = date.toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                    return (
                                      <div className="flex w-full flex-col items-center">
                                        <span>{dateText}</span>
                                        <div className="h-px w-full bg-foreground/20 my-1" />
                                      </div>
                                    )
                                  }}
                                  indicator="dot"
                                  formatter={(val, name, item, _idx, point: any) => {
                                    const d = point as DailyTrendPoint
                                    return (
                                      <div className="flex w-full flex-col gap-1">
                                        <div className="flex w-full items-center justify-between text-muted-foreground">
                                          <span>Top</span>
                                          <span>Points</span>
                                        </div>
                                        {([1,2,3,4,5] as const).map((rank) => {
                                          const user = d?.[`top${rank}` as const] as DailyTopUser | null | undefined
                                          return (
                                            <div key={rank} className="flex w-full items-center justify-between">
                                              <span className="flex items-center gap-2">
                                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-muted text-[10px]">{rank}</span>
                                                {user ? `${user.first_name} ${user.last_name}` : '—'}
                                              </span>
                                              <span className="font-mono">{user?.points?.toLocaleString?.() || '—'}</span>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )
                                  }}
                                />
                              }
                            />
                            <Area
                              dataKey="total_active_seconds"
                              type="natural"
                              fill="url(#fillTotalActive)"
                              stroke="var(--color-totalActive)"
                              activeDot={{ r: 3 }}
                              stackId="a"
                            />
                          </AreaChart>
                        </ChartContainer>
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

