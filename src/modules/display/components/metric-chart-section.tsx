import { TestMetricResult } from "../types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useAsync } from "../hooks/useAsync";
import fetchMetricsAction from "../../core/lib/actions/fetch-metrics.action";
import Spinner from "./spinner";
import { RightArrow } from "../assets/RightArrow";

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
    const response = await compareMetrics();
    if (response) {
      console.log({ response });
      localStorage.setItem("latency_tokens", JSON.stringify(response));
      setChartData(response);
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      id="chart-section"
    >
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
