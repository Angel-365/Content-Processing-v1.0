import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();
    
    if (!imageBase64) {
      return NextResponse.json({ success: false, error: "No image content provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Simulate detection delay and return rich synthetic JSON response matching the brand system
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY not configured. Falling back to simulated detection."
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64,
      },
    };

    const promptString = `Analyze this security camera frame or visitor photo for visitor intelligence. Extract details of the prominent visitor in the image.
Return a structured JSON object with the following properties (comply strictly with this structure, do not wrap in additional levels):
{
  "status": "New" or "Returning",
  "gender": "Male" or "Female" or "Non-binary",
  "age": number (integer representing approximate age),
  "city": "suggested city name",
  "country": "suggested country name",
  "reason": "Brief, ultra-realistic visual scenario, e.g. Business Meeting, Consultation, Interview, Delivery, Maintenance, Facility Inspection",
  "insights": "1-sentence AI analytical assessment of the detection context (e.g. 'Standard visitor check-in, credential matched, status normal.')"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: promptString }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "New or Returning status" },
            gender: { type: Type.STRING, description: "Male, Female, or Non-binary" },
            age: { type: Type.INTEGER, description: "Approximate age of the subject if visible" },
            city: { type: Type.STRING, description: "Suggested city" },
            country: { type: Type.STRING, description: "Suggested country" },
            reason: { type: Type.STRING, description: "Visual explanation or estimated reason for visit" },
            insights: { type: Type.STRING, description: "1-sentence threat assessment or check-in verification" }
          },
          required: ["status", "gender", "age", "city", "country", "reason", "insights"]
        }
      }
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(text);
    return NextResponse.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
