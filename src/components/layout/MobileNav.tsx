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
				className="hover:opacity-80 active:scale-[0.98] transition-all duration-300 ease-out text-white"
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen(true)}
			>
				<span className="sr-only">Open menu</span>
				<Menu className="size-6" strokeWidth={1.5} aria-hidden />
			</button>

			{open ? (
				<div
					className="fixed inset-0 z-60 bg-background/95 backdrop-blur-3xl"
					id={panelId}
					role="dialog"
					aria-modal="true"
					aria-label="Site navigation"
				>
					<div className="relative flex h-full flex-col justify-center px-12 md:px-24">
						<button
							ref={closeRef}
							type="button"
							className="absolute right-8 top-8 text-white/40 transition-all hover:text-white"
							onClick={() => setOpen(false)}
						>
							<span className="sr-only">Close menu</span>
							<X className="size-10" strokeWidth={1.25} aria-hidden />
						</button>

						<div className="mb-12 font-headline text-4xl font-black tracking-tighter text-white">
							digiDEVS
						</div>

						<nav className="mb-16 flex flex-col gap-8" aria-label="Primary">
							{links.map(({ href, label }) => {
								const active = isActive(pathname, href);
								return (
									<a
										key={href}
										href={href}
										className={`font-headline text-6xl transition-all hover:italic ${
											active
												? "font-bold text-white"
												: "font-light text-white/40 hover:text-white"
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
								className="bg-primary px-8 py-4 font-label text-on-primary transition-transform active:scale-95 font-bold uppercase tracking-widest"
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
