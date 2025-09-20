export interface ModelRequest {
  model: string;
  query: string;
}
export interface ModelFeedRequest {
  model: string;
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
