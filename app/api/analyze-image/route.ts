import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const message = (formData.get("message") as string) || ""
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Convert the image file to base64
    const imageBuffer = await imageFile.arrayBuffer()
    const imageBase64 = Buffer.from(imageBuffer).toString("base64")
    const mimeType = imageFile.type
    const dataURI = `data:${mimeType};base64,${imageBase64}`

    // First, determine if the image is a resume
    const imageTypePrompt = `You are an AI assistant that identifies the type of an uploaded image.
    Determine whether the image is a 'resume' or 'other'.
    
    Return your response in JSON format:
    {
        "intent": "resume" or "other"
    }

    Respond only with valid JSON. There should be no text or backticks before or after the JSON.`

    const imageTypeResponse = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: imageTypePrompt,
      images: [dataURI],
    })

    // Parse the image type response
    let imageType
    try {
      imageType = JSON.parse(imageTypeResponse.text.trim())
    } catch (error) {
      console.error("Error parsing image type JSON:", error)
      imageType = { intent: "other" }
    }

    let finalResponse

    if (imageType.intent === "resume") {
      // Handle resume analysis
      const resumePrompt = `You are an AI resume expert. Analyze the following resume image and provide feedback on any improvements, refinements, or upgrades needed. Focus on formatting, clarity, relevant skills, and industry standards.
      
      User message: "${message}"
      
      Provide a detailed analysis with specific suggestions for improvement. Structure your response with clear sections for:
      1. Overall impression
      2. Content and skills assessment
      3. Formatting and design
      4. Specific improvement recommendations`

      const response = await generateText({
        model: google("gemini-2.0-flash"),
        prompt: resumePrompt,
        images: [dataURI],
      })

      finalResponse = response.text
    } else {
      // Handle other image types
      finalResponse = "I can only analyze resume images. Please upload a resume for professional feedback."
    }

    return NextResponse.json({ text: finalResponse })
  } catch (error) {
    console.error("Error in image analysis API:", error)
    return NextResponse.json({ error: "An error occurred while processing your image" }, { status: 500 })
  }
}
