import { useCallback, useEffect, useId, useState } from "react";
import type { Locale } from "@/i18n/locales";

export type OfferShareSetupLabels = {
	createCustomerPage: string;
	customerShareModalTitle: string;
	customerSharePassword: string;
	customerSharePasswordConfirm: string;
	customerShareSubmit: string;
	customerShareBusy: string;
	customerShareCopyLink: string;
	customerShareCopied: string;
	customerShareClose: string;
	customerShareSuccessHint: string;
	customerShareError: string;
};

type Props = {
	slug: string;
	pageLocale: Locale;
	labels: OfferShareSetupLabels;
};

function shareApiQuery(pageLocale: Locale): string {
	return pageLocale === "no" ? "" : `?lang=${pageLocale}`;
}

export default function OfferShareSetup({ slug, pageLocale, labels }: Props) {
	const dialogTitleId = useId();
	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successPath, setSuccessPath] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const close = useCallback(() => {
		setOpen(false);
		setPassword("");
		setPasswordConfirm("");
		setError(null);
		setBusy(false);
		setSuccessPath(null);
		setCopied(false);
	}, []);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !busy) close();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, busy, close]);

	const fullShareUrl =
		typeof window !== "undefined" && successPath ? `${window.location.origin}${successPath}` : "";

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const res = await fetch(`/api/offers/${encodeURIComponent(slug)}/share${shareApiQuery(pageLocale)}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin",
				body: JSON.stringify({ password, passwordConfirm }),
			});
			const data = (await res.json().catch(() => null)) as { error?: string; url?: string } | null;
			if (!res.ok) {
				setError(data?.error ?? labels.customerShareError);
				return;
			}
			if (!data?.url) {
				setError(labels.customerShareError);
				return;
			}
			setSuccessPath(data.url);
		} catch {
			setError(labels.customerShareError);
		} finally {
			setBusy(false);
		}
	};

	const copyLink = async () => {
		if (!fullShareUrl) return;
		try {
			await navigator.clipboard.writeText(fullShareUrl);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setError(labels.customerShareError);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="font-label inline-flex items-center rounded-xl border border-border bg-surface-container-low px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container"
			>
				{labels.createCustomerPage}
			</button>
			{open ? (
				<div
					className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4"
					role="presentation"
					onClick={(e) => {
						if (e.target === e.currentTarget && !busy) close();
					}}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby={dialogTitleId}
						className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface-container-low p-6 shadow-xl"
					>
						<h2 id={dialogTitleId} className="font-label text-lg font-semibold text-on-surface">
							{labels.customerShareModalTitle}
						</h2>

						{successPath ? (
							<div className="mt-6 space-y-4">
								<p className="text-sm text-on-surface-variant">{labels.customerShareSuccessHint}</p>
								<div className="flex gap-2">
									<input
										readOnly
										value={fullShareUrl}
										className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-on-surface"
									/>
								<button
									type="button"
									onClick={() => void copyLink()}
									className="font-label shrink-0 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90"
								>
									{copied ? labels.customerShareCopied : labels.customerShareCopyLink}
								</button>
							</div>
							{error ? <p className="text-sm text-error">{error}</p> : null}
							<button
									type="button"
									onClick={close}
									className="font-label w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container"
								>
									{labels.customerShareClose}
								</button>
							</div>
						) : (
							<form className="mt-6 space-y-4" onSubmit={(e) => void submit(e)}>
								<div>
									<label
										className="font-label block text-xs font-medium uppercase tracking-widest text-on-surface-variant"
										htmlFor={`${dialogTitleId}-pw`}
									>
										{labels.customerSharePassword}
									</label>
									<input
										id={`${dialogTitleId}-pw`}
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										autoComplete="new-password"
										required
										className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
									/>
								</div>
								<div>
									<label
										className="font-label block text-xs font-medium uppercase tracking-widest text-on-surface-variant"
										htmlFor={`${dialogTitleId}-pw2`}
									>
										{labels.customerSharePasswordConfirm}
									</label>
									<input
										id={`${dialogTitleId}-pw2`}
										type="password"
										value={passwordConfirm}
										onChange={(e) => setPasswordConfirm(e.target.value)}
										autoComplete="new-password"
										required
										className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
									/>
								</div>
								{error && <p className="text-sm text-error">{error}</p>}
								<div className="flex flex-wrap gap-3 pt-2">
									<button
										type="submit"
										disabled={busy}
										className="font-label rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-60"
									>
										{busy ? labels.customerShareBusy : labels.customerShareSubmit}
									</button>
									<button
										type="button"
										disabled={busy}
										onClick={close}
										className="font-label rounded-xl border border-border px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container disabled:opacity-60"
									>
										{labels.customerShareClose}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			) : null}
		</>
	);
}
