"use server";

import { accuracy_prompts } from "../utils/test-prompts";
import { requestModel } from "../services/model-request.service";
import { models } from "../services/models.service";
import { ModelName } from "../../types";
import { TestAccuracyResult } from "@/src/modules/display/types";

export default async function fetchAccuracyAction(): Promise<
  TestAccuracyResult[]
> {
  const results: TestAccuracyResult[] = [];

  for (const modelName in models) {
    if (modelName === "streaming_gemini") continue;

    let correct = 0;
    let failed = 0;

    for (const prompt of accuracy_prompts) {
      const result = await requestModel({
        query: prompt.prompt,
        model: modelName as ModelName,
      });
      if (
        result &&
        result.tool === prompt.tool &&
        result.arguments === prompt.arguments
      ) {
        correct++;
      } else {
        failed++;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    results.push({
      model: models[modelName as ModelName].name,
      correct: correct,
      failed: failed,
    });
  }

  return results;
}
