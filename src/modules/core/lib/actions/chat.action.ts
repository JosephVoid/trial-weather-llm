"use server";

import {
  feedResponseToModel,
  requestModel,
} from "../services/model-request.service";
import executeTool from "../services/tool.service";

export default async function chatAction(query: string, model: string) {
  const modelResponse = await requestModel({ query, model });
  if (!modelResponse) return null;

  const toolResponse = await executeTool(modelResponse);
  const responseToUser = await feedResponseToModel(toolResponse);
  if (responseToUser.success) return responseToUser.response;
  else return null;
}
