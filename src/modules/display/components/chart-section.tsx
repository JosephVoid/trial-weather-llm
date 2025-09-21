import { TestMetricResult } from "../types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useAsync } from "../hooks/useAsync";
import fetchMetricsAction from "../../core/lib/actions/fetch-metrics.action";
import Spinner from "./spinner";

export default function ChartSection() {
  const [chartData, setChartData] = React.useState<TestMetricResult[]>([]);
  const { run: compareMetrics, loading: comparisonLoading } =
    useAsync(fetchMetricsAction);

  React.useEffect(() => {
    const storedMetrics = localStorage.getItem("comparison");
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
      localStorage.setItem("comparison", JSON.stringify(response));
      setChartData(response);
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      id="chart-section"
    >
      <div className="flex flex-col w-full p-5 gap-6">
        <button className="btn btn-soft w-2/8" onClick={handleModelComparison}>
          {comparisonLoading ? <Spinner /> : "Re-Compare Models"}
        </button>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
