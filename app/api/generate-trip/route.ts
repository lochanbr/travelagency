import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
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
    const { destination, days, budget, currency, interests } = await req.json()

    const systemPrompt = `You are an expert AI travel planner. Given the destination, budget, number of days, and interests, create a comprehensive travel plan. Be specific and practical with your recommendations. Tailor the itinerary to the interests provided.`

    const userPrompt = `Plan a trip with the following details:
- Destination: ${destination}
- Number of Days: ${days}
- Budget: ${budget} ${currency}
- Interests: ${interests.join(', ')}

Create a detailed travel plan that fits within the budget and caters to the specified interests. Include specific restaurant names, attraction names, and practical tips for the destination.`

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      schema: tripPlanSchema,
      prompt: userPrompt,
    })

    return Response.json({ tripPlan: object })
  } catch (error: any) {
    console.error("API Error:", error);
    return Response.json({ error: error.message || String(error) }, { status: 500 });
  }
}
