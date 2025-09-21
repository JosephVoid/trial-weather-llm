import Groq from "groq-sdk";
import { GeneralResponse, ModelResponse } from "../../types";
import { tools, openAITools } from "../utils/tools";
import { groqHistory, recordGroqHistory } from "../utils/history";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function requestGroq(
  query: string,
  vendorModelName: string
): Promise<ModelResponse | null> {
  try {
    const startTime = Date.now();
    const response = await groq.chat.completions.create({
      model: vendorModelName,
      messages: [
        ...groqHistory.filter(
          (history) => history.vendorModelName === vendorModelName
        ),
        { role: "user", content: query },
      ],
      tools: openAITools,
      tool_choice: "auto",
    });

    const choice = response.choices[0];
    recordGroqHistory({ ...choice.message, vendorModelName });

    const toolCalls = choice.message.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      const call = toolCalls[0];
      return {
        tool: call.function.name,
        arguments: JSON.stringify(call.function.arguments),
        metrics: {
          "Tokens Used":
            response.usage?.total_tokens ??
            (response.usage?.completion_tokens ?? 0) +
              (response.usage?.prompt_tokens ?? 0),
          "Request Time": Date.now() - startTime,
        },
      };
    } else return null;
  } catch (error) {
    console.log({ error });
    return null;
  }
}

export async function feedGroq(
  toolResponse: string,
  vendorModelName: string
): Promise<GeneralResponse | null> {
  try {
    const startTime = Date.now();
    const response = await groq.chat.completions.create({
      model: vendorModelName,
      messages: [
        ...groqHistory.filter(
          (history) => history.vendorModelName === vendorModelName
        ),
        {
          role: "user",
          content: `Here is the response from the tool:\n${toolResponse}\nNow respond to the user.`,
        },
      ],
    });

    const choice = response.choices[0];
    recordGroqHistory({ ...choice.message, vendorModelName });

    return {
      response: choice.message.content ?? "",
      success: true,
      metrics: {
        "Tokens Used":
          response.usage?.total_tokens ??
          (response.usage?.completion_tokens ?? 0) +
            (response.usage?.prompt_tokens ?? 0),
        "Request Time": Date.now() - startTime,
      },
    };
  } catch (error) {
    console.log({ error });
    return null;
  }
}
