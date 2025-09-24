"use server";

import { GeneralResponse, ModelName } from "../../types";
import { feedModel, requestModel } from "../services/model-request.service";
import executeTool from "../services/tool.service";
import { parseToolArguments } from "../utils/helpers";

export default async function chatAction(
  query: string,
  model: ModelName,
  venderModelName?: string
): Promise<GeneralResponse | null> {
  const modelResponse = await requestModel({ query, model, venderModelName });
  if (!modelResponse) return null;

  // Reject any queries that are not related to the weather
  if (modelResponse.tool === "no_tool") {
    return {
      response:
        "Please enter something that is related to live weather infomation retrieval",
      metrics: modelResponse.metrics ? modelResponse.metrics : {},
    };
  }

  const toolResponse = await executeTool(modelResponse);
  if (!toolResponse) return null;

  const responseToUser = await feedModel({
    model,
    feed: toolResponse.response,
    venderModelName,
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

  const tool: GeneralResponse["tool"] = {
    name: modelResponse.tool,
    arg: JSON.stringify(parseToolArguments(modelResponse.arguments)),
  };

  if (responseToUser)
    return { response: responseToUser.response, metrics, tool };
  else return null;
}
