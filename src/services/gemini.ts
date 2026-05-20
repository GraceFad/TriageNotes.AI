import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export interface EHRData {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  vitals: {
    temperature?: string;
    bloodPressure?: string;
    heartRate?: string;
    respiratoryRate?: string;
    oxygenSaturation?: string;
  };
  allergies: string[];
  medications: string[];
  pastMedicalHistory: string[];
  triagePriority: "Level 1 (Resuscitation)" | "Level 2 (Emergent)" | "Level 3 (Urgent)" | "Level 4 (Less Urgent)" | "Level 5 (Non-Urgent)";
  recommendedAction: string;
  summary: string;
}

export async function transcribeAndExtract(audioBlob: Blob): Promise<{ transcription: string; ehrData: EHRData }> {
  // 1. Convert blob to base64
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve) => {
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
  });
  reader.readAsDataURL(audioBlob);
  const base64Audio = await base64Promise;

  // 2. Transcription and Extraction in one go (or two if needed, but one is more efficient)
  // We'll ask Gemini to transcribe the audio AND extract the data in a structured format.
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: audioBlob.type,
              data: base64Audio,
            },
          },
          {
            text: `You are a medical scribe. Transcribe the provided audio of a nurse triaging a patient. 
            Then, extract the information into a structured Electronic Health Record (EHR) format.
            
            Return the result in JSON format with the following structure:
            {
              "transcription": "The full verbatim transcription",
              "ehrData": {
                "chiefComplaint": "string",
                "historyOfPresentIllness": "string",
                "vitals": {
                  "temperature": "string",
                  "bloodPressure": "string",
                  "heartRate": "string",
                  "respiratoryRate": "string",
                  "oxygenSaturation": "string"
                },
                "allergies": ["string"],
                "medications": ["string"],
                "pastMedicalHistory": ["string"],
                "triagePriority": "Level 1-5",
                "recommendedAction": "string",
                "summary": "A brief medical summary"
              }
            }`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          transcription: { type: Type.STRING },
          ehrData: {
            type: Type.OBJECT,
            properties: {
              chiefComplaint: { type: Type.STRING },
              historyOfPresentIllness: { type: Type.STRING },
              vitals: {
                type: Type.OBJECT,
                properties: {
                  temperature: { type: Type.STRING },
                  bloodPressure: { type: Type.STRING },
                  heartRate: { type: Type.STRING },
                  respiratoryRate: { type: Type.STRING },
                  oxygenSaturation: { type: Type.STRING },
                },
              },
              allergies: { type: Type.ARRAY, items: { type: Type.STRING } },
              medications: { type: Type.ARRAY, items: { type: Type.STRING } },
              pastMedicalHistory: { type: Type.ARRAY, items: { type: Type.STRING } },
              triagePriority: { type: Type.STRING },
              recommendedAction: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ["chiefComplaint", "historyOfPresentIllness", "triagePriority", "summary"],
          },
        },
        required: ["transcription", "ehrData"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  return result;
}
