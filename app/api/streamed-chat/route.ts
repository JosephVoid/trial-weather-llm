import { NextRequest } from "next/server";
import { feedGeminiStream } from "@/src/modules/core/lib/services/gemini-definition.service";
import {
  requestModel,
  feedModel,
} from "@/src/modules/core/lib/services/model-request.service";
import executeTool from "@/src/modules/core/lib/services/tool.service";

export async function POST(req: NextRequest) {
  const { query, model } = await req.json();

  const modelResponse = await requestModel({ query, model });
  if (!modelResponse) {
    return new Response("Model did not respond", { status: 500 });
  }

  if (modelResponse.tool === "no_tool") {
    return new Response(
      "Please enter something related to live weather information retrieval",
      { status: 200 }
    );
  }

  const toolResponse = await executeTool(modelResponse);
  if (!toolResponse) {
    return new Response("Tool execution failed", { status: 500 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      await feedGeminiStream(toolResponse.response, (chunk) => {
        controller.enqueue(new TextEncoder().encode(chunk));
      });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}
