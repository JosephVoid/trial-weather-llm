"use server";

import { ModelName } from "../../types";
import { feedModel, requestModel } from "../services/model-request.service";
import executeTool from "../services/tool.service";

export default async function chatAction(query: string, model: ModelName) {
  const modelResponse = await requestModel({ query, model });
  if (!modelResponse) return null;

  const toolResponse = await executeTool(modelResponse);
  if (!toolResponse) return null;

  const responseToUser = await feedModel({
    model,
    feed: toolResponse.response,
  });
  if (!responseToUser) return null;

  if (responseToUser.success) return responseToUser.response;
  else return null;
}
