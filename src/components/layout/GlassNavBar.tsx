import { useEffect, useId, useRef, useState } from "react";

const aboutLinks = [
  { href: "/about", label: "About" },
  { href: "/about/competence", label: "Competence" },
  { href: "/about/quality", label: "Quality" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function GlassNavBar({ pathname }: { pathname: string }) {
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

  const blogActive =
    pathname === "/blog" || pathname.startsWith("/blog/");
  const aboutNavActive =
    pathname === "/about" || pathname.startsWith("/about/");

  return (
    <div ref={wrapRef} className="w-full">
      <div
        className="origin-top scale-[0.945] overflow-hidden rounded-[20px] backdrop-blur-[10px] transition-transform duration-300 ease-out hover:scale-[0.99225]"
        style={{ backgroundColor: "rgba(242, 242, 242, 0.45)" }}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 sm:px-8 sm:py-5">
          <div className="flex min-w-0 justify-start">
            <a
              href="/blog"
              className={`font-headline text-xl font-bold tracking-tight transition-colors sm:text-2xl ${
                blogActive
                  ? "text-secondary"
                  : "text-[#242424] hover:text-secondary"
              }`}
              aria-current={blogActive ? "page" : undefined}
            >
              Blog
            </a>
          </div>

          <a
            href="/"
            className="shrink-0 transition-opacity hover:opacity-80"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <img
              src="/digidevs-logo-dark.svg"
              alt="digiDEVS"
              width={573}
              height={95}
              className="block h-7 w-auto sm:h-8"
              decoding="async"
            />
          </a>

          <div className="flex min-w-0 justify-end">
            <button
              type="button"
              className={`font-headline text-right text-xl font-bold tracking-tight transition-colors sm:text-2xl ${
                aboutNavActive
                  ? "text-secondary"
                  : "text-[#242424]/80 hover:text-secondary"
              } cursor-pointer`}
              aria-expanded={open}
              aria-controls={panelId}
              id={`${panelId}-trigger`}
              onClick={() => setOpen((v) => !v)}
            >
              About
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
            <div className="border-t border-[#222222]/10 px-5 pb-6 pt-2 sm:px-8 sm:pb-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
                <div>
                  <div className="grid grid-cols-1 gap-0 divide-y divide-[#222222]/10 sm:grid-cols-2 sm:divide-x sm:divide-y">
                    {aboutLinks.map((item) => {
                      const active = isActive(pathname, item.href);
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          className="group px-0 py-4 font-body text-[16px] font-bold leading-snug text-[#111111] transition-colors first:pt-0 hover:text-secondary sm:px-2 sm:py-5 sm:first:pt-5"
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
                    <p className="font-headline mb-4 text-[12px] font-bold uppercase tracking-[0.2em] text-secondary">
                      Contact
                    </p>
                    <div className="flex flex-col gap-3 font-body text-[17px] leading-tight text-[#111111]">
                      <a
                        className="text-center font-bold transition-colors hover:text-secondary lg:text-left"
                        href="tel:+4790000000"
                      >
                        +47 45 39 96 39
                      </a>
                      <a
                        className="text-center font-bold transition-colors hover:text-secondary lg:text-left"
                        href="mailto:hello@digidevs.no"
                      >
                        fredrik@digidevs.no
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="font-headline mb-2 text-[12px] font-bold uppercase tracking-[0.2em] text-secondary">
                      Visit
                    </p>
                    <p className="font-body text-[17px] font-bold leading-relaxed text-[#111111]">
                      Split, Croatia
                      <br />
                      Trondheim, Norway
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
