import { ModelDefinition, ModelName } from "../core/types";

export type LLM = Omit<ModelDefinition, "request" | "feed"> & { id: ModelName };

export interface MessageBoxProps {
  llm: LLM;
  convo: { role: "USER" | "LLM"; message: string }[];
  onSend: (message: string) => void;
}
