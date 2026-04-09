import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { useTranslations } from "../../i18n/utils";

function stripLangPrefix(pathname: string, lang: Locale): string {
	if (lang === DEFAULT_LOCALE) return pathname;
	const p = `/${lang}`;
	if (pathname === p) return "/";
	if (pathname.startsWith(`${p}/`)) return pathname.slice(p.length) || "/";
	return pathname;
}

function isActive(normalizedPathname: string, href: string) {
	if (href === "/") return normalizedPathname === "/";
	return normalizedPathname === href || normalizedPathname.startsWith(`${href}/`);
}

export default function MobileNav({ pathname, lang }: { pathname: string; lang: Locale }) {
	const t = useTranslations(lang);
	const langPrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
	const normalized = stripLangPrefix(pathname, lang);

	const links = [
		{ path: "/" as const, label: t("nav.home") },
		{ path: "/blog" as const, label: t("nav.blog") },
		{ path: "/about" as const, label: t("nav.about") },
		{ path: "/about/competence" as const, label: t("nav_about_links.competence") },
		{ path: "/about/quality" as const, label: t("nav_about_links.quality") },
	] as const;

	const contactHref = `${langPrefix}/contact`;

	const [open, setOpen] = useState(false);
	const panelId = useId();
	const closeRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeRef.current?.focus();
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<div className="flex items-center md:hidden">
			<button
				type="button"
				className="text-secondary transition-all duration-300 ease-out hover:text-on-surface active:scale-[0.98]"
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen(true)}
			>
				<span className="sr-only">{t("mobile.open_menu")}</span>
				<Menu className="size-6" strokeWidth={1.5} aria-hidden />
			</button>

			{open ? (
				<div
					className="fixed inset-0 z-60 backdrop-blur-3xl"
					style={{
						background: "color-mix(in oklab, var(--color-surface) 92%, transparent)",
					}}
					id={panelId}
					role="dialog"
					aria-modal="true"
					aria-label={t("mobile.site_navigation")}
				>
					<div className="relative flex h-full flex-col justify-center px-12 md:px-24">
						<button
							ref={closeRef}
							type="button"
							className="absolute right-8 top-8 text-on-surface-variant transition-all hover:text-on-surface"
							onClick={() => setOpen(false)}
						>
							<span className="sr-only">{t("mobile.close_menu")}</span>
							<X className="size-10" strokeWidth={1.25} aria-hidden />
						</button>

						<div className="mb-12">
							<img
								src="/digidevs-logo-dark.svg"
								alt="digiDEVS"
								width={573}
								height={95}
								className="block h-10 w-auto max-w-[min(85vw,420px)]"
								decoding="async"
							/>
						</div>

						<nav className="mb-16 flex flex-col gap-8" aria-label="Primary">
							{links.map(({ path, label }) => {
								const href = `${langPrefix}${path}`;
								const active = isActive(normalized, path);
								return (
									<a
										key={path}
										href={href}
										className={`font-headline text-5xl tracking-editorial transition-all md:text-6xl ${
											active
												? "font-bold text-tertiary"
												: "font-medium text-on-surface-variant hover:text-on-surface"
										}`}
										onClick={() => setOpen(false)}
									>
										{label}
									</a>
								);
							})}
						</nav>

						<div className="mt-auto flex flex-col gap-4 py-12">
							<a
								href={contactHref}
								className="rounded-xl bg-linear-to-br from-primary-soft to-primary-container px-8 py-4 text-center font-label font-semibold uppercase tracking-widest text-on-primary-container transition-transform hover:brightness-105 active:scale-95"
							>
								{t("mobile.get_in_touch")}
							</a>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
