"use client";

import React from "react";
import MessageBox from "./message-box";
import LLMSelection from "./llm-selection";
import StatsBox from "./stats-box";
import Gm from "@/src/modules/core/assets/Google_Gemini_logo.svg";
import { LLM } from "../types";

export default function ChatBox() {
  const [selectedLLM, setSelectedLLM] = React.useState<LLM>({
    id: "gemini",
    name: "Gemini",
    logo: Gm,
  });
  const handleMessageSend = (message: string) => {};

  return (
    <div className="flex gap-4 min-h-[300px] justify-between w-full">
      <div className="w-1/4">
        <LLMSelection
          llms={[
            { id: "gemini", name: "Gemini", logo: Gm },
            { id: "gemini", name: "Gemini2", logo: Gm },
          ]}
          selected={selectedLLM}
          onSelect={(llm: LLM) => setSelectedLLM(llm)}
        />
      </div>
      <div className="w-full">
        <MessageBox llm={selectedLLM} convo={[]} onSend={handleMessageSend} />
      </div>
      <div className="w-1/4">
        <StatsBox stats={{ Latency: "5ms", Tokens: "500" }} />
      </div>
    </div>
  );
}
