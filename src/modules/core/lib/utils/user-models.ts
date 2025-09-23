import { ModelDefinition } from "../../types";
import { feedGroq, requestGroq } from "../services/groq-definition.service";
import BotLogo from "@/src/modules/core/assets/bot-svgrepo-com.svg";

const userModels: ModelDefinition[] = [];

export function addUserModel(vendorModelName: string) {
  if (!userModels.find((model) => model.name === vendorModelName)) {
    userModels.push({
      request: (query: string) => requestGroq(query, vendorModelName),
      feed: (toolResponse: string) => feedGroq(toolResponse, vendorModelName),
      name: vendorModelName,
      logo: BotLogo,
      desc: `Custom Model added by the user, running ${vendorModelName}`,
    });
  }
}
