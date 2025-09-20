import { ModelResponse, GeneralResponse } from "../../types";

export default async function executeTool(
  response: ModelResponse
): Promise<GeneralResponse> {
  return { response: "", success: true };
}
