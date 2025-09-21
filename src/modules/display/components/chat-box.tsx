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

  const { conversations, saveMessage } = React.useContext(StateContext);

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
            llm={selectedLLM ?? LLMs[0]}
            convo={conversations.filter(
              (msg) => msg.llmId === (selectedLLM?.id || LLMs[0].id)
            )}
            onSend={handleMessageSend}
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
