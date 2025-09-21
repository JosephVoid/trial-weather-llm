import React, { ReactNode } from "react";
import { Message } from "../types";

export const StateContext = React.createContext<{
  conversations: Message[];
  streamingMessage: Message | null;
  saveMessage: (msg: Message) => void;
  saveMessageChunk: (chunk: string, llmId: string) => void;
  finalizeStream: (msg: Message) => void;
}>({
  conversations: [],
  streamingMessage: null,
  saveMessage: () => null,
  saveMessageChunk: () => null,
  finalizeStream: () => null,
});

export default function StateProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = React.useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] =
    React.useState<Message | null>(null);

  React.useEffect(() => {
    console.log({ conversations });
  }, [conversations]);

  const handleSaveMessage = (msg: Message) => {
    setConversations((prev) => [...prev, msg]);
  };

  const handleSaveMessageChunk = (chunk: string, llmId: string) => {
    console.log("SAVE CHUNK CALLED", chunk);
    setStreamingMessage((prev) =>
      prev
        ? { ...prev, message: prev.message + chunk }
        : {
            llmId,
            role: "LLM",
            isStreaming: true,
            message: chunk,
            timestamp: new Date(),
          }
    );
  };

  const handleFinalizeStream = (fullMessage: Message) => {
    console.log("FM", fullMessage);
    setConversations((prev) => [...prev, fullMessage]);
    setStreamingMessage(null);
  };

  React.useEffect(() => {
    console.log({ streamingMessage });
  }, [streamingMessage]);
  return (
    <StateContext.Provider
      value={{
        conversations,
        streamingMessage,
        saveMessage: handleSaveMessage,
        saveMessageChunk: handleSaveMessageChunk,
        finalizeStream: handleFinalizeStream,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
