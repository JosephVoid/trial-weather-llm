"use client";

import { RightArrow } from "../assets/RightArrow";
import ChatBox from "../components/chat-box";
import StateProvider from "../utils/state-provider";

export default function LandingPage() {
  return (
    <StateProvider>
      <div className="flex justify-center  items-center px-48 h-screen">
        <div className="flex flex-col justify-center items-center gap-8  w-full">
          <h1 className="text-4xl font-extrabold text-center w-3/4">
            Curious about the Weather? Ask LLMs
          </h1>
          <ChatBox />
          <button className="btn btn-ghost btn-sm">
            See my findings <RightArrow />
          </button>
        </div>
      </div>
    </StateProvider>
  );
}
