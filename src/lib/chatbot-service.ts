import { ChatAnthropic } from "@langchain/anthropic"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from "@langchain/core/messages"
import { cacheHelpers } from './cache'
import { retrieveContextForTalent, indexTalentProfileDoc, isRagAvailable, enhancedRetrieveContext } from './rag'

// Message interface for chat
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    talentId?: string
    analysisType?: string
    confidence?: number
    model?: string
    ragSources?: Array<{ content: string; metadata: any; score: number }>
  }
}

// Talent profile interface for AI context
interface TalentProfile {
  id: string
  name: string
  position?: string
  skills: string[]
  experience?: string
  description: string
  hourlyRate: number
  rating: number
  education?: any[]
  projects?: any[]
  certifications?: string[]
  languages?: string[]
}

class TalentChatbotService {
  private llm: ChatAnthropic
  private outputParser: StringOutputParser

  constructor() {
    this.llm = new ChatAnthropic({
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.3,
      maxTokens: 1000,
      apiKey: process.env.CLAUDE_API_KEY,
    })
    this.outputParser = new StringOutputParser()
  }

  // Create LLM with fallback models
  private async createLLMWithFallback() {
    const models = [
      "claude-3-5-sonnet-20241022",
      "claude-3-sonnet-20240229", 
      "claude-3-haiku-20240307"
    ]

    for (const model of models) {
      try {
        const llm = new ChatAnthropic({
          model,
          temperature: 0.3,
          maxTokens: 1000,
          apiKey: process.env.CLAUDE_API_KEY,
        })
        // Test the model with a simple ping
        await llm.invoke([{ role: "user", content: "Hi" }])
        console.log(`Successfully connected to Claude model: ${model}`)
        return llm
      } catch (error) {
        console.warn(`Model ${model} not available, trying next...`)
        continue
      }
    }
    
    throw new Error('No Claude models available. Please check your API key and model access.')
  }

  // System prompt for talent analysis and conversation
  private getSystemPrompt(talent: TalentProfile): string {
    return `You are an AI assistant specializing in talent analysis and recruitment insights. You are currently analyzing and discussing the profile of ${talent.name}, a ${talent.position || 'professional'} with ${talent.experience || 'relevant'} experience.

**Talent Profile Overview:**
- Name: ${talent.name}
- Position: ${talent.position || 'Not specified'}
- Experience Level: ${talent.experience || 'Not specified'}
- Hourly Rate: ₱${talent.hourlyRate.toLocaleString()}/month
- Rating: ${talent.rating}/5
- Skills: ${talent.skills.join(', ')}
- Languages: ${talent.languages?.join(', ') || 'Not specified'}
- Description: ${talent.description}

**Your Role:**
1. **Talent Analysis**: Provide insights about the candidate's strengths, areas for improvement, and market positioning
2. **Recruitment Guidance**: Offer recommendations for roles, interview questions, and evaluation criteria
3. **Skill Assessment**: Analyze technical and soft skills based on the profile
4. **Market Intelligence**: Provide context about salary expectations, skill demand, and industry trends
5. **Team Fit**: Suggest team compositions and project assignments

**Guidelines:**
- Be professional and objective in your analysis
- Provide actionable insights backed by the available profile data
- Ask clarifying questions when more information would help
- Suggest specific next steps for the recruitment process
- Consider cultural fit and team dynamics
- Be honest about limitations in your analysis based on available information

**Response Style:**
- Keep responses concise but comprehensive
- Use bullet points for lists and recommendations
- Include confidence levels when making assessments
- Suggest follow-up questions or actions when appropriate

Remember: Base your analysis on the provided profile data and general industry knowledge. Be transparent when making assumptions or when additional information would be beneficial.`
  }

  // Create chat prompt template with optional RAG context
  private createChatPrompt(talent: TalentProfile, ragContext?: string): ChatPromptTemplate {
    const messages: any[] = [["system", this.getSystemPrompt(talent)]]
    if (ragContext && ragContext.trim().length > 0) {
      messages.push(["system", `Additional context (retrieved):\n${ragContext}`])
    }
    messages.push(new MessagesPlaceholder("chat_history"))
    messages.push(["human", "{input}"])
    return ChatPromptTemplate.fromMessages(messages as any)
  }

