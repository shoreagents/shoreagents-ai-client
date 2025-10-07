"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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
  activity?: {
    today_active_seconds: number
    today_inactive_seconds: number
  }
}

interface ChartDataPoint {
  date: string
  active: number
  inactive: number
}

interface AgentActivityDataProps {
  selectedEmployee: Employee | null
  formatTime: (seconds: number) => string
  detailLoading: boolean
  getYesterdayActivityData: (employee: Employee) => { today_active_seconds: number; today_inactive_seconds: number }
  getWeekActivityData: (employee: Employee) => { total_active_seconds: number; total_inactive_seconds: number }
  getMonthActivityData: (employee: Employee) => { total_active_seconds: number; total_inactive_seconds: number }
  user: any
  chartDataCache: Record<string, ChartDataPoint[]>
  setChartDataCache: React.Dispatch<React.SetStateAction<Record<string, ChartDataPoint[]>>>
}

// Helper function to format dates consistently
const formatDateForDisplay = (dateString: string, format: 'short' | 'long' = 'short') => {
  if (!dateString || typeof dateString !== 'string') return 'No date available'
  
  // Handle both YYYY-MM-DD and ISO timestamp formats
  let date: Date
  if (dateString.includes('T') || dateString.includes('Z')) {
    // Full ISO timestamp format
    date = new Date(dateString)
  } else {
    // YYYY-MM-DD format - add time to avoid timezone issues
    date = new Date(dateString + 'T00:00:00')
  }
  
  if (isNaN(date.getTime())) return 'Invalid date' // Return meaningful message for invalid date
  
  if (format === 'long') {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }
}

