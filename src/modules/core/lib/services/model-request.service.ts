import { ModelRequest, ModelResponse, GeneralResponse } from "../../types";

export async function requestModel(
  request: ModelRequest
): Promise<ModelResponse> {
  return { params: [], tool: "" };
}

export async function feedResponseToModel(
  response: GeneralResponse
): Promise<GeneralResponse> {
  return { response: "", success: true };
}
