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
            "당신은 노트를 요약하고 태그를 추천하는 도우미입니다. 반드시 한국어로 응답해야 합니다. 'summary' (최대 3줄)와 'tags' (최대 3개의 문자열 배열) 필드를 가진 JSON 객체를 반환하세요. 태그는 반드시 한국어로 작성하되, 영어 고유명사나 기술 용어가 필수적인 경우에만 영어를 사용하세요.",
        },
        {
          role: "user",
          content: `다음 노트를 한국어로 요약하고 한국어 태그를 제안해주세요:\n\n${content}`,
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
