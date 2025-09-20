import { ModelDefinition, ModelName } from "../core/types";

export type LLM = Omit<ModelDefinition, "request" | "feed"> & { id: ModelName };

export interface Message {
  llmId: string;
  role: "USER" | "LLM";
  message: string;
  timestamp: Date;
}

export interface MessageBoxProps {
  llm: LLM;
  convo: Message[];
  onSend: (message: string) => void;
  loading?: boolean;
}
