# Sorting Visualizer

Sorting Visualizer is an interactive web application that visualizes sorting algorithms in real time.  
It allows you to see how different sorting algorithms work on a set of random numbers, step by step, with adjustable animation speed and array size.

**Built with:**  
- **React** (with TypeScript)  
- **Vite**  
- **Tailwind CSS**  

---

## Currently Implemented Algorithms
- **Bubble Sort** 
- **Selection Sort**
- **Quick Sort**

---

## Features
- Generate random data to sort.
- Adjust the number of elements in the array.
- Control animation speed (in ms).
- Start, Pause, Continue, Restart, and Abort the animation.
- Speed = 0 runs the algorithm instantly; Speed > 0 plays step-by-step.

- Color indicators:
  - General
    - 🟢 Green: elements that are already sorted/final
    - 🔴 Red: currently compared elements
    - 🔵 Blue: default bars
  - Quick Sort specifics (Lomuto-style partition visualization)
    - 🟠 Orange: pivot (shown at the end of the current range during partition)
    - 🟣 Purple: i pointer (boundary of the < pivot region)
    - 🔴 Red: j pointer (current element being scanned)
    - 🔵 Blue: active subarray [low..high]
    - 🔵 Dim: bars outside the current subarray are dimmed

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MarcinTechX/Sort-Visualizer.git
   cd Sort-Visualizer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the app in development mode:

   ```bash
   npm run dev
   ```

4. Open your browser at the address shown in the terminal.

## Live Demo

Check out the Sorting Visualizer in action on GitHub Pages:  
[https://MarcinTechX.github.io/Sort-Visualizer/](https://MarcinTechX.github.io/Sort-Visualizer/)
