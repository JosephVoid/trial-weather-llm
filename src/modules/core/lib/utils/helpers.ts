import { ModelResponse } from "../../types";

export const queryMap = (response: ModelResponse): string | null => {
  const args = parseToolArguments(response.arguments);
  try {
    switch (response.tool) {
      case "get_weather_by_city":
        return args.location as string;
      case "get_weather_by_ip":
        return args.ip as string;
      case "get_weather_by_coordinates":
        return `${args.lat}, ${args.lon}` as string;
      default:
        return null;
    }
  } catch (error) {
    console.log("ERR", error);
    return null;
  }
};

export function parseToolArguments(rawArgs: any): Record<string, any> {
  if (!rawArgs) return {};

  let args = rawArgs;

  // Already an object
  if (typeof args === "object") return args;

  if (typeof args === "string") {
    args = args.trim();

    try {
      args = JSON.parse(args);

      if (typeof args === "string") {
        args = JSON.parse(args);
      }
    } catch (e) {
      console.error("Failed to parse tool arguments:", rawArgs, e);
      return {};
    }
  }

  return args;
}
