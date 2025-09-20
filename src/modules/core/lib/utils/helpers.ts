import { ModelResponse } from "../../types";

export const queryMap = (response: ModelResponse) => {
  try {
    switch (response.tool) {
      case "get_weather_by_city":
        return JSON.parse(response.arguments).location as string;
      case "get_weather_by_ip":
        return JSON.parse(response.arguments).ip as string;
      case "get_weather_by_coordinates":
        return `${JSON.parse(response.arguments).lat}, ${
          JSON.parse(response.arguments).lon
        }` as string;
      default:
        return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