  // Convert our ChatMessage format to LangChain messages
  private convertToLangChainMessages(messages: ChatMessage[]): BaseMessage[] {
    return messages.map(msg => {
      switch (msg.role) {
        case 'user':
          return new HumanMessage(msg.content)
        case 'assistant':
          return new AIMessage(msg.content)
        case 'system':
          return new SystemMessage(msg.content)
        default:
          return new HumanMessage(msg.content)
      }
    })
  }

  // Main chat method
  async chat(
    message: string,
    talentId: string,
    talent: TalentProfile,
    conversationHistory: ChatMessage[] = [],
    conversationId: string = 'default'
  ): Promise<ChatMessage> {
    try {
      // Try to get cached conversation first
      const cachedHistory = await cacheHelpers.getChatConversation(talentId, conversationId)
      if (cachedHistory && cachedHistory.length > conversationHistory.length) {
        conversationHistory = cachedHistory
      }

      // Enhanced RAG retrieval with sources
      let ragContext = ""
      let ragSources: any[] = []
      try {
        if (await isRagAvailable()) {
          // Ensure at least the talent profile is indexed (idempotent add)
          await indexTalentProfileDoc({
            id: talent.id,
            name: talent.name,
            position: talent.position,
            skills: talent.skills,
            experience: talent.experience,
            description: talent.description,
          })
          
          // Use enhanced retrieval for better context
          const { context, sources } = await enhancedRetrieveContext(message, talentId, 4)
          ragContext = context
          ragSources = sources
        }
      } catch (_) {
        ragContext = ""
        ragSources = []
      }

      // Create the chat chain with optional RAG context
      const prompt = this.createChatPrompt(talent, ragContext)
      let llmToUse = this.llm
      
      const chain = RunnableSequence.from([
        prompt,
        llmToUse,
        this.outputParser
      ])

      // Convert conversation history to LangChain format
      const chatHistory = this.convertToLangChainMessages(conversationHistory)

      // Generate response
      const response = await chain.invoke({
        input: message,
        chat_history: chatHistory
      })

      // Create response message
      const responseMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: {
          talentId,
          confidence: 0.85, // You could implement actual confidence scoring
          ragSources: ragSources.length > 0 ? ragSources : undefined
        }
      }

      // Update conversation history
      const updatedHistory = [
        ...conversationHistory,
        {
          id: `msg_${Date.now()}_user`,
          role: 'user' as const,
          content: message,
          timestamp: new Date(),
          metadata: { talentId }
        },
        responseMessage
      ]

      // Cache the updated conversation
      await cacheHelpers.setChatConversation(talentId, conversationId, updatedHistory)

      return responseMessage
    } catch (error: any) {
      console.error('Error in chatbot service:', error)
      
      // If it's a model not found error, try with a different model
      if (error?.message?.includes('404') || error?.lc_error_code === 'MODEL_NOT_FOUND') {
        console.log('Attempting to use fallback Claude model...')
        try {
          // Try with Claude 3 Haiku (more commonly available)
          const fallbackLLM = new ChatAnthropic({
            model: "claude-3-haiku-20240307",
            temperature: 0.3,
            maxTokens: 1000,
            apiKey: process.env.CLAUDE_API_KEY,
          })
          
          const prompt = this.createChatPrompt(talent)
          const fallbackChain = RunnableSequence.from([
            prompt,
            fallbackLLM,
            this.outputParser
          ])
          
          // Convert conversation history to LangChain format
          const chatHistory = this.convertToLangChainMessages(conversationHistory)

          // Generate response with fallback model
          const response = await fallbackChain.invoke({
            input: message,
            chat_history: chatHistory
          })

          // Create response message
          const responseMessage: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: response,
            timestamp: new Date(),
            metadata: {
              talentId,
              confidence: 0.8,
              model: 'claude-3-haiku-20240307'
            }
          }

          // Update conversation history
          const updatedHistory = [
            ...conversationHistory,
            {
              id: `msg_${Date.now()}_user`,
              role: 'user' as const,
              content: message,
              timestamp: new Date(),
              metadata: { talentId }
            },
            responseMessage
          ]

          // Cache the updated conversation
          await cacheHelpers.setChatConversation(talentId, conversationId, updatedHistory)

          console.log('Successfully used fallback model: claude-3-haiku-20240307')
          return responseMessage
        } catch (fallbackError) {
          console.error('Fallback model also failed:', fallbackError)
        }
      }
      
