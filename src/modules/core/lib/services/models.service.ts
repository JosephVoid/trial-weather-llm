import { GeneralResponse, ModelDefinition, ModelResponse } from "../../types";
import { feedGemini, requestGemini } from "./model-definition.service";
import GeminiLogo from "@/src/modules/core/assets/Google_Gemini_logo.svg";

export const models = {
  gemini: {
    request: requestGemini,
    feed: feedGemini,
    name: "Gemini",
    logo: GeminiLogo,
  },
} as const satisfies Record<string, ModelDefinition>;
