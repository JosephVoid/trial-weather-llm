import axios from "axios";
import { ModelResponse, GeneralResponse } from "../../types";
import { queryMap } from "../utils/helpers";

export default async function executeTool(
  response: ModelResponse
): Promise<GeneralResponse | null> {
  try {
    const query = queryMap(response);
    console.log({ query });
    if (!query) return null;
    const axiosResponse = await axios.get(
      `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${query}`
    );
    if (axiosResponse.statusText === "OK") {
      return { response: JSON.stringify(axiosResponse.data), success: true };
    } else {
      console.log("API RESP", axiosResponse.data);
      return null;
    }
  } catch (error) {
    console.log({ error });
    return null;
  }
}
