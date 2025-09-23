import { TestMetricResult } from "../types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useAsync } from "../hooks/useAsync";
import fetchMetricsAction from "../../core/lib/actions/fetch-metrics.action";
import Spinner from "./spinner";
import { RightArrow } from "../assets/right-arrow";

export default function MetricChartSection() {
  const [chartData, setChartData] = React.useState<TestMetricResult[]>([
    {
      model: "Gemini",
      tokens: 19296.8,
      latency: 3670.6,
    },
    {
      model: "OpenAI",
      tokens: 1401,
      latency: 934.4,
    },
    {
      model: "LLaMA",
      tokens: 1858.4,
      latency: 1177.6,
    },
  ]);
  const [alert, setAlert] = React.useState<string | null>(null);

  const { run: compareMetrics, loading: comparisonLoading } =
    useAsync(fetchMetricsAction);

  React.useEffect(() => {
    const storedMetrics = localStorage.getItem("latency_tokens");
    if (storedMetrics) {
      setChartData(JSON.parse(storedMetrics));
    }
  }, []);

  const options: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Average LLM Token Usage & Latency Comparison",
    },
    xAxis: {
      categories: chartData.map((d) => d.model),
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: "Tokens Used",
        },
      },
      {
        title: {
          text: "Latency (ms)",
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
    },
    plotOptions: {
      column: {
        grouping: true,
        shadow: false,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Tokens Used",
        type: "column",
        yAxis: 0,
        data: chartData.map((d) => d.tokens),
        color: "#4F46E5", // Indigo
      },
      {
        name: "Latency (ms)",
        type: "column",
        yAxis: 1,
        data: chartData.map((d) => d.latency),
        color: "#F59E0B", // Amber
      },
    ],
  };

  const handleModelComparison = async () => {
    if (
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("127.0.0.1")
    ) {
      setAlert(`Comparing these models will consume alot of tokens and weather API credits, and may make the chat bot above stop working.\n 
                Thus I kindly recommend you to pull this code, put in your own API keys and run this comparison.\n 
                Thank you for understanding! 🙏`);
      setTimeout(() => {
        setAlert(null);
      }, 12000);
      return;
    }
    const response = await compareMetrics();
    if (response) {
      console.log({ response });
      localStorage.setItem("latency_tokens", JSON.stringify(response));
      setChartData(response);
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center relative"
      id="chart-section"
    >
      {alert && (
        <div role="alert" className="alert alert-warning absolute top-0 w-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{alert}</span>
        </div>
      )}
      <div className="flex flex-col w-full p-5 gap-6">
        <button className="btn btn-ghost w-2/8" onClick={handleModelComparison}>
          {comparisonLoading ? <Spinner /> : "Re-Compare Models"}
        </button>
        <HighchartsReact highcharts={Highcharts} options={options} />
        <button
          className="btn btn-ghost btn-sm w-3/8"
          onClick={() =>
            document.getElementById("accuracy-chart-section")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          See Accuracy Comparison <RightArrow />
        </button>
      </div>
    </div>
  );
}
