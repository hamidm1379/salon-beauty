const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianNumbers(str: string | number): string {
  return String(str).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}
