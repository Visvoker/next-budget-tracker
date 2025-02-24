export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "GBP", label: "£ British Pound", locale: "en-GB" },
  { value: "JPY", label: "¥ Japanese Yen", locale: "ja-JP" },
  { value: "TWD", label: "NT$ New Taiwan Dollar", locale: "zh-TW" },
  { value: "CNY", label: "¥ Chinese Yuan", locale: "zh-CN" },
  { value: "KRW", label: "₩ South Korean Won", locale: "ko-KR" }
]

export type Currency = (typeof Currencies)[0];