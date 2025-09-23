"use client";

import { RightArrow } from "../assets/right-arrow";
import MetricChartSection from "../components/metric-chart-section";
import ChatBox from "../components/chat-box";
import StateProvider from "../utils/state-provider";
import AccuracyChartSection from "../components/accuracy-chart-section";

export default function LandingPage() {
  return (
    <StateProvider>
      <section>
        <div className="flex justify-center  items-center px-48 h-screen">
          <div className="flex flex-col justify-center items-center gap-8  w-full">
            <h1 className="text-4xl font-extrabold text-center w-3/4">
              Curious about the Weather? Ask LLMs
            </h1>
            <ChatBox />
            <button
              className="btn btn-ghost btn-sm"
              onClick={() =>
                document.getElementById("chart-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              See Model Comparison <RightArrow />
            </button>
          </div>
        </div>
        <MetricChartSection />
        <AccuracyChartSection />
      </section>
    </StateProvider>
  );
}
