import React from "react";
import { HiOutlineStar } from "react-icons/hi";
import { HiMiniStar } from "react-icons/hi2";

export type Currency = {
  iso_code: string;
  iso_numeric: string;
  name: string;
  symbol: string;
  start_date: string;
  end_date: string;
};

interface Props {
  currencies: Currency[];
  currency: string;
  setCurrency: (string: string) => void;
  favourite: string[];
  handleFavorite: (string: string) => void;
  title: string;
}

const Dropdown: React.FC<Props> = ({
  currencies,
  currency,
  setCurrency,
  favourite,
  handleFavorite,
  title,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={title}
        className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
      >
        {title}
      </label>
      <div className="relative rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
        <select
          id={title}
          onChange={(e) => setCurrency(e.target.value)}
          value={currency}
          className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
        >
          {favourite && favourite.length > 0 && (
            <>
              {favourite.map((favorite: string) => (
                <option
                  value={favorite}
                  key={`fav-${favorite}`}
                  className="bg-white dark:bg-gray-800 font-semibold text-indigo-600 dark:text-indigo-400"
                >
                  ⭐ {favorite.toUpperCase()}
                </option>
              ))}
              <option disabled className="text-gray-300 dark:text-gray-600">
                ──────────
              </option>
            </>
          )}
          {currencies?.map((curr: Currency) => (
            <option
              value={curr.iso_code}
              key={curr.iso_code}
              className="bg-white dark:bg-gray-800"
            >
              {curr.iso_code} — {curr.name || curr.iso_code}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-transform duration-200 active:scale-90"
          onClick={() => handleFavorite(currency)}
          title={
            favourite.includes(currency)
              ? "Remove from Favorites"
              : "Add to Favorites"
          }
        >
          {favourite.includes(currency) ? (
            <HiMiniStar
              className="text-amber-500 dark:text-amber-400 scale-110 animate-pulse-once"
              size={22}
            />
          ) : (
            <HiOutlineStar
              className="hover:scale-110 transition-transform"
              size={22}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default Dropdown;
