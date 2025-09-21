import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeneralResponse, ModelResponse } from "../../types";
import { tools } from "../utils/tools";
import { history, recordHistory } from "../utils/history";

export async function requestGemini(
  query: string
): Promise<ModelResponse | null> {
  try {
    const startTime = Date.now();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ functionDeclarations: tools }],
    });
    const chat = model.startChat({ history: history });
    const result = await chat.sendMessage(query);
    const calls = result.response?.functionCalls();
    recordHistory(result.response.candidates?.map((c) => c.content));
    if (calls && calls.length > 0) {
      const call = calls[0];
      return {
        tool: call.name,
        arguments: JSON.stringify(call.args),
        metrics: {
          "Tokens Used": result.response.usageMetadata?.totalTokenCount ?? 0,
          "Request Time": Date.now() - startTime,
        },
      };
    } else return null;
  } catch (error) {
    console.log({ error });
    return null;
  }
}

export async function feedGemini(
  toolResponse: string
): Promise<GeneralResponse | null> {
  try {
    const startTime = Date.now();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const chat = model.startChat({ history: history });
    const result = await chat.sendMessage(
      `here is the response from the tool \n ${toolResponse} \n Now respond to the user`
    );
    recordHistory(result.response.candidates?.map((c) => c.content));
    return {
      response: result.response.text(),
      success: true,
      metrics: {
        "Tokens Used": result.response.usageMetadata?.totalTokenCount ?? 0,
        "Request Time": Date.now() - startTime,
      },
    };
  } catch (error) {
    console.log({ error });
    return null;
  }
}
