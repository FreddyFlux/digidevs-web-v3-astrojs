import { useEffect, useId, useRef, useState } from "react";
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
  return (
    normalizedPathname === href || normalizedPathname.startsWith(`${href}/`)
  );
}

export default function GlassNavBar({
  pathname,
  lang,
  attachRight = false,
}: {
  pathname: string;
  lang: Locale;
  /** Flatten right edge so LangSwitcher can sit flush (ear). */
  attachRight?: boolean;
}) {
  const t = useTranslations(lang);
  const langPrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const normalized = stripLangPrefix(pathname, lang);

  const aboutLinks = [
    { path: "/about" as const, label: t("nav_about_links.about") },
    {
      path: "/about/competence" as const,
      label: t("nav_about_links.competence"),
    },
    { path: "/about/quality" as const, label: t("nav_about_links.quality") },
  ] as const;

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const blogActive = isActive(normalized, "/blog");
  const aboutNavActive = isActive(normalized, "/about");
  const contactActive = isActive(normalized, "/contact");
  const homeHref = langPrefix || "/";
  const blogHref = `${langPrefix}/blog`;
  const contactHref = `${langPrefix}/contact`;

  return (
    <div ref={wrapRef} className="w-full min-w-0">
      <div
        className={`origin-top overflow-hidden bg-navbar-glass backdrop-blur-[10px] transition-transform duration-300 ease-out md:scale-[0.945] md:hover:scale-[0.99225] ${
          attachRight
            ? "rounded-[10px] rounded-r-none md:rounded-[20px] md:rounded-r-none"
            : "rounded-[10px] md:rounded-[20px]"
        }`}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3 sm:gap-4 sm:px-8 sm:py-5">
          <div className="flex min-w-0 justify-start">
            <a
              href={blogHref}
              className={`font-headline text-lg font-bold tracking-tight transition-colors sm:text-xl md:text-2xl ${
                blogActive
                  ? "text-secondary"
                  : "text-navbar-glass-fg hover:text-secondary"
              }`}
              aria-current={blogActive ? "page" : undefined}
            >
              {t("nav.blog")}
            </a>
          </div>

          <a
            href={homeHref}
            className="shrink-0 transition-opacity hover:opacity-80"
            aria-current={normalized === "/" ? "page" : undefined}
          >
            <img
              src="/favicon.svg"
              alt="digiDEVS"
              width={256}
              height={256}
              className="block size-7 md:hidden"
              decoding="async"
            />
            <img
              src="/digidevs-logo-dark.svg"
              alt={t("nav.logo_alt")}
              width={573}
              height={95}
              className="vt-site-logo hidden h-6 w-auto sm:h-7 md:block md:h-8"
              decoding="async"
            />
          </a>

          <div className="flex min-w-0 justify-end">
            <button
              type="button"
              className={`font-headline text-right text-lg font-bold tracking-tight transition-colors sm:text-xl md:text-2xl ${
                aboutNavActive
                  ? "text-secondary"
                  : "text-navbar-glass-fg-muted hover:text-secondary"
              } cursor-pointer`}
              aria-expanded={open}
              aria-controls={panelId}
              id={`${panelId}-trigger`}
              onClick={() => setOpen((v) => !v)}
            >
              {t("nav.about")}
            </button>
          </div>
        </div>

        <div
          id={panelId}
          role="region"
          aria-labelledby={`${panelId}-trigger`}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="max-h-[min(75dvh,560px)] overflow-y-auto overscroll-contain border-t border-navbar-glass-divider px-3 pb-5 pt-2 sm:px-8 sm:pb-8 md:max-h-none md:overflow-visible">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
                <div>
                  <div className="grid grid-cols-1 gap-0 divide-y divide-navbar-glass-divider sm:grid-cols-2 sm:divide-x sm:divide-y">
                    {aboutLinks.map((item) => {
                      const href = `${langPrefix}${item.path}`;
                      const active = isActive(normalized, item.path);
                      return (
                        <a
                          key={item.path}
                          href={href}
                          className="group px-0 py-4 font-body text-[16px] font-bold leading-snug text-navbar-glass-fg-strong transition-colors first:pt-0 hover:text-secondary sm:px-2 sm:py-5 sm:first:pt-5"
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                        >
                          <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-secondary after:transition-[width] group-hover:after:w-full">
                            {item.label}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-10 lg:max-w-xs lg:pl-4">
                  <div>
                    <a
                      href={contactHref}
                      className="font-headline mb-4 inline-block text-[12px] font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:underline hover:underline-offset-4"
                      onClick={() => setOpen(false)}
                      aria-current={contactActive ? "page" : undefined}
                    >
                      {t("nav_drawer.contact")}
                    </a>
                    <div className="flex flex-col gap-3 font-body text-[17px] leading-tight text-navbar-glass-fg-strong">
                      <a
                        className="text-center font-bold transition-colors hover:text-secondary lg:text-left"
                        href="tel:+4745399639"
                      >
                        +47 45 39 96 39
                      </a>
                      <a
                        className="text-center font-bold transition-colors hover:text-secondary lg:text-left"
                        href="mailto:fredrik@digidevs.no"
                      >
                        fredrik@digidevs.no
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="font-headline mb-2 text-[12px] font-bold uppercase tracking-[0.2em] text-secondary">
                      {t("nav_drawer.visit")}
                    </p>
                    <p className="font-body text-[17px] font-bold leading-relaxed text-navbar-glass-fg-strong whitespace-pre-line">
                      {t("nav_drawer.locations")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
