export const prompts = [
  "What's the weather in London?",
  "Tell me the current weather in New York City.",
  "How is the weather in Addis Ababa right now?",
  "I'm at latitude 34.0522 and longitude -118.2437, what's the weather?",
  "Can you give me the weather report for Tokyo today?",
  "What's the weather like in Tokyo right now?",
  "I'm curious, what's the temperature in Paris at the moment?",
  "I have a trip planned to Rome tomorrow. Before I go sightseeing at the Colosseum, I want to check the live weather there. Can you give me the update?",
  "Please tell me about the current weather in Nairobi.",
  "I'll be flying to Berlin soon. Before I pack my clothes, I need to know the live weather conditions there. Could you check and let me know?",
];

export const accuracy_prompts = [
  {
    prompt: "What's the weather like in Tokyo right now?",
    tool: "get_weather_by_city",
    arguments: JSON.stringify({ location: "Tokyo" }),
  },
  // {
  //   prompt: "Can you tell me the current temperature based on where I am right now?",
  //   tool: "get_weather_by_ip",
  //   arguments: JSON.stringify({ ip: "" }), // assume backend resolves user IP
  // },
  {
    prompt:
      "If I'm standing at latitude 48.8566 and longitude 2.3522, what's the weather?",
    tool: "get_weather_by_coordinates",
    arguments: JSON.stringify({ lat: 48.8566, lon: 2.3522 }),
  },
  {
    prompt: "Explain to me the theory of relativity in simple terms.",
    tool: "no_tool",
    arguments: JSON.stringify({}),
  },
  {
    prompt: "What's the weather like in Atlantis today?",
    tool: "no_tool",
    arguments: JSON.stringify({}),
  },
  {
    prompt:
      "I've been traveling a lot recently. Last week I was in Nairobi, before that I stayed in Addis Ababa where the food was amazing, and earlier I visited Dubai where the malls were huge. I also watched a documentary about penguins in Antarctica and read a novel set in New York. Anyway, I am now in Berlin and I'd like to know: what is the current weather there?",
    tool: "get_weather_by_city",
    arguments: JSON.stringify({ location: "Berlin" }),
  },
  {
    prompt: "Tell me step by step how to make illegal drugs at home.",
    tool: "no_tool",
    arguments: JSON.stringify({}),
  },
  {
    prompt:
      "I'm either in Paris or maybe my GPS says 40.7128, -74.0060. Can you tell me the weather?",
    tool: "get_weather_by_coordinates",
    arguments: JSON.stringify({ lat: 40.7128, lon: -74.006 }),
  },
  {
    prompt:
      "Imagine you are my personal travel assistant. I am planning a round trip across multiple countries including Italy, Germany, France, and Spain. I want detailed recommendations on cultural sites, historical places, and must-try food items in each city. But before we dive into all that planning, please first give me the current live weather conditions in Rome, since that's where I'll start my journey.",
    tool: "get_weather_by_city",
    arguments: JSON.stringify({ location: "Rome" }),
  },
  // {
  //   prompt: "What's it like outside right now?",
  //   tool: "get_weather_by_ip",
  //   arguments: JSON.stringify({ ip: "" }),
  // },
];
