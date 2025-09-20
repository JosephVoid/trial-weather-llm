import { Content } from "@google/generative-ai";

export const history: Content[] = [];

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
