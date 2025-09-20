import { models } from "./lib/services/models.service";

export interface ModelRequest {
  model: ModelName;
  query: string;
}
export interface ModelFeedRequest {
  model: ModelName;
  feed: string;
}

export interface ModelResponse {
  tool: string;
  arguments: string;
}

export interface GeneralResponse {
  response: string;
  success: boolean;
}

export type ModelDefinition = {
  request: (query: string) => Promise<ModelResponse | null>;
  feed: (toolResponse: string) => Promise<GeneralResponse | null>;
  name: string;
  logo: string;
};

type Models = typeof models;
export type ModelName = keyof Models;
