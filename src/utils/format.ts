const compactNumber = new Intl.NumberFormat(undefined, { notation: "compact" });
const fullNumber = new Intl.NumberFormat();
const mediumDate = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

export function formatCompact(value: number): string {
  return compactNumber.format(value); // 245123 → "245K"
}

export function formatFull(value: number): string {
  return fullNumber.format(value); // 245123 → "245,123"
}

export function formatDate(iso: string): string {
  return mediumDate.format(new Date(iso)); // "Sep 21, 2026"
}

export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
