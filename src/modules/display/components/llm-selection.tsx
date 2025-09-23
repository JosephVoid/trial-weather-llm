import Image from "next/image";
import { LLM } from "../types";
import React from "react";
import BotLogo from "@/src/modules/core/assets/bot-svgrepo-com.svg";
import { Plus } from "../assets/plus-icon";
import { AddModelDialog } from "./add-model-dialog";

export default function LLMSelection({
  llms,
  selected,
  onSelect,
  disabled,
  userLLMs,
}: {
  llms: LLM[];
  selected: LLM;
  onSelect: (llm: LLM) => void;
  disabled: boolean;
  userLLMs: string[];
}) {
  const allLLMs = React.useMemo((): LLM[] => {
    return [
      ...llms,
      ...userLLMs.map<LLM>((vm) => ({
        id: "generic",
        desc: "User selected model running " + vm,
        name: vm,
        venderModelName: vm,
        logo: BotLogo,
      })),
    ];
  }, [userLLMs]);

  const handleDialogOpen = () =>
    (document.getElementById("add_model") as HTMLDialogElement).showModal();

  return (
    <div className="flex flex-col gap-2">
      {allLLMs.map((llm) => (
        <div
          key={llm.name}
          className={`rounded-sm p-4 cursor-pointer hover:bg-gray-50 transition-all ${
            selected.name === llm.name
              ? `outline-1 outline-blue-500 bg-blue-50`
              : ``
          }`}
          onClick={() => (disabled ? null : onSelect(llm))}
        >
          {llm.id === "generic" ? (
            <div className="flex gap-2">
              <Image src={llm.logo} height={50} width={30} alt="logo" />
              <p className="text-xs">{llm.name}</p>
            </div>
          ) : (
            <Image src={llm.logo} height={50} width={75} alt="logo" />
          )}
        </div>
      ))}
      <div
        className="flex gap-2 items-center p-4 opacity-70 hover:opacity-100 cursor-pointer"
        onClick={handleDialogOpen}
      >
        <Plus />
        <p>Add Model</p>
      </div>
      <AddModelDialog />
    </div>
  );
}
