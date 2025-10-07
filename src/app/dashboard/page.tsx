"use client"

import { useState, useEffect } from "react"
import { UsersIcon, CoffeeIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { motion } from "framer-motion"

import { AppSidebar } from "@/components/app-sidebar"

import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { NewHires } from "@/components/interactive/cards/new-hires"
import { GrowthRateCard } from "@/components/interactive/cards/connect-globe"
import { ActivityRankings } from "@/components/interactive/cards/activity-rankings"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NoData } from "@/components/ui/no-data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


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
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [newHireStats, setNewHireStats] = useState<CountStats | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()
  const [isTalentPoolHovered, setIsTalentPoolHovered] = useState(false)
  const [jobRequests, setJobRequests] = useState<Array<{quote: string, name: string, title: string}>>([])
  const [jobRequestsLoading, setJobRequestsLoading] = useState(true)
  const [breaksData, setBreaksData] = useState<any>(null)
  const [anniversaryEmployees, setAnniversaryEmployees] = useState<Employee[]>([])
  const [anniversaryLoading, setAnniversaryLoading] = useState(true)

  const handleTalentPoolClick = () => {
    router.push('/talent-pool')
  }

  const handleJobsClick = () => {
    router.push('/job-request')
  }

  // Update current time every second for timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees and activities for inactive employees
        if (user) {
          const memberId = (user as any).userType === 'Internal' ? 'all' : (user as any).memberId
          console.log('Dashboard - User:', user)
          console.log('Dashboard - MemberId:', memberId)
          if (memberId) {
            // Fetch employees
            const employeesRes = await fetch(`/api/team/employees?memberId=${memberId}`)
            console.log('Dashboard - Employees response status:', employeesRes.status)
            if (employeesRes.ok) {
              const employeesJson = await employeesRes.json()
              console.log('Dashboard - Employees data:', employeesJson)
              setEmployees(employeesJson.employees || [])
            } else {
              console.error('Dashboard - Employees fetch failed:', employeesRes.status)
            }

            // Fetch activities to determine inactive employees
            const activitiesRes = await fetch(`/api/activities?memberId=${memberId}`)
            console.log('Dashboard - Activities response status:', activitiesRes.status)
            if (activitiesRes.ok) {
              const activitiesJson = await activitiesRes.json()
              console.log('Dashboard - Activities data:', activitiesJson)
              setActivities(activitiesJson.activities || [])
            } else {
              console.error('Dashboard - Activities fetch failed:', activitiesRes.status)
            }
            setActivitiesLoading(false)

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

            // Fetch job requests for dashboard (all jobs, not filtered by company)
            const jobRequestsRes = await fetch(`/api/dashboard/job-requests`)
            if (jobRequestsRes.ok) {
              const jobRequestsJson = await jobRequestsRes.json()
              setJobRequests(jobRequestsJson.jobs || [])
            } else {
              console.error('Dashboard - Job requests fetch failed:', jobRequestsRes.status)
              // Fallback to sample data if API fails
              setJobRequests([
                { quote: "Senior React Developer", name: "", title: "" },
                { quote: "DevOps Engineer", name: "", title: "" },
                { quote: "UI/UX Designer", name: "", title: "" },
                { quote: "Data Scientist", name: "", title: "" },
                { quote: "QA Engineer", name: "", title: "" },
                { quote: "Full Stack Developer", name: "", title: "" },
                { quote: "Product Manager", name: "", title: "" },
                { quote: "Backend Developer", name: "", title: "" },
                { quote: "Virtual Assistant", name: "", title: "" },
                { quote: "Executive Assistant", name: "", title: "" },
                { quote: "Administrative Assistant", name: "", title: "" },
                { quote: "Customer Service Rep", name: "", title: "" },
                { quote: "Social Media Manager", name: "", title: "" },
                { quote: "Content Writer", name: "", title: "" },
                { quote: "Bookkeeper", name: "", title: "" },
                { quote: "Project Coordinator", name: "", title: "" }
              ])
            }

            // Fetch breaks data
            const breaksRes = await fetch(`/api/breaks?memberId=${memberId}&date=${new Date().toISOString().split('T')[0]}`)
            if (breaksRes.ok) {
              const breaksJson = await breaksRes.json()
              setBreaksData(breaksJson)
            } else {
              console.error('Dashboard - Breaks fetch failed:', breaksRes.status)
            }

            // Fetch anniversary employees
            const anniversaryRes = await fetch(`/api/team/anniversary-employees?memberId=${memberId}`)
            if (anniversaryRes.ok) {
              const anniversaryJson = await anniversaryRes.json()
              setAnniversaryEmployees(anniversaryJson.employees || [])
            } else {
              console.error('Dashboard - Anniversary employees fetch failed:', anniversaryRes.status)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
        setJobRequestsLoading(false)
        setAnniversaryLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  // Calculate inactive employees count based on activity data
  const getInactiveEmployeesCount = () => {
    if (!activities.length) return 0
    
    const inactiveEmployees = employees.filter((employee: any) => {
      const activity = activities.find((a: any) => a.user_id.toString() === employee.id)
      if (!activity) return false
      
      // Inactive if not currently active
      if (activity.is_currently_active) return false
      
      // Inactive if has last session start but not currently active
      if (activity.last_session_start) return true
      
      // Inactive if no last session start
      return true
    })
    
    console.log('Dashboard - Inactive employees based on activity:', inactiveEmployees.length)
    return inactiveEmployees.length
  }

  // Get inactive employees for display
  const getInactiveEmployees = () => {
    if (!activities.length) return []
    
    return employees.filter((employee: any) => {
      const activity = activities.find((a: any) => a.user_id.toString() === employee.id)
      if (!activity) return false
      
      // Inactive if not currently active
      if (activity.is_currently_active) return false
      
      // Inactive if has last session start but not currently active
      if (activity.last_session_start) return true
      
      // Inactive if no last session start
      return true
    })
  }

  // Format elapsed time
  const getElapsedTime = (lastSessionStart: string) => {
    const inactiveTime = new Date(lastSessionStart)
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
                    <p className="text-sm text-muted-foreground">Overview of your system and metrics.</p>
                  </div>
                </div>
              </div>
                <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                  {/* 1. Salmon (2x2) - Inactive Employees */}
                  <Card className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1.5">
                          <CardTitle>Activity</CardTitle>
                          <CardDescription>Employees currently inactive.</CardDescription>
                        </div>
                        <div className="text-2xl font-semibold tabular-nums flex items-center gap-2 ml-4">
                          <div className="h-5 w-5 text-red-500">
                            <UsersIcon className="h-5 w-5" />
                          </div>
                          {loading || activitiesLoading ? (
                            <Skeleton className="h-8 w-8" />
                          ) : (
                            getInactiveEmployeesCount()
                          )}
                        </div>
                      </div>
                    </CardHeader>
                      <CardContent className="px-6 pb-6">
                        {loading || activitiesLoading ? (
                          // Skeleton loading states
                          <div className="space-y-2 pr-2">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <div key={index} className="flex items-center gap-3 rounded-lg bg-muted/50">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex-1 min-w-0">
                                  <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  <Skeleton className="h-3 w-12" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : getInactiveEmployees().length > 0 ? (
                          <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                            {getInactiveEmployees().map((employee: any) => {
                              const activity = activities.find((a: any) => a.user_id.toString() === employee.id)
                              const lastSessionStart = activity?.last_session_start
                              
                              return (
                                <div key={employee.id} className="flex items-center gap-3 rounded-lg bg-muted/50">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                                    <AvatarFallback>
                                      {employee.firstName?.[0]}{employee.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {employee.firstName} {employee.lastName}
                                    </p>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {lastSessionStart ? getElapsedTime(lastSessionStart) : 'Never'}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <NoData 
                            message="All Employees Are Active - No inactive employees at this time"
                          />
                        )}
                      </CardContent>
                  </Card>

                  {/* 2. Broccoli (1x1) - Closed */}
                  <NewHires employees={employees} className="lg:col-span-1 lg:row-span-1" loading={loading} />

                  {/* 3. Connect Globe (1x1) */}
                  <GrowthRateCard className="lg:col-span-1 lg:row-span-1 h-56" />


                  {/* 4. Pork (1x2) - Jobs */}
                  <Card 
                    className="lg:col-span-1 lg:row-span-2 flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={handleJobsClick}
                  >
                    <CardHeader>
                      <CardTitle>Jobs</CardTitle>
                      <CardDescription>View and manage job requests.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-2 p-0 justify-center">
                      <div className="w-full">
                        <InfiniteMovingCards
                          items={jobRequests.length > 0 ? jobRequests.slice(0, Math.ceil(jobRequests.length / 2)) : [
                            { quote: "Loading...", name: "", title: "" },
                            { quote: "Loading...", name: "", title: "" },
                            { quote: "Loading...", name: "", title: "" },
                            { quote: "Loading...", name: "", title: "" }
                          ]}
                          direction="left"
                          speed="very-slow"
                        />
                      </div>
                      <div className="w-full">
                        <InfiniteMovingCards
                          items={jobRequests.length > 0 ? jobRequests.slice(Math.ceil(jobRequests.length / 2)) : [
                            { quote: "Loading...", name: "", title: "" },
                            { quote: "Loading...", name: "", title: "" },
                            { quote: "Loading...", name: "", title: "" },
                            { quote: "Loading...", name: "", title: "" }
                          ]}
                          direction="left"
                          speed="very-slow"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* 5. Edamame (2x3) - Top 3 Performers */}
                  <ActivityRankings 
                    leaderboardData={leaderboardData} 
                    className="lg:col-span-2 lg:row-span-3"
                    loading={loading}
                  />

                  {/* 6. Tomato (2x2) - Breaks */}
                  <Card className="lg:col-span-2 lg:row-span-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1.5">
                          <CardTitle>Breaks</CardTitle>
                          <CardDescription>Employees currently on break.</CardDescription>
                        </div>
                        <div className="text-2xl font-semibold tabular-nums flex items-center gap-2 ml-4">
                          <div className="h-5 w-5 text-orange-500">
                            <CoffeeIcon className="h-5 w-5" />
                          </div>
                          {loading || !breaksData ? (
                            <Skeleton className="h-8 w-8" />
                          ) : breaksData?.breakSessions ? (
                            breaksData.breakSessions.length
                          ) : (
                            0
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      {loading || !breaksData ? (
                        // Skeleton loading states
                        <div className="space-y-2 pr-2">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-3 rounded-lg bg-muted/50">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <div className="flex-1 min-w-0">
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <Skeleton className="h-3 w-12" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : breaksData?.breakSessions?.length > 0 ? (
                        <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                          {breaksData.breakSessions.map((breakSession: any) => (
                            <div key={breakSession.id} className="flex items-center gap-3 rounded-lg bg-muted/50">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={breakSession.profile_picture} alt={`${breakSession.first_name} ${breakSession.last_name}`} />
                                <AvatarFallback>
                                  {breakSession.first_name?.[0]}{breakSession.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {breakSession.first_name} {breakSession.last_name}
                                </p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {breakSession.break_type ? `${breakSession.break_type} Break` : 'Break'}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <NoData 
                          message="No Breaks Taken Today - All employees are currently working"
                        />
                      )}
                    </CardContent>
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
                      <CardDescription>Discover skilled candidates for your team.</CardDescription>
                    </CardHeader>
                    <div className="absolute bottom-0 left-0 right-0 h-[100px]">
                      <div className="relative flex h-full w-full items-end justify-center pb-4">
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
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': '30s', '--radius': '74px', '--angle': '0deg', '--icon-size': '24px'} as React.CSSProperties}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Anne.jpg" alt="Anne" />
                              <AvatarFallback className="text-xs">A</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': '30s', '--radius': '74px', '--angle': '120deg', '--icon-size': '24px'} as React.CSSProperties}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Arelle.jpg" alt="Arelle" />
                              <AvatarFallback className="text-xs">Ar</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': '30s', '--radius': '74px', '--angle': '240deg', '--icon-size': '24px'} as React.CSSProperties}>
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
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full" style={{'--duration': '60s', '--radius': '104px', '--angle': '0deg', '--icon-size': '24px'} as React.CSSProperties}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Joshua.jpg" alt="Joshua" />
                              <AvatarFallback className="text-xs">Jo</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full" style={{'--duration': '60s', '--radius': '104px', '--angle': '120deg', '--icon-size': '24px'} as React.CSSProperties}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Kevin.jpg" alt="Kevin" />
                              <AvatarFallback className="text-xs">K</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full" style={{'--duration': '60s', '--radius': '104px', '--angle': '240deg', '--icon-size': '24px'} as React.CSSProperties}>
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
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': '60s', '--radius': '134px', '--angle': '0deg', '--icon-size': '24px'} as React.CSSProperties}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Lovell.jpg" alt="Lovell" />
                              <AvatarFallback className="text-xs">L</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': '60s', '--radius': '134px', '--angle': '120deg', '--icon-size': '24px'} as React.CSSProperties}>
                          <div style={{opacity: 1, transform: 'none'}}>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/talent-pool/Naomi.jpg" alt="Naomi" />
                              <AvatarFallback className="text-xs">N</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="absolute flex size-[var(--icon-size)] z-20 p-1 transform-gpu animate-orbit items-center justify-center rounded-full [animation-direction:reverse]" style={{'--duration': '60s', '--radius': '134px', '--angle': '240deg', '--icon-size': '24px'} as React.CSSProperties}>
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

                </div>
              {/* Removed Total Visitors section */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
