"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ReloadButton } from "@/components/ui/reload-button"
import { IconSearch, IconHistory, IconChevronLeft, IconChevronRight, IconArrowUp, IconArrowDown, IconArrowsSort, IconFilter, IconCalendar, IconClock } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useAuth } from "@/contexts/auth-context"


type TicketStatus = 'On Hold' | 'In Progress' | 'Approved' | 'Stuck' | 'Actioned' | 'Closed'
interface TicketCategory {
  id: number
  name: string
}

interface Ticket {
  id: number
  ticket_id: string
  user_id: number
  concern: string
  details: string | null
  category: string
  category_id: number | null
  category_name?: string
  status: TicketStatus
  position: number
  resolved_by: number | null
  resolved_at: string | null
  created_at: string
  updated_at: string
  role_id: number | null
  station_id: string | null
  profile_picture: string | null
  first_name: string | null
  last_name: string | null
  resolver_first_name?: string
  resolver_last_name?: string
}

function PastTicketsTable({ tickets, onSort, sortField, sortDirection, currentUser }: { 
  tickets: Ticket[]
  onSort: (field: string) => void
  sortField: string
  sortDirection: 'asc' | 'desc'
  currentUser: any
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    return (
      <div className="flex items-center gap-1">
        <IconCalendar className="h-4 w-4" />
        <span>{dateStr}</span>
        <span className="text-muted-foreground/70">•</span>
        <IconClock className="h-4 w-4" />
        <span>{timeStr}</span>
      </div>
    )
  }

  const getStatusDisplayLabel = (status: string) => {
    return status
  }

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Computer & Equipment': 'bg-blue-100 text-blue-800',
      'Network & Internet': 'bg-cyan-100 text-cyan-800',
      'Station': 'bg-purple-100 text-purple-800',
      'Surroundings': 'bg-green-100 text-green-800',
      'Schedule': 'bg-yellow-100 text-yellow-800',
      'Compensation': 'bg-orange-100 text-orange-800',
      'Transport': 'bg-indigo-100 text-indigo-800',
      'Suggestion': 'bg-pink-100 text-pink-800',
      'Check-in': 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge variant="secondary" className={`text-xs ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </Badge>
    )
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => onSort('ticket_id')} className={`cursor-pointer hover:bg-accent transition-colors ${sortField === 'ticket_id' ? 'text-primary font-medium bg-accent/50' : ''}`}>
              <div className="flex items-center gap-1">
                Ticket ID
                {sortField === 'ticket_id' && (
                  sortDirection === 'asc' ? 
                    <IconArrowUp className="h-4 w-4 text-primary" /> : 
                    <IconArrowDown className="h-4 w-4 text-primary" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => onSort('category_name')} className={`cursor-pointer hover:bg-accent transition-colors ${sortField === 'category_name' ? 'text-primary font-medium bg-accent/50' : ''}`}>
              <div className="flex items-center gap-1">
                Category
                {sortField === 'category_name' && (
                  sortDirection === 'asc' ? 
                    <IconArrowUp className="h-4 w-4 text-primary" /> : 
                    <IconArrowDown className="h-4 w-4 text-primary" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => onSort('first_name')} className={`cursor-pointer hover:bg-accent transition-colors ${sortField === 'first_name' ? 'text-primary font-medium bg-accent/50' : ''}`}>
              <div className="flex items-center gap-1">
                User
                {sortField === 'first_name' && (
                  sortDirection === 'asc' ? 
                    <IconArrowUp className="h-4 w-4 text-primary" /> : 
                    <IconArrowDown className="h-4 w-4 text-primary" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => onSort('concern')} className={`cursor-pointer hover:bg-accent transition-colors ${sortField === 'concern' ? 'text-primary font-medium bg-accent/50' : ''}`}>
              <div className="flex items-center gap-1">
                Concern
                {sortField === 'concern' && (
                  sortDirection === 'asc' ? 
                    <IconArrowUp className="h-4 w-4 text-primary" /> : 
                    <IconArrowDown className="h-4 w-4 text-primary" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => onSort('details')} className={`cursor-pointer hover:bg-accent transition-colors ${sortField === 'details' ? 'text-primary font-medium bg-accent/50' : ''}`}>
              <div className="flex items-center gap-1">
                Additional Details
                {sortField === 'details' && (
                  sortDirection === 'asc' ? 
                    <IconArrowUp className="h-4 w-4 text-primary" /> : 
                    <IconArrowDown className="h-4 w-4 text-primary" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => onSort('created_at')} className={`cursor-pointer hover:bg-accent transition-colors ${sortField === 'created_at' ? 'text-primary font-medium bg-accent/50' : ''}`}>
              <div className="flex items-center gap-1">
                Filed at
                {sortField === 'created_at' && (
                  sortDirection === 'asc' ? 
                    <IconArrowUp className="h-4 w-4 text-primary" /> : 
                    <IconArrowDown className="h-4 w-4 text-primary" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => onSort('resolved_at')} className={`cursor-pointer hover:bg-accent transition-colors ${sortField === 'resolved_at' ? 'text-primary font-medium bg-accent/50' : ''}`}>
              <div className="flex items-center gap-1">
                Resolved at
                {sortField === 'resolved_at' && (
                  sortDirection === 'asc' ? 
                    <IconArrowUp className="h-4 w-4 text-primary" /> : 
                    <IconArrowDown className="h-4 w-4 text-primary" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => onSort('resolver_first_name')} className={`cursor-pointer hover:bg-accent transition-colors ${sortField === 'resolver_first_name' ? 'text-primary font-medium bg-accent/50' : ''}`}>
              <div className="flex items-center gap-1">
                Resolved By
                {sortField === 'resolver_first_name' && (
                  sortDirection === 'asc' ? 
                    <IconArrowUp className="h-4 w-4 text-primary" /> : 
                    <IconArrowDown className="h-4 w-4 text-primary" />
                )}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {ticket.ticket_id}
              </TableCell>
              <TableCell>
                {getCategoryBadge(ticket.category_name || ticket.category)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ticket.profile_picture || ''} alt={`User ${ticket.user_id}`} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                      {ticket.first_name && ticket.last_name 
                        ? `${ticket.first_name[0]}${ticket.last_name[0]}`
                        : String(ticket.user_id).split(' ').map(n => n[0]).join('')
                      }
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">
                    {ticket.first_name && ticket.last_name 
                      ? `${ticket.first_name} ${ticket.last_name}`
                      : `User ${ticket.user_id}`
                    }
                  </span>
                </div>
              </TableCell>
              <TableCell className="max-w-[300px] min-w-[250px] text-muted-foreground">
                <div className="truncate" title={ticket.concern}>
                  {ticket.concern}
                </div>
              </TableCell>
              <TableCell className="max-w-[300px] min-w-[250px]">
                {ticket.details ? (
                  <div className="truncate text-sm text-muted-foreground" title={ticket.details}>
                    {ticket.details}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground/50">-</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(ticket.created_at)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {ticket.resolved_at ? formatDate(ticket.resolved_at) : '-'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {ticket.resolver_first_name && ticket.resolver_last_name 
                  ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={ticket.profile_picture || ''} alt={`Resolved by ${ticket.resolver_first_name}`} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                          {`${ticket.resolver_first_name[0]}${ticket.resolver_last_name[0]}`}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">
                        {currentUser && ticket.resolved_by === parseInt(currentUser.id) 
                          ? 'You'
                          : `${ticket.resolver_first_name} ${ticket.resolver_last_name}`
                        }
                      </span>
                    </div>
                  )
                  : ticket.resolved_by 
                    ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="" alt={`Resolved by User ${ticket.resolved_by}`} />
                          <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                            {String(ticket.resolved_by).split('').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">
                          {currentUser && ticket.resolved_by === parseInt(currentUser.id) 
                            ? 'You'
                            : `User ${ticket.resolved_by}`
                          }
                        </span>
                      </div>
                    )
                    : '-'
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function PastTicketsSkeleton() {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-12" /></TableHead>
            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
            <TableHead><Skeleton className="h-4 w-32" /></TableHead>
            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16 rounded-md" /></TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function PastTicketsPage() {
  const { user } = useAuth()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortField, setSortField] = useState<string>('resolved_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [resolvedByUserCount, setResolvedByUserCount] = useState<number>(0)

  // Initial fetch
  useEffect(() => {
    fetchTickets()
    fetchCategories()
  }, [])

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...')
      const response = await fetch('/api/ticket-categories')
      console.log('Categories response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Categories data:', data)
        setCategories(data)
      } else {
        console.error('Failed to fetch categories:', response.status)
        const errorData = await response.json().catch(() => ({}))
        console.error('Categories error data:', errorData)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortField: sortField,
        sortDirection: sortDirection,
        userId: user?.id || ''
      })
      
      // If there's a search term, fetch all tickets, otherwise fetch only closed tickets
      if (searchTerm) {
        // Search across all tickets
        params.append('search', searchTerm)
      } else {
        // Default to closed tickets only
        params.append('status', 'Closed')
        params.append('past', 'true')
      }
      
      if (selectedCategory !== 'all') {
        params.append('categoryId', selectedCategory)
      }
      
      console.log('Fetching tickets with params:', params.toString())
      const response = await fetch(`/api/tickets?${params.toString()}`)
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Response data:', data)
        
        // Handle paginated response
        if (data.tickets && data.pagination) {
          setTickets(data.tickets)
          setTotalCount(data.pagination.totalCount)
          setTotalPages(data.pagination.totalPages)
          setResolvedByUserCount(data.resolvedByUserCount || 0)
        } else {
          // Fallback for non-paginated response
          setTickets(data)
          setTotalCount(data.length)
          setTotalPages(Math.ceil(data.length / itemsPerPage))
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', response.status, errorData)
        setError(errorData.error || 'Failed to fetch tickets')
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('Network error - please check your connection')
    } finally {
      setLoading(false)
    }
  }

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Debounced search and pagination effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets()
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchTerm, currentPage, sortField, sortDirection, selectedCategory])

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1) // Reset to first page when sorting
  }

  // Remove client-side filtering since it's now server-side
  const pastTickets = tickets

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
                    <h1 className="text-2xl font-bold">Records</h1>
                    <p className="text-sm text-muted-foreground">View all completed tickets and resolution history.</p>
                  </div>
                  <div className="flex gap-2">
                    <ReloadButton 
                      onReload={fetchTickets}
                      loading={loading}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tickets, users, categories, or details..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-40">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories
                          .sort((a, b) => {
                            // Put "Others" at the end
                            if (a.name === "Others") return 1
                            if (b.name === "Others") return -1
                            // Sort alphabetically
                            return a.name.localeCompare(b.name)
                          })
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--sidebar-background))] rounded-lg border">
                    <div className="text-sm font-medium text-muted-foreground">Resolved By You:</div>
                    <div className="text-sm font-semibold text-sidebar-accent-foreground">
                      {resolvedByUserCount} Tickets
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                {loading ? (
                  <PastTicketsSkeleton />
                ) : error ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <p className="text-red-600 mb-2">{error}</p>
                      <Button onClick={fetchTickets} variant="outline">
                        Retry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {pastTickets.length > 0 ? (
                      <>
                        <PastTicketsTable tickets={pastTickets} onSort={handleSort} sortField={sortField} sortDirection={sortDirection} currentUser={user} />
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-muted-foreground">
                              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} tickets
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
                      </>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/20">
                        <IconHistory className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-sm font-medium">No Past Tickets</p>
                        <p className="text-xs text-muted-foreground/70">
                          {searchTerm ? 'No tickets match your search criteria' : ''}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
} 