
import TradingChart from "./components/TradingChart";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <strong>My Trading Platform</strong>
        <span>Market Chart</span>
      </header>

      <main className="chart-page">
        <TradingChart />
      </main>
    </div>
  );
}