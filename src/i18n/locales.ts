export const LOCALES = ["no", "en", "hr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "no";

export const LOCALE_LABELS: Record<Locale, string> = {
	no: "Norsk",
	en: "English",
	hr: "Hrvatski",
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
	no: "nb",
	en: "en",
	hr: "hr",
};
