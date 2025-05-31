import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';

// Zod schemas for input and output validation
const ImageInputSchema = z.object({
  imageUrl: z.string().url(),
});

const PoiSchema = z.object({
  name: z.string(),
  poi_type: z.string(),
  phone: z.string(),
  category: z.string(),
  address: z.string(),
  coordinates: z.array(z.number()),
});

const PoiResponseSchema = z.object({
  pois: z.array(PoiSchema),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Parse and validate input
    const body = await request.json();
    const { imageUrl } = ImageInputSchema.parse(body);

    // Call OpenAI's vision model to extract POIs
    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this 360-degree street view image and extract Points of Interest (POIs) such as shops or landmarks. Return a JSON object with a "pois" array containing objects with name, category, address (if visible), and coordinates (if inferable).',
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      response_format: zodResponseFormat(PoiResponseSchema, 'json_object'),
    });

    // Validate OpenAI response
    const content = response.choices[0].message.parsed ?? { pois: [] }; // Fallback to empty POIs if null
    console.log(content)
    const data = PoiResponseSchema.parse(content); // No need for JSON.parse

    // Return validated POIs
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // Handle errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}