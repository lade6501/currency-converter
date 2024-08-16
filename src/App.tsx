import "./App.css";
import CurrencyConvertor from "./components/CurrencyConvertor";

function App() {
  return (
    <>
      <h1 className="min-h-screen bg-gray-100 flex flex-col items-center justify-center dark:bg-gray-700">
        <div className="container">
          <CurrencyConvertor />
        </div>
      </h1>
    </>
  );
}

export default App;
