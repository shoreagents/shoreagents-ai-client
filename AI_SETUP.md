# AI Assistant Setup Guide

## Claude API Integration

The Job Request modal now includes an AI Assistant button that can auto-generate job descriptions, requirements, responsibilities, skills, benefits, and other fields based on the job title, industry, and department.

### Setup Steps

1. **Get Claude API Key**
   - Sign up at [Anthropic Console](https://console.anthropic.com/)
   - Create an API key
   - Copy your API key

2. **Environment Variables**
   Add this to your `.env.local` file:
   ```bash
   CLAUDE_API_KEY=your_claude_api_key_here
   ```

3. **Usage**
   - Fill in the Job Title field (required)
   - Optionally select Industry and Department
   - Click the "AI Assistant" button
   - The AI will generate comprehensive content for all fields
   - Review and adjust the generated content as needed

### Features

- **Auto-generation**: Creates job descriptions, requirements, responsibilities, skills, benefits
- **Smart suggestions**: Recommends experience level, work arrangement, and salary ranges
- **Philippine market awareness**: Suggests appropriate salary ranges for the local market
- **Industry-specific**: Tailors content based on industry and department selections

### API Endpoint

- **Route**: `/api/ai/generate-job`
- **Method**: POST
- **Body**: `{ jobTitle, industry?, department? }`
- **Response**: Generated job content in JSON format

### Error Handling

- Validates job title is provided
- Handles API errors gracefully
- Shows loading states during generation
- Provides user feedback on success/failure

### Security

- API key is stored server-side only
- No sensitive data is exposed to the client
- Rate limiting should be implemented in production
