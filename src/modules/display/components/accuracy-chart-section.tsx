import { TestAccuracyResult } from "../types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useAsync } from "../hooks/useAsync";
import fetchAccuracyAction from "../../core/lib/actions/fetch-accuracy.action";
import Spinner from "./spinner";

export default function AccuracyChartSection() {
  const [chartData, setChartData] = React.useState<TestAccuracyResult[]>([
    {
      model: "Gemini",
      correct: 10,
      failed: 0,
    },
    {
      model: "OpenAI",
      correct: 6,
      failed: 4,
    },
    {
      model: "LLaMA",
      correct: 8,
      failed: 2,
    },
  ]);
  const [alert, setAlert] = React.useState<string | null>(null);

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
        labels: {
          formatter: function () {
            return this.value + "%";
          },
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
      formatter: function () {
        let s = ``;
        this.points?.forEach((point) => {
          const value =
            point.series.name === "Accuracy" ? point.y + "%" : point.y;
          s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${value}</b>`;
        });
        return s;
      },
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
    const response = await compareAccuracy();
    if (response) {
      console.log({ response });
      localStorage.setItem("accuracy", JSON.stringify(response));
      setChartData(response);
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center relative"
      id="accuracy-chart-section"
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
      </div>
    </div>
  );
}
