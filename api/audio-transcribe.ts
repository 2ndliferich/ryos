import OpenAI from "openai";

interface OpenAIError {
  status: number;
  message: string;
  error?: {
    message: string;
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  runtime: "edge",
};

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB limit imposed by OpenAI

export default async function originalHandler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response(JSON.stringify({ error: "No audio file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify file type
    if (!audioFile.type.startsWith("audio/")) {
      return new Response(
        JSON.stringify({ error: "Invalid file type. Must be an audio file." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify file size
    if (audioFile.size > MAX_FILE_SIZE_BYTES) {
      return new Response(
        JSON.stringify({
          error: `File exceeds maximum size of ${
            MAX_FILE_SIZE_BYTES / (1024 * 1024)
          }MB`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
    });

    return new Response(JSON.stringify({ text: transcription.text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error processing audio:", error);
    const openAIError = error as OpenAIError;
    return new Response(
      JSON.stringify({
        error: openAIError.message || "Error processing audio",
        details: openAIError.error?.message,
      }),
      {
        status: openAIError.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export const handler = async (event, context) => {
  try {
    const request = new Request(event.rawUrl || `https://${event.headers.host}${event.path}`, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD' ? event.body : undefined
    });
    
    const response = await originalHandler(request);
    
    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text()
    };
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
