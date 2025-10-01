import { HashRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import BubbleSortPage from "./pages/BubbleSortPage";
import SelectionSortPage from "./pages/SelectionSortPage";
import QuickSortPage from "./pages/QuickSortPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bubble-sort" element={<BubbleSortPage />} />
        <Route path="/selection-sort" element={<SelectionSortPage />} />
        <Route path="/quick-sort" element={<QuickSortPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
