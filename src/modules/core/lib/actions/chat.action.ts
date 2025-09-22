"use server";

import { ModelName } from "../../types";
import { feedModel, requestModel } from "../services/model-request.service";
import executeTool from "../services/tool.service";

export default async function chatAction(
  query: string,
  model: ModelName
): Promise<{
  response: string;
  metrics: { [key: string]: string | number };
} | null> {
  const modelResponse = await requestModel({ query, model });
  if (!modelResponse) return null;

  // Reject any queries that are not related to the weather
  if (modelResponse.tool === "no_tool") {
    return {
      response:
        "Please enter something that is related to live weather infomation retrieval",
      metrics: modelResponse.metrics ? modelResponse.metrics : {},
    };
  }
  console.log({ modelResponse });
  const toolResponse = await executeTool(modelResponse);
  if (!toolResponse) return null;
  console.log({ toolResponse });
  const responseToUser = await feedModel({
    model,
    feed: toolResponse.response,
  });
  if (!responseToUser) return null;

  const totalTokens =
    Number(modelResponse.metrics?.["Tokens Used"]) +
    Number(responseToUser.metrics?.["Tokens Used"]);
  const duration =
    Number(modelResponse.metrics?.["Request Time"]) +
    Number(responseToUser.metrics?.["Request Time"]);

  const metrics = {
    "Tokens Used": totalTokens,
    "Request Time": duration,
  };

  if (responseToUser.success)
    return { response: responseToUser.response, metrics };
  else return null;
}
