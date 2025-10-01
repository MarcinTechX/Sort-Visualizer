import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AlgorithmVisualizer from "../components/AlgorithmVisualizer";
import Header from "./Header";

const AlgorithmPage: React.FC = () => {
  const location = useLocation();
  const isBubble = location.pathname.endsWith("bubble-sort");
  const isSelection = location.pathname.endsWith("selection-sort");
  const isQuick = location.pathname.endsWith("quick-sort");

  const [numElements, setNumElements] = useState(20);
  const [speed, setSpeed] = useState(500);
  const [array, setArray] = useState<number[]>([]);
  const [originalArray, setOriginalArray] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const [resetSignal, setResetSignal] = useState(0);
  const [finished, setFinished] = useState(false);

  // Generate new random array
  const generateData = () => {
    if (status !== "idle") return;
    const newData = Array.from({ length: numElements }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newData);
    setOriginalArray(newData);
    setStatus("idle");
    setFinished(false);
    setResetSignal(prev => prev + 1);
  };

  const handleStart = () => {
    if (array.length > 0) {
      setStatus("running");
      setFinished(false);
    }
  };

  const handlePause = () => setStatus("paused");
  const handleContinue = () => setStatus("running");

  const handleAbort = () => {
    setArray([...originalArray]);
    setStatus("idle");
    setFinished(false);
    setResetSignal(prev => prev + 1);
  };

  const handleRestart = () => {
    setArray([...originalArray]);
    setStatus("running");
    setFinished(false);
    setResetSignal(prev => prev + 1);
  };

  const handleFinish = (_finalArray: number[]) => {
    setStatus("idle");
    setFinished(true);
  };

  return (
    <div className="h-dvh flex flex-col box-border">
      <Header />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="p-4 flex flex-col items-center">
          <div className="text-xl font-bold">Algorithm Visualizer</div>
          {isBubble && <div className="text-sm text-gray-600 mt-1">Bubble Sort</div>}
          {isSelection && <div className="text-sm text-gray-600 mt-1">Selection Sort</div>}
          {isQuick && <div className="text-sm text-gray-600 mt-1">Quick Sort</div>}
        </div>

        {/* Controls */}
        <div className="p-4 flex flex-col gap-4 bg-gray-100">
          <div className="flex flex-col">
            <label className="mb-1 text-gray-600">
              Number of elements: {numElements}
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={numElements}
              onChange={(e) =>
                status === "idle" && setNumElements(Number(e.target.value))
              }
              className="w-full cursor-pointer"
              disabled={status !== "idle"}
            />
          </div>
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
            onClick={generateData}
            disabled={status !== "idle"}
          >
            Generate Data
          </button>
        </div>

        {/* Visualizer */}
        <div className="flex-1 p-4 flex justify-center items-end min-h-[100px]">
          {array.length > 0 && (
            <AlgorithmVisualizer
              array={array}
              speed={speed}
              start={status === "running"}
              paused={status === "paused"}
              algorithm={isBubble ? "bubble" : isSelection ? "selection" : isQuick ? "quick" : undefined}
              onFinish={handleFinish}
              resetSignal={resetSignal}
            />
          )}
        </div>

        {/* Animation speed & buttons */}
        {array.length > 0 && (
          <div className="p-4 flex flex-col gap-4 bg-gray-100">
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600">
                Animation speed (ms): {speed}
              </label>
              <input
                type="range"
                min={0}
                max={1000}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Buttons */}
            {status === "idle" && (
              <>
                {!finished ? (
                  <button
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600 cursor-pointer"
                    onClick={handleStart}
                    disabled={array.length === 0}
                  >
                    Start
                  </button>
                ) : (
                  <button
                    className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 cursor-pointer"
                    onClick={handleRestart}
                  >
                    Restart
                  </button>
                )}
              </>
            )}

            {status === "running" && (
              <button
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 cursor-pointer"
                onClick={handlePause}
              >
                Pause
              </button>
            )}

            {status === "paused" && (
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex-1 cursor-pointer"
                  onClick={handleContinue}
                >
                  Continue
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex-1 cursor-pointer"
                  onClick={handleAbort}
                >
                  Abort
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmPage;
