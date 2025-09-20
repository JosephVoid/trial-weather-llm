import { ModelRequest, ModelResponse, GeneralResponse } from "../../types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { tools } from "../utils/tools";
import { models } from "./get-model.service";

export async function requestModel(
  request: ModelRequest
): Promise<ModelResponse | null> {
  if (models[request.model]) {
    const model = models[request.model];
    const response = await model(request.query);
    return response;
  } else return null;
}

export async function feedResponseToModel(
  response: GeneralResponse
): Promise<GeneralResponse> {
  return { response: "", success: true };
}
