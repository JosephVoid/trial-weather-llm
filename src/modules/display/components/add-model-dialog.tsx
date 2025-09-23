import React from "react";
import { StateContext } from "../utils/state-provider";

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
          <p
            className={`${
              userLLMs.includes(model)
                ? `opacity-30`
                : `hover:bg-gray-50 hover:font-bold cursor-pointer`
            } p-2 `}
            key={model}
            onClick={() =>
              !userLLMs.includes(model) ? handleAddLLM(model) : null
            }
          >
            {model}
          </p>
        ))}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
