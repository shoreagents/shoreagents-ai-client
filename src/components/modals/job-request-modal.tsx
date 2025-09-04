"use client"

import React, { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon, UserIcon, BuildingIcon, UsersIcon, Share2Icon, DollarSign, CalendarIcon, BriefcaseIcon, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

import { toast } from "sonner"
import { LoaderCore, type LoadingState } from "@/components/ui/multi-step-loader"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import { AnimatedGradientIcon } from "@/components/magicui/animated-gradient-icon"
import { cn } from "@/lib/utils"

interface JobRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface JobForm {
  jobTitle: string
  location: string
  workArrangement: "onsite" | "remote" | "hybrid" | ""
  salaryMin?: number | ""
  salaryMax?: number | ""
  jobDescription: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]
  experienceLevel: "entry-level" | "mid-level" | "senior-level" | ""
  applicationDeadline?: string
  industry: string
  department: string
  workType: "full-time"
  currency: "PHP"
  salaryType: "monthly"
}

const industryOptions = [
  "Technology","Healthcare","Finance/Banking","Education","Manufacturing","Retail/E-commerce","Real Estate","Marketing/Advertising","Hospitality/Tourism","Construction","Government","Non-profit","Transportation/Logistics","Media/Entertainment","Food & Beverage","Others",
]

const departmentOptions = [
  "Engineering","Information Technology (IT)","Sales","Marketing","Human Resources","Finance/Accounting","Operations","Customer Service","Administration","Research & Development","Legal","Design/Creative","Project Management","Quality Assurance","Business Development","Supply Chain","Others",
]

const StepIndicator = ({ step, total }: { step: number; total: number }) => {
  return null
}

function ArrayTags({ label, values, onAdd, onRemove, minHeightClass = "min-h-[100px]" }: { label: string; values: string[]; onAdd: (v: string[]) => void; onRemove: (idx: number) => void; minHeightClass?: string }) {
  const [draft, setDraft] = useState(() => 
    values.length > 0 ? values.map(item => `• ${item}`).join('\n') : ""
  )

  // Update draft when values change
  React.useEffect(() => {
    if (values.length > 0) {
      setDraft(values.map(item => `• ${item}`).join('\n'))
    } else {
      setDraft("")
    }
  }, [values])

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setDraft(newText)
    
    // Parse the text in real-time and update the values
    const items = newText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[-•*]\s*/, '')) // Remove bullet points if present
      .map(line => line.replace(/^\d+\.\s*/, '')) // Remove numbered lists if present
      .filter(item => item.length > 0)
      // Removed duplicate filtering to allow same text in different array fields
    
    // Update the form values
    onAdd(items)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Add a new bullet point
      const newText = draft + '\n• '
      setDraft(newText)
      // Focus back to the textarea
      setTimeout(() => {
        const textarea = e.target as HTMLTextAreaElement
        textarea.focus()
        textarea.setSelectionRange(newText.length, newText.length)
      }, 0)
    }
  }
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-medium">{label}</label>
      <div className="space-y-2">
        <Textarea 
          value={draft} 
          onChange={handleTextareaChange} 
          placeholder={`Enter ${label.toLowerCase()} here...`}
          onKeyDown={handleKeyDown}
          className={`${minHeightClass} resize-none`}
        />


      </div>
      
    </div>
  )
}

