"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { JobRequestModal } from "@/components/modals/job-request-modal"
import { JobRequestDetailModal } from "@/components/modals/job-request-detail-modal"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Briefcase, Building2, DollarSign, CheckSquare, Sparkles, Gift, GraduationCap, User, TrendingUp } from "lucide-react"

interface JobRequestRow {
  id: number
  company_id: string | null
  job_title: string
  work_arrangement: string | null
  status: string
  created_at: string
  salary_min?: number | null
  salary_max?: number | null
  job_description?: string | null
  requirements?: string[] | null
  responsibilities?: string[] | null
  benefits?: string[] | null
  skills?: string[] | null
  experience_level?: string | null
  application_deadline?: string | null
  industry?: string | null
  department?: string | null
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "text-green-700 dark:text-white border-green-600/20 bg-green-50 dark:bg-green-600/20"
    case "inactive":
      return "text-yellow-700 dark:text-white border-yellow-600/20 bg-yellow-50 dark:bg-yellow-600/20"
    case "closed":
      return "text-red-700 dark:text-white border-red-600/20 bg-red-50 dark:bg-red-600/20"
    case "processed":
      return "text-blue-700 dark:text-white border-blue-600/20 bg-blue-50 dark:bg-blue-600/20"
    default:
      return "text-gray-700 dark:text-white border-gray-600/20 bg-gray-50 dark:bg-gray-600/20"
  }
}


const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  })
}

export default function JobRequestPage() {
  const [openModal, setOpenModal] = useState(false)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [selectedJobRequest, setSelectedJobRequest] = useState<JobRequestRow | null>(null)
  const { user, loading: authLoading } = useAuth()
  const companyUuid = (user as any)?.companyUuid ?? null
  const [rows, setRows] = useState<JobRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (value?: number | null) => {
    try {
      if (value == null) return "Not set"
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value)
    } catch {
      return `₱${value ?? 0}`
    }
  }

  const handleViewRequest = (jobRequest: JobRequestRow) => {
    setSelectedJobRequest(jobRequest)
    setOpenDetailModal(true)
  }

  useEffect(() => {
    const fetchRequests = async () => {
      if (authLoading) return // wait for session to resolve
      if (!companyUuid) { // no company context yet; show empty
        setRows([])
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const url = `/api/job-requests?companyId=${encodeURIComponent(companyUuid)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setRows(data.requests || [])
      } catch (e: any) {
        console.error(e)
        setError(e?.message || "Failed to load job requests")
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [companyUuid, authLoading, openModal])

  return (
    <>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Job Request</h1>
                    <p className="text-sm text-muted-foreground">Create and track your job requests.</p>
                  </div>
                  <Button onClick={() => setOpenModal(true)}>New Request</Button>
                </div>

                <div className="@container/card">
                  {error && <div className="text-sm text-destructive mb-4">{error}</div>}
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="rounded-xl">
                          <CardHeader className="pb-3 space-y-2">
                            <Skeleton className="h-5 w-3/5" />
                            <Skeleton className="h-4 w-2/5" />
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="grid grid-cols-2 gap-4">
                              <Skeleton className="h-12 w-full" />
                              <Skeleton className="h-12 w-full" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
                      <Briefcase className="h-8 w-8 mb-2" aria-hidden="true" />
                      <p className="text-sm">No Job Requests Yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {rows.map((r) => (
                        <Card
                          key={r.id}
                          role="article"
                          aria-labelledby={`job-title-${r.id}`}
                          className="rounded-xl cursor-pointer transition-colors duration-150 hover:border-primary/50"
                          onClick={() => handleViewRequest(r)}
                        >
                          <CardHeader className="pb-3">
                            <div className="space-y-3">
                              {/* Header with Title and Status */}
                              <div className="flex items-start justify-between gap-3">
                                <CardTitle id={`job-title-${r.id}`} className="text-base md:text-lg font-semibold line-clamp-2">
                                  {r.job_title}
                                </CardTitle>
                                <Badge 
                                  variant="outline"
                                  className={`text-xs h-6 flex items-center rounded-[6px] px-2 py-1 ${getStatusColor(r.status)}`}
                                >
                                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                </Badge>
                              </div>
                              
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0 space-y-4">
                            {/* Job Description */}
                            {r.job_description && (
                              <p className="text-sm line-clamp-2 text-muted-foreground">{r.job_description}</p>
                            )}

                            {/* Key Information Grid */}
                            <div className="grid grid-cols-2 gap-3">
                              {/* Industry */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                                  <Building2 className="h-3 w-3" />
                                  Industry
                                </div>
                                <div className="text-sm font-medium truncate">{r.industry || "Not Specified"}</div>
                              </div>
                              
                              {/* Department */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  Department
                                </div>
                                <div className="text-sm font-medium truncate">{r.department || "Not Specified"}</div>
                              </div>
                              
                              {/* Experience Level */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                                  <TrendingUp className="h-3 w-3" />
                                  Experience
                                </div>
                                <div className="text-sm font-medium capitalize">
                                  {r.experience_level ? r.experience_level.replace('-', ' ') : "Not Specified"}
                                </div>
                              </div>
                              
                              {/* Salary Range */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                                  <DollarSign className="h-3 w-3" />
                                  Salary Range
                                </div>
                                <div className="text-sm font-semibold text-foreground">
                                  {r.salary_min && r.salary_max 
                                    ? `₱${formatNumber(r.salary_min)} - ₱${formatNumber(r.salary_max)}`
                                    : r.salary_min 
                                      ? `₱${formatNumber(r.salary_min)}+`
                                      : r.salary_max
                                        ? `Up to ₱${formatNumber(r.salary_max)}`
                                        : "Not Specified"
                                  }
                                </div>
                              </div>
                            </div>


                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <JobRequestModal open={openModal} onOpenChange={setOpenModal} />
      
      {/* Job Request Detail Modal */}
      <JobRequestDetailModal 
        jobRequest={selectedJobRequest ? {
          id: selectedJobRequest.id.toString(),
          jobTitle: selectedJobRequest.job_title,
          jobDescription: selectedJobRequest.job_description || "",
          industry: selectedJobRequest.industry || "",
          department: selectedJobRequest.department || "",
          workArrangement: selectedJobRequest.work_arrangement as "onsite" | "remote" | "hybrid" | "",
          salaryMin: selectedJobRequest.salary_min || undefined,
          salaryMax: selectedJobRequest.salary_max || undefined,
          experienceLevel: selectedJobRequest.experience_level as "entry-level" | "mid-level" | "senior-level" | "",
          applicationDeadline: selectedJobRequest.application_deadline || undefined,
          workType: "full-time" as const,
          currency: "PHP" as const,
          salaryType: "monthly" as const,
          requirements: selectedJobRequest.requirements || [],
          responsibilities: selectedJobRequest.responsibilities || [],
          benefits: selectedJobRequest.benefits || [],
          skills: selectedJobRequest.skills || [],
          status: selectedJobRequest.status,
          created_at: selectedJobRequest.created_at,
          updated_at: selectedJobRequest.created_at, // Using created_at as fallback
          applicants_count: 0, // Default values for display
          interviews_scheduled: 0,
          offers_made: 0
        } : null}
        isOpen={openDetailModal}
        onClose={() => {
          setOpenDetailModal(false)
          setSelectedJobRequest(null)
        }}
        pageContext="job-requests"
      />
    </>
  )
}
