import React from "react";
import { StateContext } from "../utils/state-provider";
import Image from "next/image";
import BotLogo from "@/src/modules/core/assets/bot-svgrepo-com.svg";

export function AddModelDialog() {
  const { userLLMs, addLLM } = React.useContext(StateContext);

  const availableModels = [
    "moonshotai/kimi-k2-instruct-0905",
    "qwen/qwen3-32b",
    "llama-3.1-8b-instant",
  ];
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  const handleAddLLM = (modelName: string) => {
    addLLM(modelName);
    if (dialogRef.current) dialogRef.current.close();
  };

  return (
    <dialog ref={dialogRef} id="add_model" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          Select a model to add from Groq
        </h3>
        {availableModels.map((model) => (
          <div
            className={`${
              userLLMs.includes(model)
                ? `opacity-30`
                : `hover:bg-gray-50 hover:font-bold cursor-pointer`
            } py-2  flex gap-2`}
            key={model}
          >
            <Image src={BotLogo} width={30} height={50} alt="logo" />
            <p
              onClick={() =>
                !userLLMs.includes(model) ? handleAddLLM(model) : null
              }
            >
              {model}
            </p>
          </div>
        ))}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
