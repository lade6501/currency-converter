import React, { useCallback, useEffect, useState } from "react";
import {
  HiArrowsRightLeft,
  HiSun,
  HiMiniMoon,
  HiArrowPath,
  HiCurrencyDollar,
  HiChartBar,
} from "react-icons/hi2";

import useFetchApi from "../hooks/useFetchApi";
import Dropdown, { Currency } from "./Dropdown";
import { useCookies } from "react-cookie";
import CurrencyTrendChart from "./CurrencyTrendChart";
import fetchHistoricalRates from "../utils/utils";

interface ConversionData {
  quote: string;
  base: string;
  date: string;
  rate: number;
}

const CurrencyConverter: React.FC = () => {
  const [cookies, setCookie] = useCookies(["favorites"]);
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("INR");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [themeTogglor, setThemeTogglor] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>(
    [],
  );

  const BASE_URL = import.meta.env.VITE_BASE_ENDPOINT;

  const {
    data: currencies,
    fetchData: fetchCurrencyData,
    loading: currenciesLoading,
  } = useFetchApi(`${BASE_URL}currencies`);

  const {
    data: conversionData,
    loading,
    fetchData,
  } = useFetchApi<ConversionData | null>(
    `${BASE_URL}rate/${fromCurrency}/${toCurrency}`,
  );

  const getFavouritesFromCookies = useCallback(() => {
    const cookieValue = cookies.favorites;
    return cookieValue ? cookieValue : [];
  }, [cookies.favorites]);

  const favouritesCurrencies = getFavouritesFromCookies();

  const handleFavorite = (currency: string) => {
    const existingFavourite = favouritesCurrencies.find(
      (item: string) => item.toLowerCase() === currency.toLowerCase(),
    );
    if (existingFavourite) {
      setCookie(
        "favorites",
        favouritesCurrencies.filter(
          (item: string) => item.toLowerCase() !== currency.toLowerCase(),
        ),
      );
    } else {
      setCookie("favorites", [...favouritesCurrencies, currency]);
    }
  };

  const loadHistoricalData = async (startDate: Date, endDate: Date) => {
    const history = await fetchHistoricalRates(
      fromCurrency,
      toCurrency,
      amount,
      startDate,
      endDate,
    );

    setChartData(history);
  };

  const convertCurrency = async () => {
    setConverting(true);
    fetchData();
  };

  const swapCurrency = () => {
    setIsSwapping(true);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const darkModeHandler = () => {
    setThemeTogglor(!themeTogglor);
    document.body.classList.toggle("dark");
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  useEffect(() => {
    if (!loading && conversionData) {
      const result = parseFloat(amount) * conversionData?.rate;
      setConvertedAmount(
        `Converted amount is ${result.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        })} ${toCurrency}`,
      );
    }
  }, [conversionData, loading]);

  useEffect(() => {
    if (showHistory) {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);

      loadHistoricalData(start, end);
    }
  }, [showHistory, fromCurrency, toCurrency, amount]);

  if (currenciesLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <HiArrowPath className="text-5xl text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
        <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Loading currency data...
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700/60 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-inner">
            <HiCurrencyDollar size={28} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Currency Converter
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Real-time exchange rates & interactive historical metrics
            </p>
          </div>
        </div>

        <button
          onClick={darkModeHandler}
          className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-amber-400 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm"
          aria-label="Toggle dark mode"
        >
          {themeTogglor ? (
            <HiSun
              size={20}
              className="rotate-45 transition-transform duration-500 text-amber-500"
            />
          ) : (
            <HiMiniMoon
              size={20}
              className="transition-transform duration-500 text-slate-700"
            />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center bg-gray-50/60 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/30">
        <div className="sm:col-span-3">
          <Dropdown
            currencies={currencies as Currency[]}
            title="From"
            currency={fromCurrency}
            setCurrency={setFromCurrency}
            favourite={favouritesCurrencies}
            handleFavorite={handleFavorite}
          />
        </div>

        <div className="flex justify-center sm:col-span-1 pt-4 sm:pt-6">
          <button
            onClick={swapCurrency}
            disabled={isSwapping}
            className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-md border border-gray-100 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all duration-300 transform hover:rotate-180 active:scale-90"
            title="Swap Currencies"
          >
            <HiArrowsRightLeft
              className={`text-xl transition-transform duration-300 ${isSwapping ? "scale-75" : ""}`}
            />
          </button>
        </div>

        <div className="sm:col-span-3">
          <Dropdown
            currencies={currencies as Currency[]}
            title="To"
            currency={toCurrency}
            setCurrency={setToCurrency}
            favourite={favouritesCurrencies}
            handleFavorite={handleFavorite}
          />
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="amount"
          className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2"
        >
          Amount to Convert
        </label>
        <input
          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-800 font-semibold rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all text-lg"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          name="amount"
          id="amount"
          placeholder="Enter value..."
          min="0"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 border-t border-gray-100 dark:border-gray-700/50 pt-6">
        <div className="min-h-[48px] flex items-center flex-1">
          {converting && (
            <div className="w-full text-left animate-fade-in">
              {loading ? (
                <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-medium text-sm">
                  <HiArrowPath className="animate-spin text-lg" />
                  <span>Calculating conversion rates...</span>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-base font-bold text-emerald-600 dark:text-emerald-400 shadow-sm animate-scale-up">
                  {convertedAmount}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={convertCurrency}
          disabled={converting && loading}
          className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-xl hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          {converting && loading && <HiArrowPath className="animate-spin" />}
          <span>Convert</span>
        </button>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-slate-500 dark:text-slate-400">
            <HiChartBar size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Historical Analytics
            </h4>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              View historical data and conversion trend graphs
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
            showHistory ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
          }`}
          aria-label="Toggle history visibility"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
              showHistory ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {showHistory && (
        <div className="mt-4 pt-4 border-t border-dashed border-gray-100 dark:border-gray-700/30 animate-scale-up">
          <CurrencyTrendChart
            chartData={chartData}
            amount={amount}
            from={fromCurrency}
            to={toCurrency}
            onRangeChange={loadHistoricalData}
          />
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
