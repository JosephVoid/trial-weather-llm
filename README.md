# Weather Chatbot for Trial

A Next.js application that leverages the power of LLMs to provide real-time weather information using tools. Users can interact with any three chatbots to ask for weather updates for any location. The application also provides a comparison of different LLM models.

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [DaisyUI](https://daisyui.com/)
- **LLM Integrations**:
  - [Google Gemini](https://ai.google.dev/)
  - [Groq](https://groq.com/)
- **API Communication**: [Axios](https://axios-http.com/)
- **Data Visualization**: [Highcharts](https://www.highcharts.com/)

## Getting Started

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/JosephVoid/trial-weather-llm
    ```
2.  Navigate to the project directory:
    ```bash
    cd trial-project
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:
Create an `.env.test` file with the same credentials if you want to run the tests

```
GEMINI_API_KEY=your_gemini_api_key
WEATHER_API_KEY=your_weatherstack_api_key
GROQ_API_KEY=your_groq_api_key
```

- `GEMINI_API_KEY`: Your API key for the Google Gemini API.
- `WEATHER_API_KEY`: Your API key for the [Weatherstack API](https://weatherstack.com/).
- `GROQ_API_KEY`: Your API key for the Groq API.

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project is organized into the following modules:

- **`core`**: Contains the core business logic, including services for interacting with LLMs and external APIs.
- **`display`**: Contains the UI components, pages, and hooks for the frontend.

## API Endpoints

- `POST /api/streamed-chat`: This endpoint handles the streamed chat functionality. It takes a `query` and a `model` as input and streams the response back to the client.
