import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
	{ href: "/", label: "Home" },
	{ href: "/blog", label: "Blog" },
	{ href: "/about", label: "About" },
	{ href: "/about/competence", label: "Competence" },
	{ href: "/about/quality", label: "Quality" },
] as const;

function isActive(pathname: string, href: string) {
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileNav({ pathname }: { pathname: string }) {
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
				<span className="sr-only">Open menu</span>
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
					aria-label="Site navigation"
				>
					<div className="relative flex h-full flex-col justify-center px-12 md:px-24">
						<button
							ref={closeRef}
							type="button"
							className="absolute right-8 top-8 text-on-surface-variant transition-all hover:text-on-surface"
							onClick={() => setOpen(false)}
						>
							<span className="sr-only">Close menu</span>
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
							{links.map(({ href, label }) => {
								const active = isActive(pathname, href);
								return (
									<a
										key={href}
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
							<button
								type="button"
								className="rounded-xl bg-linear-to-br from-primary-soft to-primary-container px-8 py-4 font-label font-semibold uppercase tracking-widest text-on-primary-container transition-transform hover:brightness-105 active:scale-95"
							>
								Get in Touch
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
