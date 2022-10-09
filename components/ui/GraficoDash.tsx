import React, { useRef, useEffect, useState } from "react";
import type { ChartData, ChartArea } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { constants } from "crypto";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const labels = ["January", "February", "March", "April", "May", "June", "July"];
const colors = [
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "teal",
  "blue",
  "purple",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Ganancias",
      data: labels.map(() => Math.random() * 100 + 100),
    },
    {
      label: "Gastos",
      data: labels.map(() => Math.random() * 100 + 100),
    },
  ],
};

function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
  const colorMid = "#0000ff";
  const colorEnd = "#006600";
  const colorStart = "#ff3300";

  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(0.5, colorMid);
  gradient.addColorStop(1, colorEnd);

  return gradient;
}

export const GraficoDash = () => {
  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const chartData = {
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        borderColor: createGradient(chart.ctx, chart.chartArea),
      })),
    };

    setChartData(chartData);
  }, []);

  return <Chart ref={chartRef} type="line" data={chartData} />;
};
