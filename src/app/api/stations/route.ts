import { NextRequest, NextResponse } from 'next/server'
import { getAllStations, assignUserToStation, getUserStation } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const stations = await getAllStations()
    return NextResponse.json(stations)
  } catch (error) {
    console.error('Error fetching stations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, stationId } = body
    
    if (!userId || !stationId) {
      return NextResponse.json(
        { error: 'userId and stationId are required' },
        { status: 400 }
      )
    }
    
    await assignUserToStation(userId, stationId)
    
    return NextResponse.json({ 
      message: 'User assigned to station successfully',
      userId,
      stationId
    })
  } catch (error) {
    console.error('Error assigning user to station:', error)
    return NextResponse.json(
      { error: 'Failed to assign user to station' },
      { status: 500 }
    )
  }
} 