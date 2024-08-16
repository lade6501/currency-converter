import React, { useEffect, useState } from "react";
import { HiArrowsRightLeft } from "react-icons/hi2";

import useFetchApi from "../hooks/useFetchApi";
import Dropdown from "./Dropdown";

const CurrencyConvertor: React.FC = () => {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("INR");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [favourites, setFavourites] = useState<string[]>([]);
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  const { data: currencies, fetchData: fetchCurrencyData } = useFetchApi(
    import.meta.env.VITE_CURRENCIES_ENDPOINT
  );

  const {
    data: conversionData,
    loading,
    fetchData,
  } = useFetchApi(
    `${
      import.meta.env.VITE_CONVERSION_ENDPOINT
    }?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
  );

  const handleFavorite = (currency: string) => {
    setFavourites([...favourites, currency]);
  };

  const convertCurrency = () => {
    setConverting(loading);
    fetchData();
  };

  const swapCurrency = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  useEffect(() => {
    setConverting(!loading);
    if (!loading) {
      setConvertedAmount(
        `Converted amount is ${conversionData?.rates[toCurrency]} ${toCurrency}`
      );
    }
  }, [conversionData, loading]);

  return (
    <div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md dark:bg-gray-600">
      <div className="flex justify-between p-2 mb-5">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">
          Currency Converter
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <Dropdown
          currencies={Object.keys(currencies || {})}
          title="From"
          currency={fromCurrency}
          setCurrency={setFromCurrency}
          favourite={favourites}
          handleFavorite={handleFavorite}
        />
        {/* show switch icon */}
        <div className="flex justify-center -mb-5 sm:mb-0">
          <button
            onClick={swapCurrency}
            className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
          >
            <HiArrowsRightLeft className="text-xl text-gray-700" />
          </button>
        </div>
        <Dropdown
          currencies={Object.keys(currencies || {})}
          title="To"
          currency={toCurrency}
          setCurrency={setToCurrency}
          favourite={favourites}
          handleFavorite={handleFavorite}
        />
      </div>

      <div className="mt-4 ">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 dark:text-white"
        >
          Amount:
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          name="amount"
          id="amount"
        />
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={convertCurrency}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Convert
        </button>
      </div>
      <div className="mt-4 text-lg font-medium text-right text-green-500 dark:text-white">
        {converting ? <>{loading ? "Loading..." : convertedAmount}</> : null}
      </div>
    </div>
  );
};

export default CurrencyConvertor;
