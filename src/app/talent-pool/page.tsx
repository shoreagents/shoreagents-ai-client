"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TalentsDetailModal } from "@/components/modals/talents-detail-modal"
import { 
  Search, 
  Star, 
  MapPin, 
  Briefcase, 
  Filter,
  Users,
  DollarSign,
  Mail
} from "lucide-react"



// Database-driven talent profiles
interface TalentProfile {
  id: string
  name: string
  title: string
  location: string
  avatar: string
  rating: number
  hourlyRate: number
  completedJobs: number
  skills: string[]
  description: string
  category: string
  status?: string
  rankPosition?: number
  createdAt?: string
  email?: string
}

const categories = ["All", "Design", "Marketing", "Development", "Science", "Writing"]

export default function TalentPoolPage() {
  const [talents, setTalents] = useState<TalentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("rating")
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)


  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          search: searchQuery,
          category: selectedCategory,
          sortBy: sortBy
        })
        
        const response = await fetch(`/api/talent-pool?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch talents')
        }
        
        const data = await response.json()
        if (data.success) {
          setTalents(data.talents)
        } else {
          console.error('API error:', data.error)
        }
      } catch (error) {
        console.error('Error fetching talents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTalents()
  }, [searchQuery, selectedCategory, sortBy])

  // API now handles filtering and sorting, so we use talents directly
  const displayTalents = talents

  const handleOpenModal = (talent: TalentProfile) => {
    setSelectedTalent(talent)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTalent(null)
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
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Talent Pool</h1>
                    <p className="text-sm text-muted-foreground">
                      Discover and connect with top freelancers and professionals.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {talents.length} talents
                    </Badge>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, skills, or title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Top Rated</SelectItem>
                        <SelectItem value="rate">Lowest Rate</SelectItem>
                        <SelectItem value="jobs">Most Jobs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left Column - Talent Grid */}
                  <div className="lg:col-span-3">
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Card key={i} className="rounded-xl">
                            <CardHeader className="pb-4">
                              <div className="flex items-start gap-3">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-5 w-3/4" />
                                  <Skeleton className="h-4 w-1/2" />
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-20" />
                              </div>
                              <Skeleton className="h-16 w-full" />
                              <div className="flex flex-wrap gap-1">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-14" />
                              </div>
                              <Skeleton className="h-10 w-full" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : displayTalents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <Users className="h-12 w-12 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No talents found</h3>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayTalents.map((talent: TalentProfile) => (
                          <Card
                            key={talent.id}
                            className="rounded-xl flex flex-col"
                          >
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={talent.avatar} alt={talent.name} />
                                    <AvatarFallback>
                                      {talent.name ? talent.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg leading-tight">
                                      {talent.name}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm font-medium">{talent.rating || 0}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <span className="text-green-600 font-bold">₱</span>
                                  <span className="font-bold text-base">{talent.hourlyRate || 0}</span>
                                  <span className="text-muted-foreground text-xs"> /month</span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="flex flex-col justify-between min-h-0 flex-1">

                              <div className="space-y-4">
                                {/* Description */}
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  {talent.description || 'No description available'}
                                </p>
                                
                                {/* Email */}
                                {talent.email && (
                                  <div className="flex items-center gap-2 text-sm text-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span className="truncate">{talent.email}</span>
                                  </div>
                                )}

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2">
                                  {talent.skills && talent.skills.length > 0 ? (
                                    <>
                                      {talent.skills.slice(0, 8).map((skill: string, index: number) => (
                                        <Badge key={index} className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0">
                                          {skill}
                                        </Badge>
                                      ))}
                                      {talent.skills.length > 8 && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Badge className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors">
                                                +{talent.skills.length - 8} more
                                              </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="p-3 max-w-xs">
                                              <div className="text-center">
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                  {talent.skills.slice(8).map((skill: string, index: number) => (
                                                    <Badge key={index + 8} className="text-xs bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border-0">
                                                      {skill}
                                                    </Badge>
                                                  ))}
                                                </div>
                                              </div>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">No skills listed</span>
                                  )}
                                </div>
                              </div>

                              {/* Action Button */}
                              <Button 
                                variant="default" 
                                className="w-full text-sm h-9 rounded-lg shadow-none mt-4"
                                onClick={() => handleOpenModal(talent)}
                              >
                                See Profile
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column - AI Assistant */}
                  <div className="lg:col-span-1">
                    <Card className="rounded-xl sticky top-6">
                      <CardHeader>
                        <h3 className="text-lg font-semibold">AI Assistant</h3>
                        <p className="text-sm text-muted-foreground">
                          Get help finding the perfect talent
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h4 className="font-medium mb-2">Smart Talent Matching</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Describe your project requirements and let AI find the best candidates
                          </p>
                          <Button className="w-full" size="sm">
                            Start AI Search
                          </Button>
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
      
      {/* Talent Detail Modal */}
      <TalentsDetailModal
        talent={selectedTalent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
