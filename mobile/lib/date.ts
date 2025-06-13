import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDateTime(
  date: string,
  options?: Intl.DateTimeFormatOptions
) {
  if (!date) return "";

  let defaultOptions = options ?? {
    dateStyle: "short",
    timeStyle: "short",
  };

  const dateTimeFomat = new Intl.DateTimeFormat("fr-FR", defaultOptions);
  return dateTimeFomat.format(new Date(date));
}

export function format(date: string) {
  return formatRelative(date, new Date(), { locale: fr });
}
