import "./App.css";
import CurrencyConverter from "./components/CurrencyConverter";

function App() {
  return (
    <>
      <h1 className="min-h-screen bg-gray-100 flex flex-col items-center justify-center dark:bg-gray-700">
        <div className="container">
          <CurrencyConverter />
        </div>
      </h1>
    </>
  );
}

export default App;
