"use server";

import { LLM } from "@/src/modules/display/types";
import { models } from "../services/models.service";
import { ModelName } from "../../types";

export default async function fetchLLMsAction(): Promise<LLM[]> {
  return Object.entries(models).map(([id, model]) => ({
    id: id as ModelName,
    name: model.name,
    logo: model.logo,
  }));
}
