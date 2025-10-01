import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AlgorithmVisualizer from "../components/AlgorithmVisualizer";
import Header from "./Header";

const AlgorithmPage: React.FC = () => {
  const location = useLocation();
  const isBubble = location.pathname.endsWith("bubble-sort");
  const isSelection = location.pathname.endsWith("selection-sort");

  const [numElements, setNumElements] = useState(20);
  const [speed, setSpeed] = useState(500);
  const [array, setArray] = useState<number[]>([]);
  const [originalArray, setOriginalArray] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const [isSorted, setIsSorted] = useState(false);

  const generateData = () => {
    if (status === "running") return;
    const newData = Array.from({ length: numElements }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newData);
    setOriginalArray(newData);
    setStatus("idle");
    setIsSorted(false);
  };

  const handleStart = () => {
    if (array.length > 0) setStatus("running");
  };

  const handlePause = () => setStatus("paused");
  const handleContinue = () => setStatus("running");
  const handleAbort = () => {
    setArray([...originalArray]);
    setStatus("idle");
    setIsSorted(false);
  };

  const handleRestart = () => {
    setArray([...originalArray]);
    setStatus("running");
    setIsSorted(false);
  };

  const handleFinish = () => {
    setStatus("idle");
    setIsSorted(true);
  };

  return (
    <div className="h-dvh flex flex-col box-border">
      <Header />

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="p-4 flex flex-col items-center">
          <div className="text-xl font-bold">Algorithm Visualizer</div>
          {isBubble && <div className="text-sm text-gray-600 mt-1">Bubble Sort</div>}
          {isSelection && <div className="text-sm text-gray-600 mt-1">Selection Sort</div>}
        </div>

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
            disabled={status === "running"}
          >
            Generate Data
          </button>
        </div>

        <div className="flex-1 p-4 flex justify-center items-end min-h-[100px]">
          {array.length > 0 && (
            <div className="w-full h-full flex items-end">
              <AlgorithmVisualizer
                array={array}
                speed={speed}
                start={status === "running"}
                paused={status === "paused"}
                algorithm={isBubble ? "bubble" : isSelection ? "selection" : undefined}
                onFinish={handleFinish}
              />
            </div>
          )}
        </div>

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

            {status === "idle" && (
              <>
                {!isSorted ? (
                  <button
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50 cursor-pointer"
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
