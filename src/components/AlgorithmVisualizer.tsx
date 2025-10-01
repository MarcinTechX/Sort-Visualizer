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
  algorithm?: "bubble" | "selection" | "quick";
  start: boolean;
  paused?: boolean;
  resetSignal?: number;
  onFinish?: (finalArray: number[]) => void;
}

interface Step {
  arr: number[];
  active: number[];
  sorted: number[];
  low?: number;
  high?: number;
  pivot?: number;
  iPtr?: number;
  jPtr?: number;
}

const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
  array,
  speed,
  algorithm = "",
  start,
  paused = false,
  resetSignal,
  onFinish,
}) => {
  const [data, setData] = useState<number[]>([...array]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [quickMeta, setQuickMeta] = useState<{
    low?: number;
    high?: number;
    pivot?: number;
    iPtr?: number;
    jPtr?: number;
  }>({});
  const prevControlsRef = useRef({ start, paused, speed });

  const stepsRef = useRef<Step[]>([]);
  const stepIndexRef = useRef(0);
  const timeoutRef = useRef<any>(null);

  // ---------------- Generate Steps ----------------
  const generateSteps = (arr: number[]) => {
    if (algorithm === "bubble") return generateBubbleSortSteps(arr);
    if (algorithm === "selection") return generateSelectionSortSteps(arr);
    if (algorithm === "quick") return generateQuickSortSteps(arr);
    return [];
  };

  const generateBubbleSortSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];
    const a = [...arr];
    const n = a.length;
    const sortedSet: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ arr: [...a], active: [j, j + 1], sorted: [...sortedSet] });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          steps.push({ arr: [...a], active: [j, j + 1], sorted: [...sortedSet] });
        }
      }
      sortedSet.push(n - i - 1);
    }

    steps.push({ arr: [...a], active: [], sorted: a.map((_, i) => i) });
    return steps;
  };

  const generateSelectionSortSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];
    const a = [...arr];
    const n = a.length;
    const sortedSet: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        steps.push({ arr: [...a], active: [j, minIdx], sorted: [...sortedSet] });
        if (a[j] < a[minIdx]) minIdx = j;
      }
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      sortedSet.push(i);
      steps.push({ arr: [...a], active: [i, minIdx], sorted: [...sortedSet] });
    }

    steps.push({ arr: [...a], active: [], sorted: a.map((_, i) => i) });
    return steps;
  };

  const generateQuickSortSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];
    const a = [...arr];
    const sortedSet: number[] = [];

    const quickSort = (low: number, high: number) => {
      if (low < high) {
        const pivotIndex = partition(low, high);

        sortedSet.push(pivotIndex);
        steps.push({ arr: [...a], active: [], sorted: [...sortedSet], low, high, pivot: pivotIndex });
        quickSort(low, pivotIndex - 1);
        quickSort(pivotIndex + 1, high);
      }
    };

    const partition = (low: number, high: number) => {
      const mid = Math.floor((low + high) / 2);
      const pivot = a[mid];
      [a[mid], a[high]] = [a[high], a[mid]];
      let i = low;

      steps.push({ arr: [...a], active: [], sorted: [...sortedSet], low, high, pivot: high, iPtr: i, jPtr: low });

      for (let j = low; j < high; j++) {
        steps.push({ arr: [...a], active: [j, high], sorted: [...sortedSet], low, high, pivot: high, iPtr: i, jPtr: j });
        if (a[j] < pivot) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ arr: [...a], active: [i, j], sorted: [...sortedSet], low, high, pivot: high, iPtr: i, jPtr: j });
          i++;
        }
      }

      [a[i], a[high]] = [a[high], a[i]];

      steps.push({ arr: [...a], active: [i, high], sorted: [...sortedSet], low, high, pivot: i, iPtr: i, jPtr: high });
      return i;
    };

    quickSort(0, a.length - 1);
    steps.push({ arr: [...a], active: [], sorted: a.map((_, i) => i) });
    return steps;
  };

  // ---------------- Play Steps ----------------
  const scheduleNextStep = () => {
    if (!start || paused) return;

    if (stepIndexRef.current >= stepsRef.current.length) {
      const lastStep = stepsRef.current[stepsRef.current.length - 1];
      setData(lastStep.arr);
      setActiveIndices([]);
      setSortedIndices(lastStep.arr.map((_, i) => i));
      setFinished(true); 
      setQuickMeta({});
      if (onFinish) onFinish(lastStep.arr);
      return;
    }

    const step = stepsRef.current[stepIndexRef.current];
    setData(step.arr);
    setActiveIndices(step.active);
    setSortedIndices(step.sorted);

    if (algorithm === "quick") {
      setQuickMeta({ low: step.low, high: step.high, pivot: step.pivot, iPtr: step.iPtr, jPtr: step.jPtr });
    } else {
      setQuickMeta({});
    }
    stepIndexRef.current++;

    if (speed === 0) {
      const finalStep = stepsRef.current[stepsRef.current.length - 1];
      setData(finalStep.arr);
      setActiveIndices([]);
      setSortedIndices(finalStep.arr.map((_, i) => i));
      setFinished(true);
      setQuickMeta({});
      if (onFinish) onFinish(finalStep.arr);
    } else {
      timeoutRef.current = setTimeout(scheduleNextStep, speed);
    }
  };

  // ---------------- Reset / new array ----------------
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    stepsRef.current = generateSteps(array);
    stepIndexRef.current = 0;
    setData([...array]);
    setActiveIndices([]);
    setSortedIndices([]);
    setFinished(false);
    setQuickMeta({});
  }, [array, resetSignal]);

  // ---------------- Start / pause / speed ----------------
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const prev = prevControlsRef.current;
    const becameRunning = (!prev.start && start) || (prev.paused && !paused);

    if (!(start && !paused)) {
      prevControlsRef.current = { start, paused, speed };
      return;
    }

    setFinished(false);

    if (speed === 0) {
      const finalStep = stepsRef.current[stepsRef.current.length - 1];
      if (finalStep) {
        setData(finalStep.arr);
        setActiveIndices([]);
        setSortedIndices(finalStep.arr.map((_, i) => i));
        setFinished(true);
        if (onFinish) onFinish(finalStep.arr);
      }
      prevControlsRef.current = { start, paused, speed };
      return;
    }

    if (becameRunning) {
      scheduleNextStep();
    } else {
      timeoutRef.current = setTimeout(scheduleNextStep, speed);
    }

    prevControlsRef.current = { start, paused, speed };
  }, [start, paused, speed]);

  // ---------------- Chart ----------------
  const chartData: ChartData<"bar"> = {
    labels: data.map((_, i) => i + 1),
    datasets: [
      {
        label: "Values",
        data,
        backgroundColor: data.map((_, i) => {
          if (finished || sortedIndices.includes(i)) return "green";

          if (algorithm === "quick" && quickMeta && typeof quickMeta.low === "number" && typeof quickMeta.high === "number") {
            const inRange = i >= (quickMeta.low as number) && i <= (quickMeta.high as number);
            if (i === quickMeta.pivot) return "orange";
            if (i === quickMeta.iPtr) return "purple";
            if (i === quickMeta.jPtr) return "red";
            if (inRange) return "blue";
            return "rgba(0, 0, 255, 0.2)"; 
          }

          if (activeIndices.includes(i)) return "red";
          return "blue";
        }),
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
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
