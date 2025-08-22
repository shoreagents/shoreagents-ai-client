"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import NumberFlow from '@number-flow/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { CalendarIcon, TrendingUpIcon } from "lucide-react"

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

interface NewHiresCardProps {
  employees: Employee[]
  className?: string
}

export function NewHires({ employees, className }: NewHiresCardProps) {
  const [viewMode, setViewMode] = useState<'month' | 'quarter' | 'half'>('month')

  // Calculate new hires based on viewMode
  const getNewHiresCount = () => {
    if (!employees.length) return 0
    
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    switch (viewMode) {
      case 'month':
        return employees.filter(emp => {
          if (!emp.hireDate) return false
          const hireDate = new Date(emp.hireDate)
          return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear
        }).length
      case 'quarter':
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        return employees.filter(emp => {
          if (!emp.hireDate) return false
          const hireDate = new Date(emp.hireDate)
          return hireDate >= threeMonthsAgo && hireDate <= now
        }).length
      case 'half':
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        return employees.filter(emp => {
          if (!emp.hireDate) return false
          const hireDate = new Date(emp.hireDate)
          return hireDate >= sixMonthsAgo && hireDate <= now
        }).length
      default:
        return 0
    }
  }

  // Calculate percentage change for new hires
  const getNewHiresPercentage = () => {
    if (!employees.length) return 0
    
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    let currentPeriod: number
    let previousPeriod: number
    
    switch (viewMode) {
      case 'month':
        // Current month vs previous month
        currentPeriod = employees.filter(emp => {
          if (!emp.hireDate) return false
          const hireDate = new Date(emp.hireDate)
          return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear
        }).length
        
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear
        previousPeriod = employees.filter(emp => {
          if (!emp.hireDate) return false
          const hireDate = new Date(emp.hireDate)
          return hireDate.getMonth() === previousMonth && hireDate.getFullYear() === previousYear
        }).length
        break
        
      case 'quarter':
        // Last 3 months vs previous 3 months
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        const sixMonthsAgoQuarter = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        const nineMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 9, 1)
        
        currentPeriod = employees.filter(emp => {
          if (!emp.hireDate) return false
          const hireDate = new Date(emp.hireDate)
          return hireDate >= threeMonthsAgo && hireDate <= now
        }).length
        
        previousPeriod = employees.filter(emp => {
          if (!emp.hireDate) return false
          const hireDate = new Date(emp.hireDate)
          return hireDate >= sixMonthsAgoQuarter && hireDate < threeMonthsAgo
        }).length
        break
        
      case 'half':
        // Last 6 months vs previous 6 months
        const sixMonthsAgoHalf = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1)
        
        currentPeriod = employees.filter(emp => {
          if (!emp.hireDate) return false
          const hireDate = new Date(emp.hireDate)
          return hireDate >= sixMonthsAgoHalf && hireDate <= now
        }).length
        
        previousPeriod = employees.filter(emp => {
          if (!emp.hireDate) return false
          const hireDate = new Date(emp.hireDate)
          return hireDate >= twelveMonthsAgo && hireDate < sixMonthsAgoHalf
        }).length
        break
        
      default:
        return 0
    }
    
    if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0
    return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100)
  }

  return (
    <Card className={`@container/card relative flex flex-col h-full ${className}`}>
      <CardHeader className="relative flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>New Hires</CardTitle>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
                <NumberFlow 
                  value={getNewHiresCount()}
                  transformTiming={{ duration: 750, easing: 'ease-out' }}
                  spinTiming={{ duration: 750, easing: 'ease-out' }}
                  opacityTiming={{ duration: 350, easing: 'ease-out' }}
                  className="text-2xl font-semibold tabular-nums"
                  style={{ '--number-flow-mask-height': '0.1em' } as React.CSSProperties}
                />
              </div>
              <CardDescription className="mt-1">Recently joined employees</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={`grid grid-cols-3 gap-1 rounded-lg text-xs bg-gray-200 dark:bg-zinc-800 transition-all duration-500 ease-out px-1.5 py-0.5 border-0 w-20 h-6 items-center ${
              getNewHiresPercentage() >= 0 
                ? 'text-green-700 dark:text-green-400' 
                : 'text-red-700 dark:text-red-400'
            }`}>
              <div className="flex items-center justify-center">
                <TrendingUpIcon className="size-3" />
              </div>
              <div className="flex items-center justify-center">
                {getNewHiresPercentage() >= 0 ? '+' : '-'}
                <NumberFlow 
                  value={Math.abs(getNewHiresPercentage())}
                  transformTiming={{ duration: 500, easing: 'ease-out' }}
                  spinTiming={{ duration: 500, easing: 'ease-out' }}
                  opacityTiming={{ duration: 250, easing: 'ease-out' }}
                  className="tabular-nums"
                  style={{ '--number-flow-mask-height': '0.05em' } as React.CSSProperties}
                />
              </div>
              <div className="flex items-center justify-center w-4">
                %
              </div>
            </Badge>
            <div className="text-xs text-muted-foreground text-right">
            </div>
          </div>
        </div>
      </CardHeader>
      
      {/* Flexible content area */}
      <div className="flex-1 min-h-0 flex flex-col justify-end">
        <CardFooter className="flex-col items-start gap-1 text-sm flex-shrink-0">
          <div className="mt-1">
            <AnimatedTabs
              tabs={[
                { title: "This Month", value: "month" },
                { title: "Last 3 Months", value: "quarter" },
                { title: "Last 6 Months", value: "half" }
              ]}
              containerClassName="rounded-lg"
              onTabChange={(tab) => setViewMode(tab.value as 'month' | 'quarter' | 'half')}
            />
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
