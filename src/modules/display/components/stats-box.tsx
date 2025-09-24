"use client";

import React from "react";
import { LLM } from "../types";
import { GeneralResponse } from "../../core/types";

export default function StatsBox({
  stats,
  toolUsed,
  llm,
}: {
  stats: { [key: string]: string | number };
  toolUsed?: GeneralResponse["tool"] | null;
  llm: LLM;
}) {
  if (Object.keys(stats).length === 0) return null;
  return (
    <div className="flex flex-col gap-8">
      <div className="gap-2">
        <div className="text-lg font-medium">Last Request</div>
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
      <div className="gap-2">
        <div className="text-lg font-medium">Tool Used</div>
        <div className="flex flex-col text-sm">
          <p className="italic">{toolUsed?.name}</p>
          <p className="italic">{toolUsed?.arg}</p>
        </div>
      </div>
    </div>
  );
}
