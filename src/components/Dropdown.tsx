import React from "react";
import { HiOutlineStar } from "react-icons/hi";
import { HiMiniStar } from "react-icons/hi2";

interface Props {
  currencies: string[];
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
    <div>
      <label
        htmlFor={title}
        className="block text-sm font-medium text-gray-700 dark:text-white"
      >
        {title}
      </label>
      <div className="mt-1 relative">
        <select
          onChange={(e) => setCurrency(e.target.value)}
          value={currency}
          className="w-full p-2 border border-gray-300 bg-gray-200 rounded-md shadow-md focus:outline-none foucs:ring-2 focus:ring-indigo-500"
        >
          {favourite?.map((favorite: string) => (
            <option value={favorite} key={favorite}>
              {favorite}
            </option>
          ))}
          <hr />
          {currencies?.map((currency: string) => (
            <option value={currency} key={currency}>
              {currency}
            </option>
          ))}
        </select>
        <button
          className="absolute inset-y-0 right-0 pr-5 flex items-center text-sm leading-5"
          onClick={() => handleFavorite(currency)}
        >
          {/* <HiOutlineStar  size={20} /> */}

          {favourite.includes(currency) ? (
            <HiMiniStar fill="green" size={20} />
          ) : (
            <HiOutlineStar size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Dropdown;
