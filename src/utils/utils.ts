export const fetchHistoricalRates = async (
  fromCurrency: string,
  toCurrency: string,
  amount: string,
  startDate: Date,
  endDate: Date,
) => {
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const url = `https://api.frankfurter.dev/v2/rates?from=${formatDate(
    startDate,
  )}&to=${formatDate(endDate)}&base=${fromCurrency}&quotes=${toCurrency}`;

  const response = await fetch(url);

  const data = await response.json();

  return data.map((item: any) => ({
    date: item.date,
    value: Number((Number(amount) * item.rate).toFixed(2)),
  }));
};

export default fetchHistoricalRates;
