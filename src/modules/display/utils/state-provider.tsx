import React, { ReactNode } from "react";
import { Message } from "../types";

export const StateContext = React.createContext<{
  conversations: Message[];
  saveMessage: (msg: Message) => void;
}>({ conversations: [], saveMessage: () => null });

export default function StateProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = React.useState<Message[]>([]);

  const handleSaveMessage = (msg: Message) => {
    setConversations((prev) => [...prev, msg]);
  };

  return (
    <StateContext.Provider
      value={{ conversations, saveMessage: handleSaveMessage }}
    >
      {children}
    </StateContext.Provider>
  );
}
