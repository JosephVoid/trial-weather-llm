"use server";

import {
  feedResponseToModel,
  requestModel,
} from "../services/model-request.service";
import selectModel from "../services/model-selection.service";
import executeTool from "../services/tool.service";

export default async function chatAction(query: string, model: string) {
  const preparedModel = selectModel({ model, query });
  const modelResponse = await requestModel(preparedModel);
  const toolResponse = await executeTool(modelResponse);
  const responseToUser = await feedResponseToModel(toolResponse);
  if (responseToUser.success) return responseToUser.response;
  else return null;
}
