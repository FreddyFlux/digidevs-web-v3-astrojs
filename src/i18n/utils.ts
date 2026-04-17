import type { Locale } from "./locales";
import { DEFAULT_LOCALE } from "./locales";
import no from "./translations/no.json";
import en from "./translations/en.json";
import hr from "./translations/hr.json";

const translations = { no, en, hr } as const;

export function useTranslations(lang: Locale) {
	return function t(key: string): string {
		const keys = key.split(".");
		let value: unknown = translations[lang];
		for (const k of keys) {
			if (typeof value !== "object" || value === null) break;
			value = (value as Record<string, unknown>)[k];
		}
		if (typeof value !== "string") {
			let fallback: unknown = translations[DEFAULT_LOCALE];
			for (const k of keys) {
				if (typeof fallback !== "object" || fallback === null) break;
				fallback = (fallback as Record<string, unknown>)[k];
			}
			return typeof fallback === "string" ? fallback : key;
		}
		return value;
	};
}

export function localePath(pathname: string, currentLocale: Locale, targetLocale: Locale): string {
	let stripped = pathname;
	if (currentLocale !== DEFAULT_LOCALE) {
		stripped = pathname.replace(new RegExp(`^/${currentLocale}`), "") || "/";
	}
	if (targetLocale === DEFAULT_LOCALE) return stripped || "/";
	return `/${targetLocale}${stripped === "/" ? "" : stripped}`;
}

/** Blog index path: default locale has no prefix. */
export function blogIndexPath(locale: Locale): string {
	return locale === DEFAULT_LOCALE ? "/blog" : `/${locale}/blog`;
}

/** Single post URL for a locale (matches canonical patterns in blog routes). */
export function blogPostPath(locale: Locale, slug: string): string {
	return locale === DEFAULT_LOCALE ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
}

export function getLocaleFromParams(params: Record<string, string | undefined>): Locale {
	const lang = params.lang;
	if (lang === "en" || lang === "hr") return lang;
	return DEFAULT_LOCALE;
}

export function stripLocalePrefixFromPathname(pathname: string): string {
	for (const loc of ["en", "hr"] as const) {
		if (pathname === `/${loc}`) return "/";
		if (pathname.startsWith(`/${loc}/`)) return pathname.slice(`/${loc}`.length) || "/";
	}
	return pathname;
}

export function getLocaleFromPathname(pathname: string): Locale {
	if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
	if (pathname === "/hr" || pathname.startsWith("/hr/")) return "hr";
	return DEFAULT_LOCALE;
}
