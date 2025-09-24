"use server";
import { TestMetricResult } from "@/src/modules/display/types";
import { prompts } from "../utils/test-prompts";
import chatAction from "./chat.action";
import { models } from "../services/models.service";
import { ModelName } from "../../types";

export default async function fetchMetricsAction() {
  const results: TestMetricResult[] = [];

  for (const modelName in models) {
    if (modelName === "streaming_gemini") continue;

    let totalTokens = 0;
    let totalLatency = 0;

    for (const prompt of prompts) {
      const result = await chatAction(prompt, modelName as ModelName);
      if (result && result.metrics) {
        totalTokens += result.metrics["Tokens Used"] as number;
        totalLatency += result.metrics["Request Time"] as number;
      } else {
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    results.push({
      model: models[modelName as ModelName].name,
      tokens: totalTokens / prompts.length,
      latency: totalLatency / prompts.length,
    });
  }

  return results;
}
