import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

interface AlgorithmVisualizerProps {
  array: number[];
  speed: number;
  algorithm?: "bubble" | "selection";
  start: boolean;
  paused?: boolean;
  stop?: boolean;
  onFinish?: () => void;
}

const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
  array,
  speed,
  algorithm = "bubble",
  start,
  paused = false,
  stop = false,
  onFinish,
}) => {
  const [data, setData] = useState<number[]>([...array]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const iRef = useRef(0);
  const jRef = useRef(0);
  const minIndexRef = useRef(0);
  const arrRef = useRef<number[]>([...array]);
  const runningRef = useRef(false);
  const pausedRef = useRef(paused);
  const stopRef = useRef(stop);
  const speedRef = useRef(speed);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [paused]);

  useEffect(() => {
    stopRef.current = stop;
    if (stop) {
      runningRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setData([...array]);
      setActiveIndices([]);
      setSortedIndices([]);
      iRef.current = 0;
      jRef.current = 0;
      minIndexRef.current = 0;
      arrRef.current = [...array];
    }
  }, [stop, array]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    setData([...array]);
    setActiveIndices([]);
    setSortedIndices([]);
    iRef.current = 0;
    jRef.current = 0;
    minIndexRef.current = 0;
    arrRef.current = [...array];
    runningRef.current = false;
  }, [array]);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!start || (algorithm !== "bubble" && algorithm !== "selection")) return;
    if (stopRef.current) return;

    runningRef.current = true;

    const step = () => {
      if (!runningRef.current || stopRef.current || !isMounted.current) return;

      const arr = arrRef.current;

      // ---------------- BUBBLE SORT ----------------
      if (algorithm === "bubble") {
        let i = iRef.current;
        let j = jRef.current;

        if (speedRef.current === 0) {
          const n = arr.length;
          for (let x = 0; x < n - 1; x++) {
            for (let y = 0; y < n - x - 1; y++) {
              if (arr[y] > arr[y + 1]) [arr[y], arr[y + 1]] = [arr[y + 1], arr[y]];
            }
          }
          setData([...arr]);
          setActiveIndices([]);
          setSortedIndices(arr.map((_, idx) => idx));
          runningRef.current = false;
          if (onFinish) onFinish();
          return;
        }

        if (i < arr.length - 1) {
          if (j < arr.length - i - 1) {
            setActiveIndices([j, j + 1]);
            if (arr[j] > arr[j + 1]) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              setData([...arr]);
            }
            jRef.current++;
          } else {
            setSortedIndices((prev) => [...prev, arr.length - i - 1]);
            iRef.current++;
            jRef.current = 0;
          }

          arrRef.current = arr;

          if (!pausedRef.current && !stopRef.current) {
            timeoutRef.current = setTimeout(step, speedRef.current);
          }
        } else {
          setSortedIndices(arr.map((_, idx) => idx));
          setActiveIndices([]);
          runningRef.current = false;
          if (onFinish) onFinish();
        }
      }

      // ---------------- SELECTION SORT ----------------
      if (algorithm === "selection") {
        let i = iRef.current;
        let j = jRef.current;
        let minIndex = minIndexRef.current;

        if (speedRef.current === 0) {
          for (let x = i; x < arr.length - 1; x++) {
            let minIdx = x;
            for (let y = x + 1; y < arr.length; y++) {
              if (arr[y] < arr[minIdx]) minIdx = y;
            }
            [arr[x], arr[minIdx]] = [arr[minIdx], arr[x]];
          }
          setData([...arr]);
          setActiveIndices([]);
          setSortedIndices(arr.map((_, idx) => idx));
          runningRef.current = false;
          if (onFinish) onFinish();
          return;
        }

        if (i < arr.length - 1) {
          if (j < arr.length) {
            setActiveIndices([j, minIndex]);
            if (arr[j] < arr[minIndex]) minIndexRef.current = j;
            jRef.current++;
          } else {
            setActiveIndices([minIndex]);
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            setData([...arr]);
            setSortedIndices((prev) => [...prev, i]);
            setActiveIndices([]);

            iRef.current++;
            minIndexRef.current = iRef.current;
            jRef.current = iRef.current + 1;
          }

          arrRef.current = arr;

          if (!pausedRef.current && !stopRef.current) {
            timeoutRef.current = setTimeout(step, speedRef.current);
          }
        } else {
          setSortedIndices(arr.map((_, idx) => idx));
          setActiveIndices([]);
          runningRef.current = false;
          if (onFinish) onFinish();
        }
      }
    };

    step();
  }, [start, algorithm]);

  const chartData: ChartData<"bar"> = {
    labels: data.map((_, i) => i + 1),
    datasets: [
      {
        label: "Values",
        data,
        backgroundColor: data.map((_, i) => {
          if (activeIndices.includes(i)) return "red";       
          if (sortedIndices.includes(i)) return "green";    
          return "blue";                                    
        }),
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: { display: false, grid: { display: false } },
    },
    animation: { duration: 0 },
  };

  return (
    <div className="w-full h-full flex items-end">
      <Bar data={chartData} options={chartOptions} className="h-full w-full" />
    </div>
  );
};

export default AlgorithmVisualizer;
