"use client";

import React from "react";
import { LLM } from "../types";

export default function StatsBox({
  stats,
  llm,
}: {
  stats: { [key: string]: string | number };
  llm: LLM;
}) {
  return (
    <div className="p-2 flex flex-col gap-10">
      <LastRequestStats stats={stats} />
    </div>
  );
}

function LastRequestStats({
  stats,
}: {
  stats: { [key: string]: string | number };
}) {
  if (Object.keys(stats).length === 0) return null;

  return (
    <div className="gap-2">
      <div className="text-xl font-bold">Last Request Stats</div>
      <div className="flex flex-col text-sm">
        {stats &&
          Object.entries(stats).map(([key, value]) => (
            <p key={key} className="flex">
              <span className="mr-1">{key}: </span>{" "}
              <span className="font-bold">
                {value}
                {key === "Request Time" ? "ms" : ""}
              </span>
            </p>
          ))}
      </div>
    </div>
  );
}
