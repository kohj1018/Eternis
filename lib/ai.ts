import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export async function generateSummaryAndTags(content: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes notes and suggests tags. Return a JSON object with 'summary' (3 lines max) and 'tags' (array of 3 strings max).",
        },
        {
          role: "user",
          content: `Summarize this note and suggest tags:\n\n${content}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(
      response.choices[0]?.message?.content ?? "{}",
    ) as {
      summary: string;
      tags: string[];
    };

    return {
      summary: result.summary ?? "",
      tags: result.tags ?? [],
    };
  } catch (error) {
    console.error("AI generation error:", error);
    return {
      summary: "",
      tags: [],
    };
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0]?.embedding ?? [];
  } catch (error) {
    console.error("Embedding generation error:", error);
    return [];
  }
}
