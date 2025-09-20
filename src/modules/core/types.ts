export interface ModelRequest {
  model: string;
  prompt: {
    tools: [];
    query: string;
  };
}

export interface ModelResponse {
  tool: string;
  params: string[];
}

export interface GeneralResponse {
  response: string;
  success: boolean;
}
