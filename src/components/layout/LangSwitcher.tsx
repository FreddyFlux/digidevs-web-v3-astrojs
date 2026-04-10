import type { Locale } from "../../i18n/locales";
import { LOCALES, LOCALE_LABELS } from "../../i18n/locales";
import { localePath } from "../../i18n/utils";

export default function LangSwitcher({
	pathname,
	lang,
	attachLeft = false,
}: {
	pathname: string;
	lang: Locale;
	/** Flatten left edge to sit flush against GlassNavBar (ear on the right). */
	attachLeft?: boolean;
}) {
	const outerClass = [
		"origin-top shrink-0 scale-[0.945] overflow-hidden backdrop-blur-[10px] transition-transform duration-300 ease-out hover:scale-[0.99225]",
		attachLeft ? "rounded-[20px] rounded-l-none" : "rounded-[20px]",
	].join(" ");

	return (
		<div className={outerClass} style={{ backgroundColor: "rgba(242, 242, 242, 0.45)" }}>
			<div className="flex items-center gap-2 px-[13px] py-[10px] sm:px-[21px] sm:py-[13px]">
				{LOCALES.map((locale) => (
					<a
						key={locale}
						href={localePath(pathname, lang, locale)}
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
