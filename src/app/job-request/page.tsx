"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { JobRequestModal } from "@/components/modals/job-request-modal"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Briefcase, Building2, Calendar as CalendarIcon, DollarSign, CheckSquare, Sparkles, Gift, GraduationCap } from "lucide-react"

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

export default function JobRequestPage() {
  const [openModal, setOpenModal] = useState(false)
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
                          className="rounded-xl focus-within:ring-2 ring-ring"
                        >
                          <CardHeader className="pb-3">
                            <div className="space-y-1">
                              <CardTitle id={`job-title-${r.id}`} className="text-base md:text-lg font-semibold">
                                {r.job_title}
                              </CardTitle>
                              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                <span className="font-mono text-[11px]">#{r.id}</span>
                                <span>•</span>
                                <span>{r.work_arrangement || 'Not specified'}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-5">
                            {(r.job_description || r.industry || r.department) && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                                  <Briefcase className="h-4 w-4" aria-hidden="true" /> Details
                                </div>
                                {r.job_description && (
                                  <p className="text-sm mt-1 line-clamp-2 md:line-clamp-3">{r.job_description}</p>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                  {r.industry && (
                                    <div>
                                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                                        <Building2 className="h-4 w-4" aria-hidden="true" /> Industry
                                      </div>
                                      <div className="mt-1 text-sm font-medium">{r.industry}</div>
                                    </div>
                                  )}
                                  {r.department && (
                                    <div>
                                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                                        <Building2 className="h-4 w-4" aria-hidden="true" /> Department
                                      </div>
                                      <div className="mt-1 text-sm font-medium">{r.department}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
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
    </>
  )
}
