import type { Locale } from "../../i18n/locales";
import { LOCALES, LOCALE_LABELS } from "../../i18n/locales";
import { localePath } from "../../i18n/utils";

export default function LangSwitcher({
	pathname,
	lang,
	attachLeft = false,
	localeHrefs,
}: {
	pathname: string;
	lang: Locale;
	/** When set (e.g. blog posts), each locale links to the correct translated path instead of swapping the prefix only. */
	localeHrefs?: Partial<Record<Locale, string>>;
	/** Flatten left edge to sit flush against GlassNavBar (ear on the right). */
	attachLeft?: boolean;
}) {
	const outerClass = [
		"origin-top shrink-0 overflow-hidden backdrop-blur-[10px] transition-transform duration-300 ease-out md:scale-[0.945] md:hover:scale-[0.99225]",
		attachLeft
			? "rounded-[10px] rounded-l-none md:rounded-[20px] md:rounded-l-none"
			: "rounded-[10px] md:rounded-[20px]",
	].join(" ");

	return (
		<div className={outerClass} style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}>
			<div className="flex items-center gap-2 px-[13px] py-[10px] sm:px-[21px] sm:py-[13px]">
				{LOCALES.map((locale) => (
					<a
						key={locale}
						href={localeHrefs?.[locale] ?? localePath(pathname, lang, locale)}
						className={`font-label text-xs uppercase tracking-widest transition-colors ${
							locale === lang
								? "font-bold text-secondary"
								: "font-medium text-[#141414] hover:text-secondary"
						}`}
						aria-label={LOCALE_LABELS[locale]}
						aria-current={locale === lang ? "true" : undefined}
					>
						{locale.toUpperCase()}
					</a>
				))}
			</div>
		</div>
	);
}
