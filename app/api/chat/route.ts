import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

// Set max duration for streaming responses
export const maxDuration = 30

// Define the interface for the request body
interface RequestBody {
  message: string
  history: Array<{ role: string; content: string }>
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = (await req.json()) as RequestBody
    const { message, history } = body

    // Create context from chat history
    const context = history.map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`).join("\n\n")

    // Determine user intent
    const intentPrompt = `You are an AI assistant specializing in providing advice related to careers, job opportunities, and job searches. Analyze the following prompt to determine the user's intent: "${message}"

    Return your analysis in JSON format with two fields:
    - "intent": Must be one of "career_guidance", "job_search", or "other"
    - "query": If intent is "job_search", extract the key search terms (e.g., job title, location, or industry). Otherwise, use null.

    Respond ONLY with the raw JSON object, no markdown formatting, no backticks, no additional text. Example response:
    {"intent": "career_guidance", "query": null}`

    const intentResponse = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: intentPrompt,
    })

    // Parse the intent response
    let intent
    try {
      // Clean the response by removing any markdown formatting
      const cleanResponse = intentResponse.text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
      intent = JSON.parse(cleanResponse)
    } catch (error) {
      console.error("Error parsing intent JSON:", error)
      intent = { intent: "other", query: null }
    }

    let finalResponse

    if (intent.intent === "career_guidance") {
      // Handle career guidance
      const guidancePrompt = `You are an AI career mentor providing expert career guidance.
      Previous conversation: ${context}
      The user asks: "${message}"
      Provide a well-structured and concise response with helpful career advice.`

      const response = await generateText({
        model: google("gemini-2.0-flash"),
        prompt: guidancePrompt,
      })

      finalResponse = response.text
    } else if (intent.intent === "job_search") {
      // Handle job search
      const jobs = await getJobListings(intent.query)

      const jobPrompt = `You are a job search assistant. 
      Previous conversation: ${context}
      The user is looking for jobs matching "${intent.query}".
      The job listings found: "${jobs}"
      Provide a helpful response that summarizes the job opportunities and offers advice on how to apply or prepare for these roles.`

      const response = await generateText({
        model: google("gemini-2.0-flash"),
        prompt: jobPrompt,
      })

      finalResponse = response.text
    } else {
      // Handle general queries
      const generalPrompt = `You are an AI career mentor. 
      Previous conversation: ${context}
      The user says: "${message}"
      Provide a helpful response. If their query is not related to careers, politely guide them back to career-related topics.`

      const response = await generateText({
        model: google("gemini-2.0-flash"),
        prompt: generalPrompt,
      })

      finalResponse = response.text
    }

    return NextResponse.json({ text: finalResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

// Function to get job listings from RapidAPI
async function getJobListings(query: string | null): Promise<string> {
  if (!query || typeof query !== 'string') {
    return "No specific job search terms provided."
  }

  const formattedQuery = query.replace(/\s+/g, "+")

  try {
    const url = `https://jsearch.p.rapidapi.com/search?query=${formattedQuery}&page=1&num_pages=1`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    const jobs = data.data || []

    if (jobs.length === 0) {
      return "No jobs found for this query."
    }

    // Format job listings
    const jobItems = jobs.slice(0, 3).map((job: any) => {
      const title = job.job_title || "Unknown Title"
      const company = job.employer_name || "Unknown Company"
      const location = job.job_location || "Unknown Location"
      const link = job.job_apply_link || "#"

      return `• ${title} at ${company}, ${location}\n  ${link}`
    })

    return jobItems.join("\n\n")
  } catch (error) {
    console.error("Error fetching job listings:", error)
    return "Unable to fetch job listings at this time."
  }
}
