import QuickChart from "quickchart-js";
import { Aggregates } from "../../biz/aggregates";
import { ChartConfiguration } from "chart.js";
import * as plugin from "chart.js/dist/plugins";

const myChart = new QuickChart();
myChart
  .setConfig({
    type: "bar",
    data: {
      labels: ["Hello world", "Foo bar"],
      datasets: [{ label: "Foo", data: [1, 2] }],
    },
  })
  .setVersion("4")
  .setFormat("png")
  .setWidth(200)
  .setHeight(150);

export async function getChartUrl(config: ChartConfiguration) {
  const chart = new QuickChart();
  chart.setConfig(config).setVersion("3");
  const url = await chart.getUrl();
  //const shorturl = await chart.getShortUrl();
  //console.log(shorturl);
  return url;
}

interface DateOHLCChartData {
  date: string | number | Date;
  o: number;
  h: number;
  l: number;
  c: number;
}
interface SimpleMovingAverageChartData {
  date: string | number | Date;
  average: number;
}

export function createOHLTChart(aggregates: Aggregates) {
  const { ticker, results } = aggregates;
  const dateOHLC: DateOHLCChartData[] = results.map((result) => ({
    date: result.t,
    o: result.o,
    h: result.h,
    l: result.l,
    c: result.c,
  }));

  const simpleMovingAverages: SimpleMovingAverageChartData[] = dateOHLC.map(
    (d) => ({
      date: d.date,
      average: (d.o + d.h + d.l + d.c) / 4,
    })
  );

  const config: ChartConfiguration = {
    // @ts-ignore:
    type: "ohlc",
    data: {
      datasets: [
        {
          label: ticker,
          yAxisID: "y1",
          // @ts-ignore:
          data: dateOHLC.map(({ date, o, h, l, c }) => ({
            x: date as number,
            o,
            h,
            l,
            c,
          })),
        },
        {
          type: "line",
          yAxisID: "y1",
          borderColor: "#f00",
          backgroundColor: "f00",
          borderWidth: 2,
          pointRadius: 0,
          label: "SMA",
          data: simpleMovingAverages.map(({ date, average }) => ({
            x: date as number,
            y: average,
          })),
        },
      ],
    },
    options: {
      scales: {
        x: {
          adapters: {
            date: {
              zone: "UTC-5",
            },
          },
          time: {
            unit: "day",
            //@ts-ignore
            stepSize: 1,
            displayFormats: {
              day: "MMM d",
              month: "MMM d",
            },
          },
        },
        y1: {
          stack: "stockChart",
          stackWeight: 10,
          weight: 2,
        },
        y2: {
          display: false,
          stack: "stockChart",
          stackWeight: 1,
          weight: 1,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: ticker,
          font: {
            size: 20,
          },
        },
      },
    },
  };
  return config;
}
