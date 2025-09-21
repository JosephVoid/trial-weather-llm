import { Content } from "@google/generative-ai";
import Groq from "groq-sdk";

export const history: Content[] = [];

export const groqHistory: (Groq.Chat.Completions.ChatCompletionMessageParam & {
  vendorModelName: string;
})[] = [];

export function recordHistory(contents: Content[] | undefined) {
  if (contents) {
    contents.forEach((content) => {
      history.find((item) => {
        const historyText = item.parts.map((part) => part.text).join();
        const currentText = content.parts.map((part) => part.text).join();
        if (historyText !== currentText) {
          history.push(content);
        }
      });
    });
  }
}

export function recordGroqHistory(
  message: Groq.Chat.Completions.ChatCompletionMessageParam & {
    vendorModelName: string;
  }
) {
  groqHistory.push(message);
}
