
import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  ColorType,
} from "lightweight-charts";

export default function TradingChart() {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      height: 500,
      layout: {
        background: {
          type: ColorType.Solid,
          color: "#131722",
        },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#252a38" },
        horzLines: { color: "#252a38" },
      },
      rightPriceScale: {
        borderColor: "#363c4e",
      },
      timeScale: {
        borderColor: "#363c4e",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 0,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // Create 40 sample candles ending at the current minute.
    let price = 100;
    const now = Math.floor(Date.now() / 1000);
    const currentMinute = Math.floor(now / 60) * 60;
    const candles = [];

    for (let i = 39; i >= 0; i--) {
      const open = price;
      const close = open + (Math.random() - 0.5) * 4;

      const candle = {
        time: currentMinute - i * 60,
        open,
        high: Math.max(open, close) + Math.random() * 2,
        low: Math.min(open, close) - Math.random() * 2,
        close,
      };

      candles.push(candle);
      price = close;
    }

    candleSeries.setData(candles);
    chart.timeScale().fitContent();

    let currentCandle = { ...candles[candles.length - 1] };
    let lastPrice = currentCandle.close;

    // Simulate a new market price every second.
    const intervalId = setInterval(() => {
      const tickTime = Math.floor(Date.now() / 1000);
      const minuteTime = Math.floor(tickTime / 60) * 60;

      // Generate a small random price movement.
      lastPrice += (Math.random() - 0.5) * 1.2;
      lastPrice = Math.max(1, lastPrice);

      if (minuteTime > currentCandle.time) {
        // Start a new candle when a new minute begins.
        currentCandle = {
          time: minuteTime,
          open: lastPrice,
          high: lastPrice,
          low: lastPrice,
          close: lastPrice,
        };
      } else {
        // Update the existing candle.
        currentCandle = {
          ...currentCandle,
          high: Math.max(currentCandle.high, lastPrice),
          low: Math.min(currentCandle.low, lastPrice),
          close: lastPrice,
        };
      }

      // Update the chart without replacing all historical data.
      candleSeries.update(currentCandle);
      chart.timeScale().scrollToRealTime();
    }, 1000);

    return () => {
      clearInterval(intervalId);
      chart.remove();
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: 500 }}
    />
  );
}