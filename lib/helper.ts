import { Currencies } from "./currencies";

export const DateToUTCDate = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

export const GetFormatterForCurrency = (currency: string) => {
  const locale = Currencies.find((c) => c.value === currency)?.locale || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}