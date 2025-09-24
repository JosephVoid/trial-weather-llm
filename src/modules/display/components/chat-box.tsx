"use client";

import React from "react";
import MessageBox from "./message-box";
import LLMSelection from "./llm-selection";
import StatsBox from "./stats-box";
import { LLM } from "../types";
import useChat from "../hooks/useChat";

export default function ChatBox() {
  const {
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
  } = useChat();

  return (
    <div className="flex gap-4 min-h-[300px] justify-between w-full">
      <div className="w-1/4">
        {LLMs && (
          <LLMSelection
            llms={LLMs}
            selected={selectedLLM ?? LLMs[0]}
            onSelect={(llm: LLM) => setSelectedLLM(llm)}
            disabled={loading}
            userLLMs={userLLMs}
          />
        )}
      </div>
      <div className="w-full">
        {LLMs && (
          <MessageBox
            streamingMessage={streamingMessage}
            llm={selectedLLM ?? LLMs[0]}
            convo={conversationFilterFunction()}
            onSend={sendFunction}
            loading={loading}
          />
        )}
      </div>
      <div className="w-1/4">
        {LLMs && (
          <StatsBox
            stats={metrics ?? {}}
            llm={selectedLLM ?? LLMs[0]}
            toolUsed={tool}
          />
        )}
      </div>
    </div>
  );
}
