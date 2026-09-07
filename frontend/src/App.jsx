import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./components/Home.jsx";
import PredictionForm from "./components/PredictionForm.jsx";
import ResultDashboard from "./components/ResultDashboard.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<PredictionForm />} />
        <Route path="/result" element={<ResultDashboard />} />
      </Routes>
    </Layout>
  );
}
