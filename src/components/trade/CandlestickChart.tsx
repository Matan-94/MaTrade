import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { motion } from 'framer-motion';

interface CandlestickChartProps {
  data: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  symbol: string;
  currentPrice: number;
}

export function CandlestickChart({ data, symbol, currentPrice }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    // Only create chart if it doesn't exist
    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#9CA3AF',
        },
        grid: {
          vertLines: { color: 'rgba(156, 163, 175, 0.1)' },
          horzLines: { color: 'rgba(156, 163, 175, 0.1)' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400, // Reduced height from 600px to 400px
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          mode: 1,
          vertLine: {
            color: '#EAB308',
            width: 1,
            style: 3,
            labelBackgroundColor: '#EAB308',
          },
          horzLine: {
            color: '#EAB308',
            width: 1,
            style: 3,
            labelBackgroundColor: '#EAB308',
          },
        },
      });

      seriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#EAB308', // Gold color for up candles
        downColor: '#FFFFFF', // White for down candles
        borderVisible: false,
        wickUpColor: '#EAB308', // Gold color for up wicks
        wickDownColor: '#FFFFFF', // White for down wicks
      });

      window.addEventListener('resize', handleResize);
    }

    // Update data
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
      chartRef.current?.timeScale().fitContent();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data]);

  // Update the last candle with current price
  useEffect(() => {
    if (seriesRef.current && data.length > 0 && currentPrice > 0) {
      const lastCandle = data[data.length - 1];
      const updatedCandle = {
        ...lastCandle,
        close: currentPrice,
        high: Math.max(lastCandle.high, currentPrice),
        low: Math.min(lastCandle.low, currentPrice),
      };
      seriesRef.current.update(updatedCandle);
    }
  }, [currentPrice, data]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[400px]" // Reduced height from 600px to 400px
      ref={chartContainerRef}
    />
  );
}