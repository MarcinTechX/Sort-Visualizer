import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const HomePage: React.FC = () => {
  return (
    <div className="h-dvh flex flex-col box-border">
      <Header />

      <main className="flex-1 flex flex-col items-center p-4 overflow-auto">
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <h1 className="text-3xl font-bold text-center">Choose algorithm:</h1>
          <ul className="flex flex-col gap-4 w-full">
          <li className="flex flex-col gap-4">
            <Link
              to="/bubble-sort"
              className="block p-4 bg-blue-500 text-white rounded hover:bg-blue-600 text-center w-full text-xl font-semibold"
            >
              Bubble Sort
            </Link>
            <Link
              to="/selection-sort"
              className="block p-4 bg-blue-500 text-white rounded hover:bg-blue-600 text-center w-full text-xl font-semibold"
            >
              Selection Sort
            </Link>
            <Link
              to="/quick-sort"
              className="block p-4 bg-blue-500 text-white rounded hover:bg-blue-600 text-center w-full text-xl font-semibold"
            >
              Quick Sort
            </Link>            
          </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