export function AgentActivityData({ 
  selectedEmployee, 
  formatTime, 
  detailLoading,
  getYesterdayActivityData,
  getWeekActivityData,
  getMonthActivityData,
  user,
  chartDataCache,
  setChartDataCache
}: AgentActivityDataProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [chartLoading, setChartLoading] = useState(false)
  const [chartError, setChartError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const now = new Date()
    return Math.max(now.getFullYear(), 2025)
  })
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const now = new Date()
    return now.getMonth() + 1 // JavaScript months are 0-based
  })

  // Generate year options for dropdown
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const startYear = 2025
    const options = []
    
    // Generate years from current year down to 2025
    for (let year = currentYear; year >= startYear; year--) {
      options.push({ value: year.toString(), label: year.toString() })
    }
    
    return options
  }

  // Generate month options for dropdown
  const generateMonthOptions = () => {
    const months = [
      { value: "1", label: "January" },
      { value: "2", label: "February" },
      { value: "3", label: "March" },
      { value: "4", label: "April" },
      { value: "5", label: "May" },
      { value: "6", label: "June" },
      { value: "7", label: "July" },
      { value: "8", label: "August" },
      { value: "9", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" }
    ]
    
    return months
  }

  // Fetch chart data from API when employee is selected
  const fetchChartData = async (employeeId: string) => {
    if (!employeeId || !user) return

    setChartLoading(true)
    setChartError(null)

    try {
      // Get date range based on selected year and month
      const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1)
      const endOfMonth = new Date(selectedYear, selectedMonth, 0)
      
      const startDate = startOfMonth.toLocaleDateString('en-CA')
      const endDate = endOfMonth.toLocaleDateString('en-CA')
      
      // For IT users, fetch data for the specific employee
      // For Internal users, they can see all data but we need to filter by specific employee
      const memberId = user.userType === 'Internal' ? 'all' : (user.memberId || 'all')
      
      console.log('📊 Fetching chart data for date range:', startDate, 'to', endDate, 'memberId:', memberId, 'employeeId:', employeeId)

      // Fetch activities - the API will return activities for the memberId filtered by userId
      const response = await fetch(`/api/activities?memberId=${memberId}&userId=${employeeId}&startDate=${startDate}&endDate=${endDate}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch chart data: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('📊 Fetched chart data from API:', data)
      console.log('📊 API Response structure:', {
        hasActivities: 'activities' in data,
        activitiesType: typeof data.activities,
        activitiesLength: data.activities?.length,
        dateRange: data.dateRange,
        stats: data.stats
      })

      // Extract activities from API response (already filtered by userId in API)
      const activities = data.activities || []
      
      console.log('📊 Activities received for employee:', activities.length)
      console.log('📊 Employee ID:', employeeId, 'Type:', typeof employeeId)
      if (activities.length > 0) {
        console.log('📊 Sample activity structure:', activities[0])
      }

      // Check if there are any activities
      if (!Array.isArray(activities) || activities.length === 0) {
        console.log('📊 No activities found for this employee, setting empty chart data')
        setChartData([])
        return
      }

      // Process data for daily chart (only days with activity data)
      const generateDailyChartData = (activities: any[]) => {
        console.log('📊 Raw activities data:', activities)
        
        // Group activities by date
        const activitiesByDate = activities.reduce((acc, activity) => {
          const date = activity.today_date
          if (!date) {
            console.warn('⚠️ Activity missing today_date:', activity)
            return acc
          }
          
          if (!acc[date]) {
            acc[date] = []
          }
          acc[date].push(activity)
          return acc
        }, {} as Record<string, any[]>)

        console.log('📊 Activities grouped by date:', activitiesByDate)

        // Create chart data only for dates that have activity
        const chartData = Object.keys(activitiesByDate)
          .sort() // Sort dates chronologically
          .map(date => {
            const dayActivities = activitiesByDate[date]
            const totalActive = dayActivities.reduce((sum: number, a: any) => sum + (a?.today_active_seconds || 0), 0)
            const totalInactive = dayActivities.reduce((sum: number, a: any) => sum + (a?.today_inactive_seconds || 0), 0)
            
            console.log(`📊 Processing date ${date}:`, { totalActive, totalInactive })
            
            return {
              date,
              active: totalActive,
              inactive: totalInactive,
            }
          })
        
        return chartData
      }

      const chartData = generateDailyChartData(activities)
      console.log('📊 Chart data generated:', chartData.length, 'data points')
      
      // Store data in cache
      const cacheKey = `${employeeId}-${selectedYear}-${selectedMonth}`
      setChartDataCache(prevCache => ({
        ...prevCache,
        [cacheKey]: chartData
      }))
      
      setChartData(chartData)

    } catch (err) {
      console.error('❌ Chart data fetch error:', err)
      setChartError(err instanceof Error ? err.message : 'Failed to fetch chart data')
    } finally {
      setChartLoading(false)
    }
  }

  // Fetch chart data when employee is selected or month changes (with caching)
  useEffect(() => {
    if (selectedEmployee) {
      const employeeId = selectedEmployee.user_id || selectedEmployee.id
      const cacheKey = `${employeeId}-${selectedYear}-${selectedMonth}`
      
      // Check if data is already cached
      if (chartDataCache[cacheKey]) {
        console.log('📊 Using cached data for:', cacheKey)
        setChartData(chartDataCache[cacheKey])
        setChartLoading(false)
        setChartError(null)
      } else {
        console.log('📊 Fetching new data for:', cacheKey)
        fetchChartData(employeeId.toString())
      }
    }
  }, [selectedEmployee?.user_id || selectedEmployee?.id, user?.id, selectedYear, selectedMonth])



  const renderChartsContent = () => {
    if (!selectedEmployee) {
      return (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              Click on an employee to view their activity charts
            </div>
          </div>
        </div>
      )
    }

    const chartConfig = {
      active: {
        label: "Active Time",
        color: "hsl(12 76% 61%)",
      },
      inactive: {
        label: "Inactive Time", 
        color: "hsl(0 84% 60%)",
      },
    } satisfies ChartConfig

    // Calculate most active and most inactive times
    const calculatePeakTimes = () => {
      if (!chartData || chartData.length === 0) {
        return {
          mostActive: null,
          mostInactive: null
        }
      }

      let mostActive = chartData[0]
      let mostInactive = chartData[0]

      chartData.forEach(dataPoint => {
        if (dataPoint.active > mostActive.active) {
          mostActive = dataPoint
        }
        if (dataPoint.inactive > mostInactive.inactive) {
          mostInactive = dataPoint
        }
      })

      return {
        mostActive: mostActive.active > 0 ? mostActive : null,
        mostInactive: mostInactive.inactive > 0 ? mostInactive : null
      }
    }

    const peakTimes = calculatePeakTimes()

    if (chartLoading) {
      return (
        <div className="space-y-6">
          <div>
            <Card className="@container/card">
              <CardContent className="px-0 pt-4 sm:px-0 sm:pt-6">
                <div className="relative">
                  <Skeleton className="h-[250px] w-full rounded-none" />
                  {/* X-axis labels skeleton */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Skeleton key={i} className="h-3 w-8" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (chartError) {
      return (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="text-destructive">
              Error loading chart data: {chartError}
            </div>
          </div>
        </div>
      )
    }

    if (chartData.length === 0) {
      return (
        <div className="space-y-4">
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-muted-foreground/30 rounded-xl bg-muted/20">
            <p className="text-sm font-medium">No Activity Data</p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Monthly Activity Chart */}
        <div>
          <Card className="@container/card">
            <CardContent className="px-0 pt-4 sm:px-0 sm:pt-6">
              <div className="relative">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-active)" stopOpacity={1.0} />
                      <stop offset="95%" stopColor="var(--color-active)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillInactive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-inactive)" stopOpacity={1.0} />
                      <stop offset="95%" stopColor="var(--color-inactive)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => formatDateForDisplay(value, 'short')}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="min-w-[16rem]"
                        labelClassName="text-center w-full"
                          labelFormatter={(value) => {
                            const dateText = formatDateForDisplay(value, 'long')
                            // Check if formatting failed by looking for our error messages
                            if (dateText === 'No date available' || dateText === 'Invalid date') {
                              // If formatting failed, return original value with styling
                              return (
                                <div className="flex w-full flex-col items-center">
                                  <span>{value}</span>
                                  <div className="h-px w-full bg-foreground/20 my-1" />
                                </div>
                              )
                            }
                            return (
                              <div className="flex w-full flex-col items-center">
                                <span>{dateText}</span>
                                <div className="h-px w-full bg-foreground/20 my-1" />
                              </div>
                            )
                          }}
                        indicator="dot"
                        formatter={(val, name, item, _idx, point: any) => {
                          // Only render once for the first series (active) to avoid duplication
                          if (name !== 'active') return null
                          
                          const activeValue = point?.active || 0
                          const inactiveValue = point?.inactive || 0
                          const activeHours = Math.floor(activeValue / 3600)
                          const activeMinutes = Math.floor((activeValue % 3600) / 60)
                          const inactiveHours = Math.floor(inactiveValue / 3600)
                          const inactiveMinutes = Math.floor((inactiveValue % 3600) / 60)
                          
                          return (
                            <div className="flex w-full flex-col gap-1">
                              <div className="flex w-full items-center justify-between text-muted-foreground">
                                <span>Status</span>
                                <span>Time</span>
                              </div>
                              <div className="flex w-full items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                  Active
                                </span>
                                <span>
                                  {activeHours}h {activeMinutes}m
                                </span>
                              </div>
                              <div className="flex w-full items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                  Inactive
                                </span>
                                <span>
                                  {inactiveHours}h {inactiveMinutes}m
                                </span>
                              </div>
                            </div>
                          )
                        }}
                      />
                    }
                  />
                  <Area
                    dataKey="active"
                    type="natural"
                    fill="url(#fillActive)"
                    stroke="var(--color-active)"
                    stackId="a"
                  />
                  <Area
                    dataKey="inactive"
                    type="natural"
                    fill="url(#fillInactive)"
                    stroke="var(--color-inactive)"
                    stackId="a"
                  />
                </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    )
  }

  // Calculate most active and most inactive times (moved outside renderChartsContent)
  const calculatePeakTimes = () => {
    if (!chartData || chartData.length === 0) {
      return {
        mostActive: null,
        mostInactive: null
      }
    }

    let mostActive = chartData[0]
    let mostInactive = chartData[0]

    chartData.forEach(dataPoint => {
      if (dataPoint.active > mostActive.active) {
        mostActive = dataPoint
      }
      if (dataPoint.inactive > mostInactive.inactive) {
        mostInactive = dataPoint
      }
    })

    return {
      mostActive: mostActive.active > 0 ? mostActive : null,
      mostInactive: mostInactive.inactive > 0 ? mostInactive : null
    }
  }

  const peakTimes = calculatePeakTimes()

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* Left side - Activity totals */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-muted-foreground">Total Active Time:</span>
              <span className="text-sm font-semibold">
                {chartLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : chartData && chartData.length > 0 ? (
                  formatTime(chartData.reduce((sum, day) => sum + day.active, 0))
                ) : (
                  "0h 0m"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">Total Inactive Time:</span>
              <span className="text-sm font-semibold">
                {chartLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : chartData && chartData.length > 0 ? (
                  formatTime(chartData.reduce((sum, day) => sum + day.inactive, 0))
                ) : (
                  "0h 0m"
                )}
              </span>
            </div>
          </div>
          
          {/* Right side - Date filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Date:</span>
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {generateMonthOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {generateYearOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Tab Content */}
          {renderChartsContent()}
        </div>
      </CardContent>
      
      {/* Peak Times Summary - Outside tab content and padding container */}
      {(() => {
        // If no employee is selected, don't show peak cards
        if (!selectedEmployee) {
          return null
        }

        // Check if there's chart data available for the selected period
        const hasChartData = chartData && chartData.length > 0

        // Only show peak cards if there's chart data or if loading
        if (!hasChartData && !detailLoading && !chartLoading) {
          return null
        }

        return (
        <div className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* Most Active Time */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Most Active Time</h3>
                      <div className="text-sm text-muted-foreground">
                        {detailLoading || chartLoading ? (
                          <Skeleton className="h-4 w-32" />
                        ) : peakTimes.mostActive ? (
                          formatDateForDisplay(peakTimes.mostActive.date, 'long')
                        ) : (
                          "No data available"
                        )}
                      </div>
                    </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {detailLoading || chartLoading ? (
                        <Skeleton className="h-6 w-16" />
                      ) : peakTimes.mostActive ? (
                        formatTime(peakTimes.mostActive.active)
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Most Inactive Time */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    <svg className="h-7 w-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Most Inactive Time</h3>
                      <div className="text-sm text-muted-foreground">
                        {detailLoading || chartLoading ? (
                          <Skeleton className="h-4 w-32" />
                        ) : peakTimes.mostInactive ? (
                          formatDateForDisplay(peakTimes.mostInactive.date, 'long')
                        ) : (
                          "No data available"
                        )}
                      </div>
                    </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {detailLoading || chartLoading ? (
                        <Skeleton className="h-6 w-16" />
                      ) : peakTimes.mostInactive ? (
                        formatTime(peakTimes.mostInactive.inactive)
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )
      })()}
    </>
  )
}
