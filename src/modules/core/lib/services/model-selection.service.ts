import { ModelRequest } from "../../types";

export default function selectModel({
  model,
  query,
}: {
  model: string;
  query: string;
}): ModelRequest {
  return { model: "", prompt: { query: "", tools: [] } };
}
