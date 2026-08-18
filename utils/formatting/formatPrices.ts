/**
 * Utility functions and metadata for handling and formatting prices in different currencies.
 * - Defines accepted currency codes, their symbols, and locales.
 * - Provides a function to format prices using the appropriate locale and currency.
 */

import { AcceptedCurrenciesType } from "@/types";

// Mapping of currency code to symbol and locale for formatting
export const currencyMeta: Record<
  AcceptedCurrenciesType,
  { symbol: string; locale: string }
> = {
  NGN: { symbol: "₦", locale: "en-NG" },
  USD: { symbol: "$", locale: "en-US" },
};

type formatPricesFunction = (
  price: number | bigint,
  selectedCurrency: AcceptedCurrenciesType,
) => string;

/**
 * Formats a price (in kobo/cents) to the selected currency string using the correct locale.
 * Example: formatPrices(123450, "NGN") => "₦1,234.50"
 * Example: formatPrices(123450, "USD") => "$1,234.50"
 * Example: formatPrices(123450, "EUR") => "Currency not supported"
 */
export const formatPrices: formatPricesFunction = (price, selectedCurrency) => {
  const meta = currencyMeta[selectedCurrency];
  if (!meta) return "Currency not supported";

  const newPrice =
    typeof price === "bigint" ? price / BigInt(100) : price / 100;

  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: selectedCurrency,
  }).format(Number(newPrice));
};
