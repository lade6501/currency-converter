import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Ensure standard wrapper layouts exist

type ChartData = {
  date: string;
  value: number;
};

interface Props {
  chartData: ChartData[];
  amount: string;
  from: string;
  to: string;
  onRangeChange: (startDate: Date, endDate: Date) => void;
}

const CurrencyTrendChart: React.FC<Props> = ({
  chartData,
  amount,
  from,
  to,
  onRangeChange,
}) => {
  const [selectedRange, setSelectedRange] = useState("30");

  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });

  const [endDate, setEndDate] = useState<Date>(new Date());

  const hasData = chartData && chartData.length > 0;
  const minValue = hasData
    ? Math.min(...chartData.map((item) => item.value))
    : 0;
  const maxValue = hasData
    ? Math.max(...chartData.map((item) => item.value))
    : 100;

  const handlePresetRange = (days: number) => {
    const end = new Date();
    const start = new Date();

    if (days === 365) {
      start.setFullYear(end.getFullYear() - 1);
    } else if (days === 1825) {
      start.setFullYear(end.getFullYear() - 5);
    } else {
      start.setDate(end.getDate() - days);
    }

    setStartDate(start);
    setEndDate(end);
    setSelectedRange(String(days));
    onRangeChange(start, end);
  };

  const handleCustomDate = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedRange("custom");
    onRangeChange(start, end);
  };

  const formatXAxisTicks = (dateStr: string) => {
    const dateObj = new Date(dateStr);

    if (selectedRange === "365" || selectedRange === "1825") {
      return dateObj.toLocaleDateString("en-US", {
        year: "2-digit",
        month: "short",
      });
    }

    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="chart-container bg-white dark:bg-gray-800/40 rounded-2xl transition-all duration-300">
      <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-4 flex flex-wrap items-center gap-1">
        <span>Historical Trend:</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          {amount} {from} in {to}
        </span>
      </h3>

      <div className="chart-toolbar flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-50 dark:border-gray-700/30">
        <div className="range-buttons flex bg-gray-100 dark:bg-gray-900/60 p-1 rounded-xl w-max border border-gray-200/40 dark:border-gray-800">
          {[
            { label: "7D", value: 7 },
            { label: "1M", value: 30 },
            { label: "1Y", value: 365 },
            { label: "5Y", value: 1825 },
          ].map((range) => (
            <button
              key={range.value}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                selectedRange === String(range.value)
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-400"
                  : "text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              onClick={() => handlePresetRange(range.value)}
            >
              {range.label}
            </button>
          ))}

          <button
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
              selectedRange === "custom"
                ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-400"
                : "text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setSelectedRange("custom")}
          >
            Custom
          </button>
        </div>

        {selectedRange === "custom" && (
          <div className="date-picker-wrapper flex items-center gap-2 bg-gray-50 dark:bg-gray-900/40 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700/50 animate-scale-up">
            <div className="react-datepicker-wrapper">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  if (!date) return;
                  handleCustomDate(date, endDate);
                }}
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="w-24 text-center text-xs bg-transparent border-none text-gray-600 dark:text-gray-300 font-semibold focus:outline-none cursor-pointer"
              />
            </div>

            <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>

            <div className="react-datepicker-wrapper">
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => {
                  if (!date) return;
                  handleCustomDate(startDate, date);
                }}
                dateFormat="yyyy-MM-dd"
                minDate={startDate}
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="w-24 text-center text-xs bg-transparent border-none text-gray-600 dark:text-gray-300 font-semibold focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      <div className="w-full h-[280px] relative mt-2">
        {!hasData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50/40 dark:bg-gray-900/10 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700/60 p-6 text-center">
            <svg
              className="w-10 h-10 mb-2 opacity-50 text-indigo-500 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No chart trend logs populated
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Convert currencies or change historical range presets above to map
              rates
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
                className="dark:stroke-gray-700/30"
              />

              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisTicks}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />

              <YAxis
                domain={[
                  Math.floor(minValue * 0.998),
                  Math.ceil(maxValue * 1.002),
                ]}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                }
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                  padding: "10px 14px",
                }}
                itemStyle={{
                  color: "#4f46e5",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
                labelStyle={{
                  color: "#64748b",
                  fontSize: "11px",
                  marginBottom: "4px",
                }}
                formatter={(value) => [
                  `${parseFloat(value as string).toFixed(4)} ${to}`,
                  "Exchange Rate",
                ]}
                labelFormatter={(date) =>
                  new Date(date).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })
                }
                cursor={{
                  stroke: "#4f46e5",
                  strokeWidth: 1.5,
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fill="url(#colorTrend)"
                activeDot={{
                  r: 6,
                  stroke: "#ffffff",
                  strokeWidth: 2,
                  fill: "#4f46e5",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CurrencyTrendChart;
