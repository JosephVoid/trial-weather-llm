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

  const toolResponse = await executeTool(modelResponse);
  if (!toolResponse) return null;

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
    "Request Time": duration + "ms",
  };

  if (responseToUser.success)
    return { response: responseToUser.response, metrics };
  else return null;
}
