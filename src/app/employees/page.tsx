"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import NumberFlow from '@number-flow/react'
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
  TrendingUpIcon,
  SearchIcon
} from "lucide-react"
import { IconArrowUp, IconArrowDown, IconArrowsSort } from "@tabler/icons-react"
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { ReloadButton } from "@/components/ui/reload-button"

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

export default function EmployeesPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    departments: 0
  })
  const [reloading, setReloading] = useState(false)

  // Sort state
  const [sortField, setSortField] = useState<keyof Employee | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // removed department filter state and memo

  // Sort function
  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1) // Reset to first page when sorting
  }

  // Get sort icon for a field
  const getSortIcon = (field: keyof Employee) => {
    if (sortField !== field) {
      return null
    }
    return sortDirection === 'asc' 
      ? <IconArrowUp className="h-4 w-4 text-primary" />
      : <IconArrowDown className="h-4 w-4 text-primary" />
  }

  // Remove client-side filtering since it's now server-side
  const displayedEmployees = employees

  // Fetch employees data with pagination and search
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
      const params = new URLSearchParams({ 
        memberId: String(memberId),
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })

      // Add search parameter if there's a search query
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }

      // Add sort parameters if sorting is active
      if (sortField) {
        params.append('sortField', sortField)
        params.append('sortDirection', sortDirection)
      }

      const response = await fetch(`/api/team/employees?${params.toString()}`)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch employees: ${response.status} ${errorText}`)
      }
      const data = await response.json()
      
      // Handle paginated response
      if (data.employees && data.pagination) {
        setEmployees(data.employees)
        setTotalCount(data.pagination.totalCount)
        setTotalPages(data.pagination.totalPages)
        setStats({ total: data.stats.total, departments: data.stats.departments })
      } else {
        // Fallback for non-paginated response
        setEmployees(data.employees || data)
        setTotalCount(data.employees?.length || data.length)
        setTotalPages(Math.ceil((data.employees?.length || data.length) / itemsPerPage))
        setStats({ total: data.stats?.total || data.length, departments: data.stats?.departments || 0 })
      }
    } catch (err) {
      console.error('❌ Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchEmployees()
    }
  }, [user])

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Debounced search and pagination effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        fetchEmployees()
      }
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchQuery, currentPage, sortField, sortDirection])

  // Reload function
  const handleReload = async () => {
    setReloading(true)
    try {
      await fetchEmployees()
    } catch (err) {
      console.error('❌ Reload error:', err)
    } finally {
      setReloading(false)
    }
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
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold">Employees</h1>
                        <p className="text-sm text-muted-foreground">
                          Manage your team members and their information.
                        </p>
                      </div>
                      <ReloadButton 
                        loading={reloading} 
                        onReload={handleReload}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
                  <Card className="@container/card">
                    <CardHeader>
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
                        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    </CardFooter>
                  </Card>

                  <Card className="@container/card">
                    <CardHeader>
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
                        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    </CardFooter>
                  </Card>

                  <Card className="@container/card">
                    <CardHeader>
                      <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
                        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    </CardFooter>
                  </Card>
                </div>

                {/* Search Section Skeleton */}
                <div className="px-4 lg:px-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>

                {/* Table Skeleton */}
                <div className="px-4 lg:px-6">
                  <Card className="overflow-hidden">
                    <div className="border-b">
                      <div className="h-12 flex items-center px-4">
                        <div className="flex-1 grid grid-cols-5 gap-4">
                          <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                          <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                          <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                          <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                          <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-16 flex items-center px-4">
                          <div className="flex-1 grid grid-cols-5 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
                              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                            </div>
                            <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                            <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                            <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                            <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  {/* Pagination Skeleton */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">Employees</h1>
                      <p className="text-sm text-muted-foreground">
                        Manage your team members and their information.
                      </p>
                    </div>
                    <ReloadButton 
                      loading={reloading} 
                      onReload={handleReload}
                    />
                  </div>
                </div>
              </div>

                {/* Stats Cards */}
                <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
                  <Card className="@container/card">
                    <CardHeader>
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

                  <Card className="@container/card">
                    <CardHeader>
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

                {/* Search Section */}
                <div className="px-4 lg:px-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees by name, email, position, department, or phone..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {searchQuery && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--sidebar-background))] rounded-lg border">
                        <div className="text-sm font-medium text-muted-foreground">Results:</div>
                        <div className="text-sm font-semibold text-sidebar-accent-foreground">
                          {totalCount} employees found
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Employees Table */}
                <div className="px-4 lg:px-6">
                  <Card className="overflow-hidden">
                    <Table>
                        <TableHeader>
                          <TableRow variant="no-hover">
                            <TableHead 
                              onClick={() => handleSort('firstName')} 
                              className={`cursor-pointer ${sortField === 'firstName' ? 'text-primary font-medium bg-accent/50' : ''}`}
                            >
                              <div className="flex items-center gap-1">
                                Name
                                {getSortIcon('firstName')}
                              </div>
                            </TableHead>
                            <TableHead 
                              onClick={() => handleSort('position')} 
                              className={`cursor-pointer ${sortField === 'position' ? 'text-primary font-medium bg-accent/50' : ''}`}
                            >
                              <div className="flex items-center gap-1">
                                Position
                                {getSortIcon('position')}
                              </div>
                            </TableHead>
                            <TableHead 
                              onClick={() => handleSort('department')} 
                              className={`cursor-pointer ${sortField === 'department' ? 'text-primary font-medium bg-accent/50' : ''}`}
                            >
                              <div className="flex items-center gap-1">
                                Department
                                {getSortIcon('department')}
                              </div>
                            </TableHead>
                            <TableHead 
                              onClick={() => handleSort('email')} 
                              className={`cursor-pointer ${sortField === 'email' ? 'text-primary font-medium bg-accent/50' : ''}`}
                            >
                              <div className="flex items-center gap-1">
                                Contact
                                {getSortIcon('email')}
                              </div>
                            </TableHead>
                            <TableHead 
                              onClick={() => handleSort('hireDate')} 
                              className={`cursor-pointer ${sortField === 'hireDate' ? 'text-primary font-medium bg-accent/50' : ''}`}
                            >
                              <div className="flex items-center gap-1">
                                Hire Date
                                {getSortIcon('hireDate')}
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedEmployees.map((employee) => (
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
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                  </Card>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} Employees
                      </div>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(prev => Math.max(prev - 1, 1))
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setCurrentPage(page)
                                }}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(prev => Math.min(prev + 1, totalPages))
                              }}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </>
    )
  }
