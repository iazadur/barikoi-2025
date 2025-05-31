import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    try {
        // Parse and validate input
        const body = await request.json();
        const { imageUrl } = ImageInputSchema.parse(body);

        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Fetch the image data
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString('base64');

        // Get the content type and ensure it's a supported image format
        const contentType = imageResponse.headers.get('content-type');
        let mimeType = 'image/jpeg'; // Default fallback

        if (contentType) {
            if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
                mimeType = 'image/jpeg';
            } else if (contentType.includes('image/png')) {
                mimeType = 'image/png';
            } else if (contentType.includes('image/webp')) {
                mimeType = 'image/webp';
            } else if (contentType.includes('image/gif')) {
                mimeType = 'image/gif';
            }
            // For any other content type, default to image/jpeg
        }

        const prompt = `Analyze this 360-degree street view image and extract Points of Interest (POIs) such as shops or landmarks. 
                        Return a JSON object with a "pois" array containing objects with:
                        - name: string (name of the POI)
                        - poi_type: string (type of POI)
                        - phone: string (phone number if visible)
                        - category: string (category of the business)
                        - address: string (address if visible)
                        - coordinates: array of numbers (if inferable)
                        
                        Return only valid JSON without any markdown formatting.`;

        // Call Gemini's vision model to extract POIs
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: mimeType,
                },
            },
        ]);

        const responseText = result.response.text();
        console.log('Gemini response:', responseText);

        // Clean the response text (remove markdown formatting if present)
        const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse and validate the response
        const parsedData = JSON.parse(cleanedResponse);
        const data = PoiResponseSchema.parse(parsedData);

        // Return validated POIs
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Gemini API error:', error);

        // Handle errors
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input or response format', details: error.errors }, { status: 400 });
        }

        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON response from Gemini' }, { status: 500 });
        }

        return NextResponse.json({ error: 'Failed to process image with Gemini' }, { status: 500 });
    }
}
