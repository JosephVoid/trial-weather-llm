import { ModelDefinition, ModelName } from "../core/types";

export type LLM = Omit<ModelDefinition, "request" | "feed"> & { id: ModelName };

export interface Message {
  llmId: string;
  role: "USER" | "LLM";
  isStreaming?: boolean;
  message: string;
  timestamp: Date;
}

export interface MessageBoxProps {
  llm: LLM;
  convo: Message[];
  streamingMessage: Message | null;
  onSend: (message: string) => void;
  loading?: boolean;
}

export interface TestMetricResult {
  model: string;
  tokens: number;
  latency: number;
}
