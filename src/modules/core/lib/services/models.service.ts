import { GeneralResponse, ModelDefinition, ModelResponse } from "../../types";
import { feedGemini, requestGemini } from "./gemini-definition.service";
import { feedGroq, requestGroq } from "./groq-definition.service";
let GeminiLogo: any;
let GeminiLogoStreaming: any;
let OpenAILogo: any;
let MetaAILogo: any;

if (process.env.NODE_ENV !== "test") {
  GeminiLogo =
    require("@/src/modules/core/assets/Google_Gemini_logo.svg").default;
  GeminiLogoStreaming =
    require("@/src/modules/core/assets/Google_Gemini_logo_2025.svg").default;
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
    desc: "Google's Gemini AI model, running gemini-2.5-flash for this chat",
  },
  streaming_gemini: {
    request: requestGemini,
    feed: feedGemini,
    name: "Gemini Streamed",
    logo: GeminiLogoStreaming,
    desc: "Same Gemini AI model running gemini-2.5-flash, but responses are streamed instead of blocking",
  },
  openai: {
    request: (query: string) => requestGroq(query, "openai/gpt-oss-20b"),
    feed: (toolResponse: string) =>
      feedGroq(toolResponse, "openai/gpt-oss-20b"),
    name: "OpenAI",
    logo: OpenAILogo,
    desc: "OpenAI's model running openai/gpt-oss-20b through groq  for this chat",
  },
  llama: {
    request: (query: string) =>
      requestGroq(query, "meta-llama/llama-4-scout-17b-16e-instruct"),
    feed: (toolResponse: string) =>
      feedGroq(toolResponse, "meta-llama/llama-4-scout-17b-16e-instruct"),
    name: "LLaMA",
    logo: MetaAILogo,
    desc: "Meta's AI model running meta-llama/llama-4-scout-17b-16e-instruct through groq  for this chat",
  },
  generic: {
    request: (query: string, vendorModelName?: string) =>
      requestGroq(query, vendorModelName),
    feed: (toolResponse: string, vendorModelName?: string) =>
      feedGroq(toolResponse, vendorModelName),
    name: "Generic",
    logo: MetaAILogo,
    desc: "",
  },
} as const satisfies Record<string, ModelDefinition>;
