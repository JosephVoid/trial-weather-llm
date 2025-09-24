import { NextRequest } from "next/server";
import { feedGeminiStream } from "@/src/modules/core/lib/services/gemini-definition.service";
import {
  requestModel,
  feedModel,
} from "@/src/modules/core/lib/services/model-request.service";
import executeTool from "@/src/modules/core/lib/services/tool.service";
import { GeneralResponse } from "@/src/modules/core/types";
import { parseToolArguments } from "@/src/modules/core/lib/utils/helpers";

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

  const tool: GeneralResponse["tool"] = {
    name: modelResponse.tool,
    arg: JSON.stringify(parseToolArguments(modelResponse.arguments)),
  };

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const finalResult = await feedGeminiStream(
        toolResponse.response,
        (chunk) => {
          const payload = JSON.stringify({ type: "chunk", data: chunk }) + "\n";
          controller.enqueue(encoder.encode(payload));
        }
      );

      controller.enqueue(
        encoder.encode(JSON.stringify({ type: "end" }) + "\n")
      );

      controller.enqueue(
        encoder.encode(
          JSON.stringify({ type: "metrics", data: finalResult?.metrics }) + "\n"
        )
      );

      controller.enqueue(
        encoder.encode(JSON.stringify({ type: "tool", data: tool }) + "\n")
      );

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}
