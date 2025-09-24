import React from "react";
import chatAction from "../../core/lib/actions/chat.action";
import fetchLLMsAction from "../../core/lib/actions/fetch-llms.actions";
import { GeneralResponse } from "../../core/types";
import { LLM } from "../types";
import { StateContext } from "../utils/state-provider";
import { useAsync } from "./useAsync";

export default function useChat() {
  const [selectedLLM, setSelectedLLM] = React.useState<LLM>();
  const [metrics, setMetrics] = React.useState<{
    [key: string]: string | number;
  }>();
  const [tool, setTool] = React.useState<GeneralResponse["tool"] | null>(null);
  const {
    conversations,
    saveMessage,
    saveMessageChunk,
    finalizeStream,
    streamingMessage,
    userLLMs,
  } = React.useContext(StateContext);

  const { data: LLMs } = useAsync(fetchLLMsAction, true, []);
  const { run: sendMessage, loading } = useAsync(chatAction);

  const handleMessageSend = async (message: string) => {
    if (!LLMs) return;

    saveMessage({
      message,
      llmId: selectedLLM?.id ?? LLMs[0].id,
      role: "USER",
      timestamp: new Date(),
    });

    const response = await sendMessage(message, selectedLLM?.id ?? LLMs[0].id);

    if (response) {
      saveMessage({
        message: response.response,
        llmId: selectedLLM?.id ?? LLMs[0].id,
        role: "LLM",
        timestamp: new Date(),
      });
      setMetrics(response.metrics);
      setTool(response.tool);
    }
  };

  const handleUserLLMMessageSend = async (message: string) => {
    console.log("VM", selectedLLM?.venderModelName);
    if (!LLMs || !selectedLLM) return;

    saveMessage({
      message,
      llmId: selectedLLM.id + "_" + selectedLLM.venderModelName,
      role: "USER",
      timestamp: new Date(),
    });
    const response = await sendMessage(
      message,
      "generic",
      selectedLLM.venderModelName
    );

    if (response) {
      saveMessage({
        message: response.response,
        llmId: selectedLLM.id + "_" + selectedLLM.venderModelName,
        role: "LLM",
        timestamp: new Date(),
      });
      setMetrics(response.metrics);
      setTool(response.tool);
    }
  };

  const handleStreamingMessageSend = async (message: string) => {
    if (!LLMs) return;

    saveMessage({
      message,
      llmId: selectedLLM?.id ?? LLMs[0].id,
      role: "USER",
      timestamp: new Date(),
    });

    const res = await fetch("/api/streamed-chat", {
      method: "POST",
      body: JSON.stringify({ query: message, model: "gemini" }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    let fullText = "";
    while (true) {
      const { done, value } = await reader.read();
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      saveMessageChunk(chunk, "streaming_gemini");

      if (done) {
        finalizeStream({
          llmId: "streaming_gemini",
          role: "LLM",
          timestamp: new Date(),
          message: fullText,
        });
        break;
      }
    }
  };

  React.useEffect(() => {
    setMetrics({});
  }, [selectedLLM, LLMs]);

  React.useEffect(() => {
    console.log({ selectedLLM });
    const message_box = document.getElementById("conv-box");
    if (message_box) {
      message_box.scroll({
        top: message_box.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [conversations, selectedLLM]);

  const isStreamingGemini = React.useMemo(() => {
    if (selectedLLM) {
      return selectedLLM.id === "streaming_gemini";
    }
    return false;
  }, [selectedLLM]);

  const sendFunction = (message: string) => {
    if (isStreamingGemini) {
      return handleStreamingMessageSend(message);
    } else if (selectedLLM?.id === "generic") {
      return handleUserLLMMessageSend(message);
    } else return handleMessageSend(message);
  };

  const conversationFilterFunction = () => {
    if (selectedLLM?.id === "generic") {
      return conversations.filter(
        (msg) => msg.llmId === "generic_" + selectedLLM?.venderModelName
      );
    } else if (LLMs) {
      return conversations.filter(
        (msg) => msg.llmId === (selectedLLM?.id || LLMs[0].id)
      );
    } else return conversations;
  };

  return {
    LLMs,
    selectedLLM,
    setSelectedLLM,
    loading,
    userLLMs,
    streamingMessage,
    conversationFilterFunction,
    sendFunction,
    metrics,
    tool,
  };
}
