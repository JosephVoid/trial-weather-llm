import { models } from "./lib/services/models.service";

export interface ModelRequest {
  model: ModelName;
  query: string;
  venderModelName?: string;
}
export interface ModelFeedRequest {
  model: ModelName;
  feed: string;
  venderModelName?: string;
}

export interface ModelResponse {
  tool: string;
  arguments: string;
  metrics?: { [key: string]: string | number };
}

export interface GeneralResponse {
  response: string;
  success: boolean;
  metrics?: { [key: string]: string | number };
}

export type ModelDefinition = {
  request: (
    query: string,
    venderModelName?: string
  ) => Promise<ModelResponse | null>;
  feed: (
    toolResponse: string,
    venderModelName?: string
  ) => Promise<GeneralResponse | null>;
  name: string;
  logo: string;
  desc: string;
};

type Models = typeof models;
export type ModelName = keyof Models;
