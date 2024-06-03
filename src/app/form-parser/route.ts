import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { createExtractionChainFromZod } from "langchain/chains";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

const Schema = z
  .object({
    name: z.string().min(1).nullish().describe("The name of the person"),
    company: z.string().min(1).nullish().describe("The company of the person"),
    email: z.string().email().nullish().describe("The email of the person"),
    message: z.string().min(1).nullish().describe("Any other information provided by the user. Can be a general phrase or question"),
  })
  .describe("contact information for an business inquiry");

async function ParseTextToObject(
  text: string,
  schema: z.ZodObject<any>,
  model: ChatOpenAI
) {
  const chain = createExtractionChainFromZod(schema, model);
  const response = await chain.invoke({
    input: text,
  });
  return response.text;
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    console.log(text);
    if (!text) {
      return new Response("No text provided", { status: 400 });
    }
    const response = await ParseTextToObject(text, Schema, model);

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("An error occurred", { status: 500 });
  }
}
