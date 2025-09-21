import { GeneralResponse, ModelDefinition, ModelResponse } from "../../types";
import { feedGemini, requestGemini } from "./gemini-definition.service";
import { feedGroq, requestGroq } from "./groq-definition.service";
let GeminiLogo: any;
let OpenAILogo: any;
let MetaAILogo: any;

if (process.env.NODE_ENV !== "test") {
  GeminiLogo =
    require("@/src/modules/core/assets/Google_Gemini_logo.svg").default;
  OpenAILogo = require("@/src/modules/core/assets/OpenAI_Logo.svg").default;
  MetaAILogo =
    require("@/src/modules/core/assets/Meta_Platforms_Inc._logo.svg").default;
}

export const models = {
  gemini: {
    request: requestGemini,
    feed: feedGemini,
    name: "Gemini",
    logo: GeminiLogo,
  },
  openai: {
    request: (query: string) => requestGroq(query, "openai/gpt-oss-20b"),
    feed: (toolResponse: string) =>
      feedGroq(toolResponse, "openai/gpt-oss-20b"),
    name: "OpenAI",
    logo: OpenAILogo,
  },
  llama: {
    request: (query: string) =>
      requestGroq(query, "meta-llama/llama-guard-4-12b"),
    feed: (toolResponse: string) =>
      feedGroq(toolResponse, "meta-llama/llama-guard-4-12b"),
    name: "LLaMA",
    logo: MetaAILogo,
  },
} as const satisfies Record<string, ModelDefinition>;
