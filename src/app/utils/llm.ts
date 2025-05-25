import { OpenAI } from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function callAI(context: string, query: string) {
    const prompt = `
You are an AI assistant that answers questions using the provided context from documents.

Use ONLY the information given in the context below to answer the user's question. If the answer is not contained in the context, respond politely that you don't have the information.

Context:
${context}

User question:
${query}

Answer:
`.trim();

    try {
        const completion = await client.chat.completions.create({
            model: "deepseek/deepseek-r1:free",
            messages: [{ role: "user", content: prompt }],
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("callAI error:", error);
        throw error;
    }
}

