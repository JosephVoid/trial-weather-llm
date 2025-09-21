import Image from "next/image";
import { LLM } from "../types";

export default function LLMSelection({
  llms,
  selected,
  onSelect,
  disabled,
}: {
  llms: LLM[];
  selected: LLM;
  onSelect: (llm: LLM) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {llms.map((llm) => (
        <div
          key={llm.name}
          className={`rounded-sm p-4 cursor-pointer hover:bg-gray-50 transition-all ${
            selected.name === llm.name
              ? `outline-1 outline-blue-500 bg-blue-50`
              : ``
          }`}
          onClick={() => (disabled ? null : onSelect(llm))}
        >
          <Image src={llm.logo} height={50} width={75} alt="logo" />
        </div>
      ))}
    </div>
  );
}
