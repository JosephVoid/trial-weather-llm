"use client";

import React from "react";
import MessageBox from "./message-box";
import LLMSelection from "./llm-selection";
import StatsBox from "./stats-box";
import { LLM } from "../types";
import { useAsync } from "../hooks/useAsync";
import fetchLLMsAction from "../../core/lib/actions/fetch-llms.actions";
import { StateContext } from "../utils/state-provider";
import chatAction from "../../core/lib/actions/chat.action";

export default function ChatBox() {
  const [selectedLLM, setSelectedLLM] = React.useState<LLM>();
  const [metrics, setMetrics] = React.useState<{
    [key: string]: string | number;
  }>();

  const {
    conversations,
    saveMessage,
    saveMessageChunk,
    finalizeStream,
    streamingMessage,
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

    const response = await sendMessage(message, "gemini");

    if (response) {
      saveMessage({
        message: response.response,
        llmId: selectedLLM?.id ?? LLMs[0].id,
        role: "LLM",
        timestamp: new Date(),
      });
      setMetrics(response.metrics);
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
      saveMessageChunk(chunk, "gemini_streaming");

      if (done) {
        finalizeStream({
          llmId: "gemini_streaming",
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
      return selectedLLM.id === "gemini_streaming";
    }
    return false;
  }, [selectedLLM]);

  return (
    <div className="flex gap-4 min-h-[300px] justify-between w-full">
      <div className="w-1/4">
        {LLMs && (
          <LLMSelection
            llms={LLMs}
            selected={selectedLLM ?? LLMs[0]}
            onSelect={(llm: LLM) => setSelectedLLM(llm)}
            disabled={loading}
          />
        )}
      </div>
      <div className="w-full">
        {LLMs && (
          <MessageBox
            streamingMessage={streamingMessage}
            llm={selectedLLM ?? LLMs[0]}
            convo={conversations.filter(
              (msg) => msg.llmId === (selectedLLM?.id || LLMs[0].id)
            )}
            onSend={
              isStreamingGemini ? handleStreamingMessageSend : handleMessageSend
            }
            loading={loading}
          />
        )}
      </div>
      <div className="w-1/4">
        {LLMs && (
          <StatsBox stats={metrics ?? {}} llm={selectedLLM ?? LLMs[0]} />
        )}
      </div>
    </div>
  );
}
