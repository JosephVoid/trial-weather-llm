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
      <AverageStats llm={llm} stats={stats} />
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

function AverageStats({ llm, stats }: { llm: LLM; stats: any }) {
  const averages = React.useMemo(() => {
    return updateAverages(llm.id, stats);
  }, [stats, llm.id]);

  if (Object.keys(averages).length === 0) return null;

  return (
    <div className="gap-2">
      <div className="text-xl font-bold">
        Average {llm.name} Stats per Request
      </div>
      <div className="flex flex-col text-sm">
        {Object.entries(averages).map(([key, value]) => (
          <p key={key} className="flex">
            <span className="mr-1">{key}: </span>{" "}
            <span className="font-bold">
              {(value as number).toFixed(0)}
              {key === "Request Time" ? "ms" : ""}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

/**
 * Update localStorage with the running average for each numeric stat
 */
function updateAverages(
  llmId: string,
  stats: { [key: string]: string | number }
): { [key: string]: number } {
  const newAverages: { [key: string]: number } = {};
  Object.entries(stats).forEach(([key, value]) => {
    if (typeof value !== "number") return;

    // Compose a storage key for this stat
    const storageKey = `${llmId}_${key}_avg`;

    // Retrieve previous average and count
    const prev = localStorage.getItem(storageKey);
    let avg = value;
    let count = 1;

    if (prev) {
      try {
        const parsed = JSON.parse(prev);
        avg = parsed.avg;
        count = parsed.count;
      } catch {
        // if parsing fails, reset to first value
        avg = value;
        count = 1;
      }
      // running average formula
      avg = (avg * count + value) / (count + 1);
      count += 1;
    }

    // Store as JSON with running count
    localStorage.setItem(storageKey, JSON.stringify({ avg, count }));
    newAverages[key] = avg;
  });

  // Return averages for any numeric stats that were not in the last request
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`${llmId}_`) && key.endsWith(`_avg`)) {
      const statName = key.replace(`${llmId}_`, "").replace(`_avg`, "");
      if (!newAverages[statName]) {
        const prev = localStorage.getItem(key);
        if (prev) {
          newAverages[statName] = JSON.parse(prev).avg;
        }
      }
    }
  });
  return newAverages;
}