      throw new Error(`Failed to generate AI response. Please check your Claude API key and model access. Error: ${error?.message || 'Unknown error'}`)
    }
  }

  // Analyze talent profile and generate insights
  async analyzeTalent(talent: TalentProfile): Promise<any> {
    try {
      // Check cache first
      const cachedAnalysis = await cacheHelpers.getTalentAnalysis(talent.id)
      if (cachedAnalysis) {
        return cachedAnalysis
      }

      const analysisPrompt = `Analyze this talent profile comprehensively:

**Profile Data:**
${JSON.stringify(talent, null, 2)}

**Required Analysis:**
1. **Strengths Assessment**: Top 3-5 key strengths
2. **Skill Gaps**: Areas for potential improvement or development
3. **Market Positioning**: How competitive is this profile in the current market?
4. **Salary Analysis**: Is the hourly rate appropriate for their skill level and experience?
5. **Role Recommendations**: What positions would be ideal for this candidate?
6. **Interview Focus Areas**: Key areas to explore in interviews
7. **Red Flags**: Any potential concerns or areas needing clarification
8. **Team Fit Scenarios**: What type of teams/projects would benefit from this talent?

Please provide structured analysis in JSON format with clear categories and actionable insights.`

      const response = await this.llm.invoke([
        new SystemMessage("You are an expert talent analyst. Provide detailed, objective analysis in JSON format."),
        new HumanMessage(analysisPrompt)
      ])

      let analysis
      try {
        analysis = JSON.parse(response.content as string)
      } catch (parseError) {
        // If JSON parsing fails, create structured analysis from text
        analysis = {
          summary: response.content,
          strengths: ["Analysis generated - see summary for details"],
          areas_for_improvement: ["See detailed analysis in summary"],
          market_positioning: "Competitive candidate",
          salary_assessment: "Rate appears market-appropriate",
          recommended_roles: ["See summary for role recommendations"],
          interview_focus: ["See summary for interview guidance"],
          confidence_score: 0.8
        }
      }

      // Cache the analysis
      await cacheHelpers.setTalentAnalysis(talent.id, analysis)

      return analysis
    } catch (error) {
      console.error('Error analyzing talent:', error)
      throw new Error('Failed to analyze talent profile')
    }
  }

  // Generate conversation starters based on talent profile
  generateConversationStarters(talent: TalentProfile): string[] {
    const starters = [
      `What are ${talent.name}'s key strengths for ${talent.position || 'their role'}?`,
      `How does ${talent.name} compare to other candidates in this salary range?`,
      `What interview questions would best evaluate ${talent.name}'s skills?`,
      `What type of projects would be ideal for ${talent.name}?`,
      `Are there any skill gaps I should be concerned about?`,
      `How could ${talent.name} fit into different team structures?`
    ]

    // Add skill-specific starters if they have notable skills
    if (talent.skills.length > 0) {
      starters.push(`Tell me more about ${talent.name}'s ${talent.skills[0]} expertise`)
    }

    return starters
  }

  // Get conversation history
  async getConversationHistory(talentId: string, conversationId: string = 'default'): Promise<ChatMessage[]> {
    try {
      const history = await cacheHelpers.getChatConversation(talentId, conversationId)
      return history || []
    } catch (error) {
      console.error('Error getting conversation history:', error)
      return []
    }
  }

  // Clear conversation history
  async clearConversation(talentId: string, conversationId: string = 'default'): Promise<void> {
    try {
      await cacheHelpers.clearCache(`chat:${talentId}:${conversationId}`)
    } catch (error) {
      console.error('Error clearing conversation:', error)
    }
  }
}

// Export singleton instance
export const talentChatbotService = new TalentChatbotService()
export default TalentChatbotService
