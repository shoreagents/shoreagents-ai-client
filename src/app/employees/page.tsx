"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import NumberFlow from '@number-flow/react'
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NewHires } from "@/components/interactive/cards/new-hires"
import { 
  UserIcon, 
  BuildingIcon, 
  PlusIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  TrendingUpIcon
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function EmployeesPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    departments: 0
  })

  // removed department filter state and memo

  // Fetch employees data without additional filters
  useEffect(() => {
    const fetchEmployees = async () => {
      console.log('🔍 Fetching employees for memberId:', user?.memberId)
      setError(null)
      setLoading(true)

      if (!user?.memberId && user?.userType !== 'Internal') {
        setError('User member ID not found')
        setLoading(false)
        return
      }

      try {
        const memberId = user.userType === 'Internal' ? 'all' : user.memberId
        const params = new URLSearchParams({ memberId: String(memberId) })

        const response = await fetch(`/api/team/employees?${params.toString()}`)
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch employees: ${response.status} ${errorText}`)
        }
        const data = await response.json()
        setEmployees(data.employees)
        setStats({ total: data.stats.total, departments: data.stats.departments })
      } catch (err) {
        console.error('❌ Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch employees')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchEmployees()
    }
  }, [user])

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
                      <h1 className="text-2xl font-bold">Employees</h1>
                      <p className="text-sm text-muted-foreground">
                        Manage your team members and their information.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Employee Directory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
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
                  <div className="text-center">
                    <p className="text-red-500 mb-4">Error: {error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                  </div>
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
                    <h1 className="text-2xl font-bold">Employees</h1>
                    <p className="text-sm text-muted-foreground">
                      Manage your team members and their information.
                    </p>
                  </div>
                </div>
              </div>

                {/* Stats Cards */}
                <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                  <Card className="@container/card relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 via-blue-400/5 to-transparent"></div>
                    <CardHeader className="relative">
                      <CardDescription>Total Employees</CardDescription>
                      <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                          {stats.total}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        All Team Members
                      </div>
                      <div className="text-muted-foreground text-xs">Complete employee directory.</div>
                    </CardFooter>
                  </Card>

                  <Card className="@container/card relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/10 via-orange-400/5 to-transparent"></div>
                    <CardHeader className="relative">
                      <CardDescription>Departments</CardDescription>
                      <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        <div className="flex items-center gap-2">
                          <BuildingIcon className="h-6 w-6 text-orange-600" />
                          {stats.departments}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Different Teams
                      </div>
                      <div className="text-muted-foreground text-xs">Organizational structure.</div>
                    </CardFooter>
                  </Card>

                  <NewHires employees={employees} />
                </div>

                {/* Employees Table */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Hire Date</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {employees.map((employee) => (
                            <TableRow key={employee.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                                    <AvatarFallback>
                                      {employee.firstName[0]}{employee.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{employee.position}</TableCell>
                              <TableCell>{employee.department}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 text-sm">
                                    <MailIcon className="h-3 w-3" />
                                    {employee.email}
                                  </div>
                                  {employee.phone && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <PhoneIcon className="h-3 w-3" />
                                      {employee.phone}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'N/A'}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex justify-center">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex items-center justify-center rounded-lg gap-0">
                                        <MoreHorizontalIcon className="h-4 w-4 flex-shrink-0" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32 p-0" align="end">
                                      <div className="flex flex-col p-1 space-y-1">
                                        <Button variant="ghost" size="sm" className="justify-start h-8 px-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                          <EyeIcon className="mr-2 h-4 w-4" />
                                          View
                                        </Button>
                                        <Button variant="ghost" size="sm" className="justify-start h-8 px-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                          <EditIcon className="mr-2 h-4 w-4" />
                                          Edit
                                        </Button>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
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
