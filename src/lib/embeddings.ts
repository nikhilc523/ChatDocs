import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });

    const result = await response.json();

    if (!result?.data?.[0]?.embedding) {
      console.error("OpenAI Embedding Error Response:", result);
      throw new Error("Invalid embedding response from OpenAI.");
    }

    return result.data[0].embedding as number[];
  } catch (error) {
    console.error("Error calling OpenAI Embeddings API:", error);
    throw error;
  }
}
