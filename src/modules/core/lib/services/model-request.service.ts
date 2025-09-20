import {
  ModelRequest,
  ModelResponse,
  GeneralResponse,
  ModelFeedRequest,
} from "../../types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { tools } from "../utils/tools";
import { models } from "./models.service";
import { history } from "../utils/history";

export async function requestModel(
  request: ModelRequest
): Promise<ModelResponse | null> {
  if (models[request.model]) {
    const model = models[request.model];
    const response = await model.request(request.query);
    return response;
  } else return null;
}

export async function feedModel(
  feedRequest: ModelFeedRequest
): Promise<GeneralResponse | null> {
  if (models[feedRequest.model]) {
    const model = models[feedRequest.model];
    const response = await model.feed(feedRequest.feed);
    return response;
  } else return null;
}
