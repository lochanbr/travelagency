import { generateObject } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'

const tripPlanSchema = z.object({
  overview: z.string().describe('A brief overview of the trip'),
  budgetBreakdown: z.object({
    flights: z.number().describe('Estimated flight cost'),
    accommodation: z.number().describe('Estimated accommodation cost'),
    food: z.number().describe('Estimated food cost'),
    activities: z.number().describe('Estimated activities cost'),
    transport: z.number().describe('Estimated local transport cost'),
    contingency: z.number().describe('Emergency/contingency fund'),
  }),
  itinerary: z.array(
    z.object({
      day: z.number().describe('Day number'),
      theme: z.string().describe('Theme for the day'),
      morning: z.string().describe('Morning activities'),
      afternoon: z.string().describe('Afternoon activities'),
      evening: z.string().describe('Evening activities'),
      highlight: z.string().describe('Main highlight of the day'),
    })
  ),
  foodRecommendations: z.array(
    z.object({
      name: z.string().describe('Restaurant or dish name'),
      type: z.string().describe('Meal type: breakfast, lunch, or dinner'),
      description: z.string().describe('Description of the food'),
      priceRange: z.string().describe('Price range: $, $$, $$$, or $$$$'),
    })
  ),
  topAttractions: z.array(
    z.object({
      name: z.string().describe('Attraction name'),
      category: z.string().describe('Category like museum, landmark, nature'),
      description: z.string().describe('Brief description'),
      bestTime: z.string().describe('Best time to visit'),
      tip: z.string().describe('Insider tip for visitors'),
    })
  ),
  packingList: z.object({
    essentials: z.array(z.string()).describe('Essential items'),
    clothing: z.array(z.string()).describe('Clothing items'),
    electronics: z.array(z.string()).describe('Electronics to bring'),
    healthSafety: z.array(z.string()).describe('Health and safety items'),
    activitySpecific: z.array(z.string()).describe('Activity-specific items'),
  }),
  quickTips: z.array(z.string()).describe('5 quick tips for the trip'),
})

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey || apiKey === 'your_google_api_key_here') {
      return Response.json(
        { error: 'Please set a valid GOOGLE_GENERATIVE_AI_API_KEY in your .env.local file. Get one from https://aistudio.google.com/apikey' },
        { status: 500 }
      )
    }

    const google = createGoogleGenerativeAI({ apiKey })

    const { destination, days, budget, currency, interests } = await req.json()

    const systemPrompt = `You are an expert AI travel planner. Given the destination, budget, number of days, and interests, create a comprehensive travel plan. Be specific and practical with your recommendations. Tailor the itinerary to the interests provided.`

    const userPrompt = `Plan a trip with the following details:
- Destination: ${destination}
- Number of Days: ${days}
- Budget: ${budget} ${currency}
- Interests: ${interests.join(', ')}

Create a detailed travel plan that fits within the budget and caters to the specified interests. Include specific restaurant names, attraction names, and practical tips for the destination.`

    const { object } = await generateObject({
      model: google('gemini-2.0-flash'),
      system: systemPrompt,
      schema: tripPlanSchema,
      prompt: userPrompt,
    })

    return Response.json({ tripPlan: object })
  } catch (error: any) {
    console.error("API Error:", error);
    
    let errorMessage = error.message || String(error);
    
    // Check for the specific "limit: 0" free tier error
    if (errorMessage.includes("limit: 0") && errorMessage.includes("free_tier")) {
      errorMessage = "The Gemini API Free Tier is not available in your current region (this affects regions like the UK, EU, and Switzerland). To fix this, you need to either set up a billing account in Google AI Studio / Google Cloud, or use the API from a region that supports the Free Tier.";
    }

    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
