import { NextRequest, NextResponse } from 'next/server'
import { talentChatbotService, ChatMessage } from '@/lib/chatbot-service'
import { cacheHelpers } from '@/lib/cache'

// Mock talent data fetcher - replace with your actual data source
async function getTalentById(talentId: string) {
  // This should fetch from your actual database
  // For now, returning a mock structure that matches your existing data
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/talent-pool/${talentId}`)
    if (response.ok) {
      const talent = await response.json()
      return talent
    }
  } catch (error) {
    console.error('Error fetching talent:', error)
  }
  
  // Fallback mock data structure
  return {
    id: talentId,
    name: 'Unknown Candidate',
    position: 'Professional',
    skills: [],
    experience: 'Not specified',
    description: 'Profile information not available',
    hourlyRate: 0,
    rating: 0,
    education: [],
    projects: [],
    certifications: [],
    languages: []
  }
}

// POST - Send a message to the chatbot
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const talentId = params.id
    const body = await request.json()
    const { message, conversationId = 'default', conversationHistory = [] } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get talent profile
    const talent = await getTalentById(talentId)
    if (!talent) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      )
    }

    // Generate AI response
    const response = await talentChatbotService.chat(
      message,
      talentId,
      talent,
      conversationHistory,
      conversationId
    )

    // Get updated conversation history
    const updatedHistory = await talentChatbotService.getConversationHistory(talentId, conversationId)

    return NextResponse.json({
      success: true,
      message: response,
      conversationHistory: updatedHistory,
      metadata: {
        talentId,
        conversationId,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chatbot request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// GET - Retrieve conversation history or conversation starters
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const talentId = params.id
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId') || 'default'
    const action = searchParams.get('action')

    // Get talent profile
    const talent = await getTalentById(talentId)
    if (!talent) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      )
    }

    if (action === 'starters') {
      // Return conversation starter suggestions
      const starters = talentChatbotService.generateConversationStarters(talent)
      return NextResponse.json({
        success: true,
        starters,
        talent: {
          id: talent.id,
          name: talent.name,
          position: talent.position
        }
      })
    }

    if (action === 'analysis') {
      // Return AI analysis of the talent
      const analysis = await talentChatbotService.analyzeTalent(talent)
      return NextResponse.json({
        success: true,
        analysis,
        talent: {
          id: talent.id,
          name: talent.name,
          position: talent.position
        }
      })
    }

    // Default: return conversation history
    const conversationHistory = await talentChatbotService.getConversationHistory(talentId, conversationId)
    
    return NextResponse.json({
      success: true,
      conversationHistory,
      conversationId,
      talent: {
        id: talent.id,
        name: talent.name,
        position: talent.position
      }
    })

  } catch (error) {
    console.error('Chatbot GET API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve chatbot data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// DELETE - Clear conversation history
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const talentId = params.id
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId') || 'default'

    await talentChatbotService.clearConversation(talentId, conversationId)

    return NextResponse.json({
      success: true,
      message: 'Conversation history cleared',
      conversationId
    })

  } catch (error) {
    console.error('Chatbot DELETE API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to clear conversation',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// PUT - Update conversation settings or regenerate analysis
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const talentId = params.id
    const body = await request.json()
    const { action, ...data } = body

    const talent = await getTalentById(talentId)
    if (!talent) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      )
    }

    if (action === 'regenerate_analysis') {
      // Clear cached analysis and regenerate
      await cacheHelpers.clearCache(`talent_analysis:${talentId}`)
      const analysis = await talentChatbotService.analyzeTalent(talent)
      
      return NextResponse.json({
        success: true,
        analysis,
        message: 'Analysis regenerated successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action specified' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Chatbot PUT API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update chatbot data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
