import { GoogleGenerativeAI } from "@google/generative-ai";
import { ModelResponse } from "../../types";
import { tools } from "../utils/tools";

export async function requestGemini(
  query: string
): Promise<ModelResponse | null> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ functionDeclarations: tools }],
    });
    const chat = model.startChat();
    const result = await chat.sendMessage(query);
    const calls = result.response?.functionCalls();
    if (calls && calls.length > 0) {
      const call = calls[0];
      return {
        tool: call.name,
        arguments: JSON.stringify(call.args),
      };
    } else return null;
  } catch (error) {
    console.log({ error });
    return null;
  }
}

export const models: {
  [key: string]: (query: string) => Promise<ModelResponse | null>;
} = {
  gemini: requestGemini,
};
