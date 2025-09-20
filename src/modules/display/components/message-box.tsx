"use client";
import React, { useState } from "react";
import { MessageBoxProps, LLM } from "../types";

export default function MessageBox({
  llm,
  convo,
  onSend,
  loading,
}: MessageBoxProps) {
  const [message, setMessage] = React.useState("");

  return (
    <div className="p-4 rounded-sm outline-1 outline-blue-100 flex flex-col justify-between gap-2">
      <div className="text-2xl font-extrabold h-1/6">{llm.name}</div>
      <div
        className="h-full min-h-[300px] max-h-[400px] overflow-x-scroll"
        id="conv-box"
      >
        {convo.map((chat, index) => (
          <div
            key={index}
            className={`chat ${
              chat.role === "USER" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-bubble">{chat.message}</div>
          </div>
        ))}
        {loading && (
          <div className={`chat chat-start`}>
            <div className="chat-bubble">...</div>
          </div>
        )}
      </div>
      <div className="h-2/6 w-full flex gap-1">
        <input
          type="text"
          name="chat-text"
          id=""
          className="input w-full focus:outline-none focus-within:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="btn btn-soft"
          onClick={() => {
            onSend(message);
            setMessage("");
          }}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