export function JobRequestModal({ open, onOpenChange }: JobRequestModalProps) {
  const [step, setStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const totalSteps = 5
  const [otherIndustry, setOtherIndustry] = useState("")
  const [otherDepartment, setOtherDepartment] = useState("")
  const [submitted, setSubmitted] = useState<null | { jobId: string }>(null)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiInfoOpen, setAiInfoOpen] = useState(false)
  const [aiSuccess, setAiSuccess] = useState(false)

  const [showContentGeneratedModal, setShowContentGeneratedModal] = useState(false)
  const { user } = useAuth()
  const companyUuid = (user as any)?.companyUuid ?? null

  const getDefaultForm = (): JobForm => ({
    jobTitle: "",
    location: "",
    workArrangement: "",
    salaryMin: "",
    salaryMax: "",
    jobDescription: "",
    requirements: [],
    responsibilities: [],
    benefits: [],
    skills: [],
    experienceLevel: "",
    applicationDeadline: "",
    industry: "",
    department: "",
    workType: "full-time",
    currency: "PHP",
    salaryType: "monthly",
  })

  const [form, setForm] = useState<JobForm>(getDefaultForm())

  const handleChange = (key: keyof JobForm, value: any) => setForm((f) => ({ ...f, [key]: value }))

  // Dynamic loading steps reflecting fields AI generates
  const aiLoadingStates: LoadingState[] = useMemo(() => {
    const steps: string[] = []
    steps.push("Analyzing job title")
    steps.push("Drafting job description")
    steps.push("Generating requirements")
    steps.push("Outlining responsibilities")
    steps.push("Suggesting skills")
    steps.push("Recommending benefits")
    steps.push("Setting experience level")
    steps.push("Choosing work arrangement")
    steps.push("Estimating Philippine salary range")
    steps.push("Finalizing")
    return steps.map(text => ({ text }))
  }, [form.jobTitle])

  const [aiLoaderIndex, setAiLoaderIndex] = useState(0)
  React.useEffect(() => {
    if (!aiGenerating) {
      setAiLoaderIndex(0)
      return
    }
    const t = setTimeout(() => {
      setAiLoaderIndex(prev => Math.min(prev + 1, aiLoadingStates.length - 1))
    }, 900)
    return () => clearTimeout(t)
  }, [aiGenerating, aiLoaderIndex, aiLoadingStates.length])

  const resetForm = () => {
    setForm(getDefaultForm())
    setStep(0)
    setCompletedSteps(new Set())
    setOtherIndustry("")
    setOtherDepartment("")
    setSubmitted(null)
    setAiSuccess(false)
  }

  // Ensure the form resets whenever the dialog transitions from closed -> open
  React.useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open])

  const generateWithAI = async () => {
    if (!form.jobTitle.trim()) {
      alert("Please enter a job title first")
      return
    }

    // Open the AI dialog and show generating state in-place
    setAiSuccess(false)
    if (!aiInfoOpen) setAiInfoOpen(true)
    setAiGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: form.jobTitle,
          industry: form.industry === "Others" ? otherIndustry : form.industry,
          department: form.department === "Others" ? otherDepartment : form.department,
          jobDescription: form.jobDescription,
          requirements: form.requirements,
          responsibilities: form.responsibilities,
          skills: form.skills,
          benefits: form.benefits,
          experienceLevel: form.experienceLevel || undefined,
          workArrangement: form.workArrangement || undefined,
          salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
          salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate content")
      }

      const result = await response.json()
      const aiData = result.data

      // Update form with AI-generated content
      setForm(prev => ({
        ...prev,
        jobTitle: aiData.jobTitle || prev.jobTitle,
        jobDescription: aiData.jobDescription || prev.jobDescription,
        requirements: aiData.requirements || prev.requirements,
        responsibilities: aiData.responsibilities || prev.responsibilities,
        benefits: aiData.benefits || prev.benefits,
        skills: aiData.skills || prev.skills,
        experienceLevel: aiData.experienceLevel || prev.experienceLevel,
        workArrangement: aiData.workArrangement || prev.workArrangement
      }))

      // Update other fields if they were generated
      if (aiData.salaryMin) setForm(prev => ({ ...prev, salaryMin: aiData.salaryMin }))
      if (aiData.salaryMax) setForm(prev => ({ ...prev, salaryMax: aiData.salaryMax }))

      setAiSuccess(true)
    } catch (error: any) {
      console.error("AI generation error:", error)
      toast.error("Failed to Generate AI Content")
    } finally {
      setAiGenerating(false)
    }
  }

  const shouldShowAiInfo = () => {
    const industryValue = form.industry === "Others" ? otherIndustry : form.industry
    const departmentValue = form.department === "Others" ? otherDepartment : form.department
    return !form.jobTitle.trim() || !form.jobDescription.trim() || !industryValue || !departmentValue
  }

  const onAiClick = () => {
    if (shouldShowAiInfo()) {
      setAiSuccess(false)
      setAiInfoOpen(true)
      return
    }
    generateWithAI()
  }



  // Determine which fields are missing for AI guidance
  const missingJobTitle = !form.jobTitle.trim()
  const missingIndustry = !(form.industry === "Others" ? otherIndustry : form.industry)
  const missingDepartment = !(form.department === "Others" ? otherDepartment : form.department)
  const missingJobDescription = !form.jobDescription.trim()

  // Close AI info dialog automatically when generation finishes (after being started from the dialog)
  const wasGeneratingRef = React.useRef(false)
  React.useEffect(() => {
    wasGeneratingRef.current = aiGenerating
  }, [aiGenerating])

  // Keep AI success visible until user dismisses the dialog

  const valid0 = !!(form.jobTitle.trim() && form.jobDescription.trim())
  const valid1 = true // All fields in step 1 are optional
  const valid2 = true // All fields in step 2 are optional
  const valid3 = true // All fields in step 3 are optional
  const valid4 = true

  const canNext = useMemo(() => {
    if (step === 0) return valid0
    if (step === 1) return valid1
    if (step === 2) return valid2
    if (step === 3) return valid3
    if (step === 4) return valid4
    return true
  }, [step, valid0, valid1, valid2, valid3, valid4])

  // Highest step user can jump to
  const maxStep = valid0 ? (valid1 ? (valid2 ? (valid3 ? (valid4 ? 5 : 4) : 3) : 2) : 1) : 0

  const reviewData = useMemo(() => ({
    ...form,
    industry: form.industry === "Others" ? otherIndustry : form.industry,
    department: form.department === "Others" ? otherDepartment : form.department,
    salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
    salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
    dateCreated: new Date().toISOString(),
    status: "inactive",
    companyId: companyUuid ?? user?.memberId ?? null,
    views: 0,
    applicants: 0,
  }), [form, otherIndustry, otherDepartment, user?.memberId, companyUuid])

  const submit = async () => {
    try {
      const payload = reviewData
      const res = await fetch("/api/job-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: companyUuid ?? payload.companyId,
          jobTitle: payload.jobTitle,
          workArrangement: payload.workArrangement || null,
          salaryMin: payload.salaryMin ?? null,
          salaryMax: payload.salaryMax ?? null,
          jobDescription: payload.jobDescription,
          requirements: payload.requirements,
          responsibilities: payload.responsibilities,
          benefits: payload.benefits,
          skills: payload.skills,
          experienceLevel: payload.experienceLevel || null,
          applicationDeadline: payload.applicationDeadline || null,
          industry: payload.industry || null,
          department: payload.department || null,
        }),
      })
      if (!res.ok) {
        let detail = ""
        try { const err = await res.json(); detail = err?.error || JSON.stringify(err) } catch { detail = await res.text() }
        throw new Error(`Request failed (${res.status}): ${detail}`)
      }
      const data = await res.json()
      // Close first to avoid any UI race conditions, then reset immediately after
      onOpenChange(false)
      setTimeout(() => {
        resetForm()
      }, 0)
    } catch (e: any) {
      console.error(e)
      setSubmitted(null)
      toast.error("Failed to Submit Job Request")
    }
  }

      const steps = [
      { title: "Details", subtitle: "Role title, industry, department, summary.", icon: UserIcon },
      { title: "Experience", subtitle: "Required level, qualifications.", icon: BuildingIcon },
      { title: "Skills", subtitle: "Key abilities, duties.", icon: BriefcaseIcon },
      { title: "Additional", subtitle: "Perks, work setup.", icon: UsersIcon },
      { title: "Review", subtitle: "Final check before submit.", icon: Share2Icon },
    ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1100px] w-[95vw] p-0 !rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Job Request Form</DialogTitle>
          <DialogDescription>
            Create a new job request by providing job details and requirements through guided steps.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pt-6 pb-6">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Badge className="text-xs h-6 flex items-center rounded-[6px]">
                  Job Request
                </Badge>
              </div>
            </div>
            <div className="mr-8">
              <div 
                onClick={onAiClick}
                className={`group relative flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] cursor-pointer`}
              >
                <span
                  className={cn(
                    "absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]",
                  )}
                  style={{
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "destination-out",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "subtract",
                    WebkitClipPath: "padding-box",
                    animation: "gradient 3s linear infinite",
                  }}
                />
                                        <div className="flex items-center gap-2 relative z-10">
                          <AnimatedGradientIcon className="h-4 w-4">
                            <Sparkles className="h-4 w-4 text-white" />
                          </AnimatedGradientIcon>
                          <AnimatedGradientText className="text-sm font-medium">
                            AI Assistant
                          </AnimatedGradientText>
                        </div>
              </div>

            </div>
                        {/* Combined AI Modal */}
            <Dialog open={aiInfoOpen} onOpenChange={(open) => {
              if (!aiGenerating) {
                setAiInfoOpen(open)
                if (!open) {
                  setAiSuccess(false)
                }
              }
            }}>
              <DialogContent className="sm:max-w-[380px] w-[90vw] rounded-xl h-[320px] overflow-hidden flex flex-col" hideClose>
                {!aiGenerating && !aiSuccess && (
                  <DialogHeader className="text-center sm:text-center">
                    <DialogTitle>Want More Accurate Results?</DialogTitle>
                  </DialogHeader>
                )}
                {aiGenerating ? (
                  <div className="mt-auto overflow-hidden relative">
                    <div className="h-full w-full flex justify-center">
                      <LoaderCore value={aiLoaderIndex} loadingStates={aiLoadingStates} className="mt-0" itemOffsetPx={28} fadeStrength={0} />
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent" />
                  </div>
                ) : aiSuccess ? (
                  <>
                    <DialogHeader className="text-center sm:text-center">
                      <DialogTitle>Content Generated!</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm space-y-2">
                      <p className="text-muted-foreground">The AI has successfully generated comprehensive content for your job request.</p>
                    </div>
                    <div className="flex justify-center gap-2 pt-2 mt-auto">
                      <Button onClick={() => { 
                        setAiSuccess(false)
                        setAiInfoOpen(false)
                      }}>Review & Continue</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm space-y-2">
                      <p className="text-muted-foreground">The AI Assistant works best when you provide:</p>
                      <ul className="space-y-1">
                        {missingJobTitle && (
                          <li className="flex items-center gap-2">
                            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Job Title <span style={{ color: 'rgb(239, 68, 68)' }}>(Required)</span></span>
                          </li>
                        )}
                        {missingJobDescription && (
                          <li className="flex items-center gap-2">
                            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Job Description <span style={{ color: 'rgb(239, 68, 68)' }}>(Required)</span></span>
                          </li>
                        )}
                        {missingIndustry && (
                          <li className="flex items-center gap-2">
                            <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Industry <span className="text-muted-foreground">(Recommended)</span></span>
                          </li>
                        )}
                        {missingDepartment && (
                          <li className="flex items-center gap-2">
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Department <span className="text-muted-foreground">(Recommended)</span></span>
                          </li>
                        )}
                      </ul>
                      <p className="text-muted-foreground">We'll still generate results if these are empty, but adding them improves accuracy and relevance.</p>
                    </div>
                    <div className="flex justify-center gap-2 pt-2 mt-auto">
                      <Button variant="soft" onClick={() => setAiInfoOpen(false)}>Add More Details</Button>
                      <Button 
                        onClick={() => { generateWithAI() }} 
                        disabled={missingJobTitle || missingJobDescription}
                      >
                        Continue
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

          </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left stepper */}
              <div className="lg:col-span-4">
                <div className="rounded-xl bg-sidebar p-4 border border-border h-full flex items-start">
                  <div className="space-y-4 w-full">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-foreground">Steps</h3>

                    </div>
                    {steps.map((s, i) => {
                      const ActiveIcon = s.icon as any
                      const active = i === step
                      const passed = completedSteps.has(i)
                      return (
                        <div key={s.title} className={`flex gap-3 flex-1 text-left ${!active && !passed ? 'opacity-50' : ''}`}>
                          <div className="flex flex-col items-center">
                            <div className={`grid place-items-center h-10 w-10 rounded-full border ${active ? 'border-teal-600/40 bg-teal-600 text-white' : passed ? 'border-teal-600/20 bg-teal-600/5 text-teal-600' : 'border-border bg-background text-muted-foreground'}` }>
                              <ActiveIcon className="h-5 w-5" />
                            </div>

                          </div>
                          <div className="flex-1">
                            <div className={`${active ? 'text-foreground' : 'text-foreground/90'} font-semibold`}>{s.title}</div>
                            <div className="text-sm text-muted-foreground">{s.subtitle}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right: form content */}
              <div className="lg:col-span-8">
                <div className="space-y-8 overflow-visible h-[400px]">
                  <div className="h-full overflow-y-auto pr-2 p-2">
                    {step === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Job Title *</label>
                          <Input value={form.jobTitle} onChange={(e) => handleChange('jobTitle', e.target.value)} placeholder="e.g., Senior Software Engineer" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Industry</label>
                          <Select value={form.industry} onValueChange={(v) => handleChange('industry', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industryOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.industry === 'Others' && (
                            <Input className="mt-2" placeholder="Enter industry" value={otherIndustry} onChange={(e) => setOtherIndustry(e.target.value)} />
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Department</label>
                          <Select value={form.department} onValueChange={(v) => handleChange('department', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departmentOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.department === 'Others' && (
                            <Input className="mt-2" placeholder="Enter department" value={otherDepartment} onChange={(e) => setOtherDepartment(e.target.value)} />
                          )}
                        </div>
                        <div className="space-y-2 md:col-span-2 flex-1">
                          <label className="text-sm font-medium">Job Description *</label>
                          <Textarea 
                            value={form.jobDescription} 
                            onChange={(e) => handleChange('jobDescription', e.target.value)} 
                            placeholder="Describe the role, goals, and expectations" 
                            className="min-h-[190px] resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Experience Level</label>
                          <Select value={form.experienceLevel} onValueChange={(v) => handleChange('experienceLevel', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Experience Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="entry-level">Entry Level</SelectItem>
                              <SelectItem value="mid-level">Mid Level</SelectItem>
                              <SelectItem value="senior-level">Senior Level</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <ArrayTags label="Requirements" minHeightClass="min-h-[260px]" values={form.requirements} onAdd={(v) => handleChange('requirements', v)} onRemove={(i) => handleChange('requirements', form.requirements.filter((_, idx) => idx !== i))} />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2 md:col-span-2">
                          <ArrayTags label="Responsibilities" minHeightClass="min-h-[140px]" values={form.responsibilities} onAdd={(v) => handleChange('responsibilities', v)} onRemove={(i) => handleChange('responsibilities', form.responsibilities.filter((_, idx) => idx !== i))} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <ArrayTags label="Skills" minHeightClass="min-h-[140px]" values={form.skills} onAdd={(v) => handleChange('skills', v)} onRemove={(i) => handleChange('skills', form.skills.filter((_, idx) => idx !== i))} />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2 md:col-span-2">
                          <ArrayTags label="Benefits" values={form.benefits} onAdd={(v) => handleChange('benefits', v)} onRemove={(i) => handleChange('benefits', form.benefits.filter((_, idx) => idx !== i))} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Work Arrangement</label>
                          <Select value={form.workArrangement} onValueChange={(v) => handleChange('workArrangement', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Work Arrangement" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="onsite">On-site</SelectItem>
                              <SelectItem value="remote">Remote</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Salary Range</label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                              <Input type="number" min={0} value={form.salaryMin as any} onChange={(e) => handleChange('salaryMin', e.target.value)} placeholder="Min" className="pr-8" />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</div>
                            </div>
                            <div className="text-muted-foreground">-</div>
                            <div className="flex-1 relative">
                              <Input type="number" min={0} value={form.salaryMax as any} onChange={(e) => handleChange('salaryMax', e.target.value)} placeholder="Max" className="pr-8" />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Application Deadline</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="flex h-9 w-full rounded-lg border border-sidebar-border bg-sidebar text-sidebar-foreground px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-sidebar-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sidebar dark:text-sidebar-foreground dark:border-border dark:placeholder:text-sidebar-foreground cursor-pointer">
                                <span className={form.applicationDeadline ? "" : "text-sidebar-foreground"}>
                                  {form.applicationDeadline ? new Date(form.applicationDeadline).toLocaleDateString() : "Select Date"}
                                </span>
                                <CalendarIcon className="ml-auto h-4 w-4 flex-shrink-0" />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={form.applicationDeadline ? new Date(form.applicationDeadline) : undefined}
                                onSelect={(date) => handleChange('applicationDeadline', date ? date.toLocaleDateString('en-CA') : '')}
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    )}

                                         {step === 4 && (
                       <div className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="md:col-span-2">
                            <div className="text-xs text-muted-foreground">Job Title</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border">{form.jobTitle || "Not set"}</div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-xs text-muted-foreground">Job Description</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border min-h-[100px] whitespace-pre-wrap">{form.jobDescription || "Not set"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Industry</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border">{form.industry || "Not set"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Department</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border">{form.department || "Not set"}</div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-xs text-muted-foreground">Requirements</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border whitespace-pre-wrap min-h-[60px]">
                              {form.requirements?.length ? form.requirements.map((item: string, index: number) => `• ${item}`).join('\n') : "Not set"}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-xs text-muted-foreground">Responsibilities</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border whitespace-pre-wrap min-h-[60px]">
                              {form.responsibilities?.length ? form.responsibilities.map((item: string, index: number) => `• ${item}`).join('\n') : "Not set"}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-xs text-muted-foreground">Skills</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border whitespace-pre-wrap min-h-[60px]">
                              {form.skills?.length ? form.skills.map((item: string, index: number) => `• ${item}`).join('\n') : "Not set"}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Experience Level</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border capitalize">{form.experienceLevel || "Not set"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Work Arrangement</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border capitalize">{form.workArrangement || "Not set"}</div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-xs text-muted-foreground">Benefits</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border whitespace-pre-wrap min-h-[60px]">
                              {form.benefits?.length ? form.benefits.map((item: string, index: number) => `• ${item}`).join('\n') : "Not set"}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Salary Range</div>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="flex-1 relative">
                                <div className="p-2 bg-muted rounded-md border pr-8">{form.salaryMin || "Not set"}</div>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</div>
                              </div>
                              <div className="text-muted-foreground">-</div>
                              <div className="flex-1 relative">
                                <div className="p-2 bg-muted rounded-md border pr-8">{form.salaryMax || "Not set"}</div>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Application Deadline</div>
                            <div className="mt-1 p-2 bg-muted rounded-md border">{form.applicationDeadline ? new Date(form.applicationDeadline).toLocaleDateString() : "Not set"}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-6">
              <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                <ChevronLeftIcon className="h-4 w-4 mr-0" /> Back
              </Button>
              <div className="flex items-center gap-1">
                {step < totalSteps - 1 ? (
                  <Button type="button" disabled={!canNext} onClick={() => {
                    setCompletedSteps(prev => new Set([...prev, step]))
                    setStep((s) => Math.min(totalSteps - 1, s + 1))
                  }}>
                    Next <ChevronRightIcon className="h-4 w-4 ml-0" />
                  </Button>
                ) : (
                  <Button type="button" onClick={submit}>
                    Submit <CheckIcon className="h-4 w-4 ml-0" />
                  </Button>
                )}
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
