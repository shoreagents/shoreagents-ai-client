import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    console.log('Stats API called with userId:', userId)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Test query to see total closed tickets
    const totalClosedQuery = `
      SELECT COUNT(*) as count
      FROM public.tickets 
      WHERE status = 'Closed' 
        AND role_id = 1
    `
    const totalClosedResult = await pool.query(totalClosedQuery)
    const totalClosed = parseInt(totalClosedResult.rows[0]?.count || '0')
    console.log('Total closed tickets in system:', totalClosed)

    // Check if closed tickets have resolved_at values
    const closedWithResolvedAtQuery = `
      SELECT COUNT(*) as count
      FROM public.tickets 
      WHERE status = 'Closed' 
        AND role_id = 1
        AND resolved_at IS NOT NULL
    `
    const closedWithResolvedAtResult = await pool.query(closedWithResolvedAtQuery)
    const closedWithResolvedAt = parseInt(closedWithResolvedAtResult.rows[0]?.count || '0')
    console.log('Closed tickets with resolved_at:', closedWithResolvedAt)

    // Get current date in Asia/Manila timezone and calculate previous periods
    const now = new Date()
    
    // Create dates in Asia/Manila timezone
    const manilaToday = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Manila"}))
    const today = new Date(manilaToday.getFullYear(), manilaToday.getMonth(), manilaToday.getDate())
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Calculate week boundaries (Monday to Sunday)
    const getWeekStart = (date: Date) => {
      const d = new Date(date)
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
      return new Date(d.setDate(diff))
    }
    
    const thisWeekStart = getWeekStart(today)
    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)
    
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    
    // Get first day of current month in Manila timezone
    const firstDayOfCurrentMonth = new Date(manilaToday.getFullYear(), manilaToday.getMonth(), 1)
    
    // Get first day of previous month in Manila timezone
    const firstDayOfPreviousMonth = new Date(manilaToday.getFullYear(), manilaToday.getMonth() - 1, 1)

    // Calculate end dates properly
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // Fix: This Week should be exactly 7 days from today
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    const nextMonth = new Date(firstDayOfCurrentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    console.log('Date ranges:', {
      today: today.toISOString(),
      yesterday: yesterday.toISOString(),
      thisWeekStart: thisWeekStart.toISOString(),
      lastWeekStart: lastWeekStart.toISOString(),
      firstDayOfCurrentMonth: firstDayOfCurrentMonth.toISOString(),
      firstDayOfPreviousMonth: firstDayOfPreviousMonth.toISOString(),
      tomorrow: tomorrow.toISOString(),
      nextWeek: nextWeek.toISOString(),
      nextMonth: nextMonth.toISOString()
    })

    // Current period queries - no timezone conversion needed since DB stores Manila timezone
    const currentDayQuery = `
      SELECT COUNT(*) as count
      FROM public.tickets 
      WHERE status = 'Closed' 
        AND role_id = 1
        AND resolved_at >= $1
        AND resolved_at < $2
    `
    
    const currentWeekQuery = `
      SELECT COUNT(*) as count
      FROM public.tickets 
      WHERE status = 'Closed' 
        AND role_id = 1
        AND resolved_at >= $1
        AND resolved_at < $2
    `
    
    const currentMonthQuery = `
      SELECT COUNT(*) as count
      FROM public.tickets 
      WHERE status = 'Closed' 
        AND role_id = 1
        AND resolved_at >= $1
        AND resolved_at < $2
    `
    


    // Previous period queries - no timezone conversion needed since DB stores Manila timezone
    const previousDayQuery = `
      SELECT COUNT(*) as count
      FROM public.tickets 
      WHERE status = 'Closed' 
        AND role_id = 1
        AND resolved_at >= $1
        AND resolved_at < $2
    `
    
    const previousWeekQuery = `
      SELECT COUNT(*) as count
      FROM public.tickets 
      WHERE status = 'Closed' 
        AND role_id = 1
        AND resolved_at >= $1
        AND resolved_at < $2
    `
    
    const previousMonthQuery = `
      SELECT COUNT(*) as count
      FROM public.tickets 
      WHERE status = 'Closed' 
      AND role_id = 1
      AND resolved_at >= $1
      AND resolved_at < $2
    `
    


    // Execute queries
    const [
      currentDayResult,
      currentWeekResult,
      currentMonthResult,
      previousDayResult,
      previousWeekResult,
      previousMonthResult
    ] = await Promise.all([
      pool.query(currentDayQuery, [today.toISOString(), tomorrow.toISOString()]),
      pool.query(currentWeekQuery, [thisWeekStart.toISOString(), nextWeek.toISOString()]),
      pool.query(currentMonthQuery, [firstDayOfCurrentMonth.toISOString(), nextMonth.toISOString()]),
      pool.query(previousDayQuery, [yesterday.toISOString(), today.toISOString()]),
      pool.query(previousWeekQuery, [lastWeekStart.toISOString(), thisWeekStart.toISOString()]),
      pool.query(previousMonthQuery, [firstDayOfPreviousMonth.toISOString(), firstDayOfCurrentMonth.toISOString()])
    ])



    const currentDay = parseInt(currentDayResult.rows[0]?.count || '0')
    const currentWeek = parseInt(currentWeekResult.rows[0]?.count || '0')
    const currentMonth = parseInt(currentMonthResult.rows[0]?.count || '0')
    const previousDay = parseInt(previousDayResult.rows[0]?.count || '0')
    const previousWeek = parseInt(previousWeekResult.rows[0]?.count || '0')
    const previousMonth = parseInt(previousMonthResult.rows[0]?.count || '0')

    console.log('Stats calculation results:', {
      currentDay,
      currentWeek,
      currentMonth,
      previousDay,
      previousWeek,
      previousMonth,
      queries: {
        currentDay: { start: today.toISOString(), end: tomorrow.toISOString() },
        currentWeek: { start: thisWeekStart.toISOString(), end: nextWeek.toISOString() },
        currentMonth: { start: firstDayOfCurrentMonth.toISOString(), end: nextMonth.toISOString() },
        previousDay: { start: yesterday.toISOString(), end: today.toISOString() },
        previousWeek: { start: lastWeekStart.toISOString(), end: thisWeekStart.toISOString() },
        previousMonth: { start: firstDayOfPreviousMonth.toISOString(), end: firstDayOfCurrentMonth.toISOString() }
      }
    })



    // Calculate percentage changes
    const dailyChange = previousDay > 0 ? ((currentDay - previousDay) / previousDay) * 100 : 0
    const weeklyChange = previousWeek > 0 ? ((currentWeek - previousWeek) / previousWeek) * 100 : 0
    const monthlyChange = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0

    return NextResponse.json({
      daily: {
        current: currentDay,
        previous: previousDay,
        change: Math.round(dailyChange * 100) / 100 // Round to 2 decimal places
      },
      weekly: {
        current: currentWeek,
        previous: previousWeek,
        change: Math.round(weeklyChange * 100) / 100 // Round to 2 decimal places
      },
      monthly: {
        current: currentMonth,
        previous: previousMonth,
        change: Math.round(monthlyChange * 100) / 100 // Round to 2 decimal places
      }
    })
  } catch (error) {
    console.error('Error fetching ticket stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ticket statistics' },
      { status: 500 }
    )
  }
} 