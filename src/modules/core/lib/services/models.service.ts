import { GeneralResponse, ModelDefinition, ModelResponse } from "../../types";
import { feedGemini, requestGemini } from "./model-definition.service";

export const models = {
  gemini: { request: requestGemini, feed: feedGemini },
} as const satisfies Record<string, ModelDefinition>;
