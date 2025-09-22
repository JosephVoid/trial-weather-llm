import { TestAccuracyResult } from "../types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useAsync } from "../hooks/useAsync";
import fetchAccuracyAction from "../../core/lib/actions/fetch-accuracy.action";
import Spinner from "./spinner";

export default function AccuracyChartSection() {
  const [chartData, setChartData] = React.useState<TestAccuracyResult[]>([]);
  const { run: compareAccuracy, loading: comparisonLoading } =
    useAsync(fetchAccuracyAction);

  React.useEffect(() => {
    const storedMetrics = localStorage.getItem("accuracy");
    if (storedMetrics) {
      setChartData(JSON.parse(storedMetrics));
    }
  }, []);

  const options: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "LLM Accuracy Comparison",
    },
    xAxis: {
      categories: chartData.map((d) => d.model),
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: "Accuracy (%)",
        },
      },
      {
        title: {
          text: "Correct",
        },
        opposite: true,
      },
      {
        title: {
          text: "Failed",
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
        name: "Accuracy",
        type: "column",
        yAxis: 0,
        data: chartData.map((d) => (d.correct / (d.correct + d.failed)) * 100),
        color: "#4F46E5",
      },
      {
        name: "Correct",
        type: "column",
        yAxis: 1,
        data: chartData.map((d) => d.correct),
        color: "#0B7A75",
      },
      {
        name: "Failed",
        type: "column",
        yAxis: 2,
        data: chartData.map((d) => d.failed),
        color: "#FF5666",
      },
    ],
  };

  const handleModelComparison = async () => {
    const response = await compareAccuracy();
    if (response) {
      console.log({ response });
      localStorage.setItem("accuracy", JSON.stringify(response));
      setChartData(response);
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      id="accuracy-chart-section"
    >
      <div className="flex flex-col w-full p-5 gap-6">
        <button className="btn btn-ghost w-2/8" onClick={handleModelComparison}>
          {comparisonLoading ? <Spinner /> : "Re-Compare Models"}
        </button>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
