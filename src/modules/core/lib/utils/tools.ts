import { SchemaType, FunctionDeclaration } from "@google/generative-ai";
import Groq from "groq-sdk";

export const tools: FunctionDeclaration[] = [
  {
    name: "get_weather_by_city",
    description: "Get the weather information for a city or country",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        location: {
          type: SchemaType.STRING,
          description: "City or country name",
        },
      },
      required: ["location"],
    },
  },
  {
    name: "get_weather_by_ip",
    description:
      "Get the weather information for the current location by IP address",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        ip: {
          type: SchemaType.STRING,
          description: "The IP address to look up",
        },
      },
      required: ["ip"],
    },
  },
  {
    name: "get_weather_by_coordinates",
    description: "Get the weather information for a location by coordinates",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        lat: { type: SchemaType.NUMBER, description: "Latitude" },
        lon: { type: SchemaType.NUMBER, description: "Longitude" },
      },
      required: ["lat", "lon"],
    },
  },
  {
    name: "no_tool",
    description:
      "Used when the query is unrelated to weather and to live weather infomation retreival",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
    },
  },
];

export const openAITools: Groq.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_weather_by_city",
      description: "Get the weather information for a city or country",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City or country name",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_weather_by_ip",
      description:
        "Get the weather information for the current location by IP address",
      parameters: {
        type: "object",
        properties: {
          ip: {
            type: "string",
            description: "The IP address to look up",
          },
        },
        required: ["ip"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_weather_by_coordinates",
      description: "Get the weather information for a location by coordinates",
      parameters: {
        type: "object",
        properties: {
          lat: { type: "number", description: "Latitude" },
          lon: { type: "number", description: "Longitude" },
        },
        required: ["lat", "lon"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "no_tool",
      description:
        "Used when the query is unrelated to weather and to live weather infomation retreival",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];
