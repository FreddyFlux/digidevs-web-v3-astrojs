import type { Locale } from "@/i18n/locales";
import { offerPostPath } from "@/i18n/utils";
import {
	getOfferCompanyBlock,
	getOfferTemplateStrings,
	offerUiLocale,
} from "@/i18n/offer-template";
import type { OfferViewModel } from "@/lib/offers";
import {
	mergeOfferApiSearchParams,
	sumMonthlyLineTotals,
	sumUpfrontLineTotals,
} from "@/lib/offers";

const localeForLang = (lang: string): string => {
	if (lang === "en") return "en-GB";
	if (lang === "hr") return "hr-HR";
	return "nb-NO";
};

function formatMoney(amount: number, currency: string, lang: string): string {
	try {
		return new Intl.NumberFormat(localeForLang(lang), {
			style: "currency",
			currency: currency || "NOK",
			maximumFractionDigits: 0,
		}).format(amount);
	} catch {
		return `${amount} ${currency}`;
	}
}

function formatDate(iso: string | undefined, lang: string): string | undefined {
	if (!iso) return undefined;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat(localeForLang(lang), {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(d);
}

export type OfferTemplateProps = {
	offer: OfferViewModel;
	variant: "web" | "print";
	/** Route locale (must match the URL used to open this offer). */
	pageLocale: Locale;
	/** Same query string as the live page (e.g. `?key=...`) for print/PDF links. */
	searchSuffix?: string;
	/** Renders print/download row above the offer content (normally moved to route header). */
	showActionRow?: boolean;
};

export default function OfferTemplate({
	offer,
	variant,
	pageLocale,
	searchSuffix = "",
	showActionRow = true,
}: OfferTemplateProps) {
	const isPrint = variant === "print";
	const upfrontTotal = sumUpfrontLineTotals(offer);
	const monthlyTotal = sumMonthlyLineTotals(offer);
	const issue = offer.issueDate ? formatDate(offer.issueDate, offer.language) : undefined;
	const valid = offer.validUntil ? formatDate(offer.validUntil, offer.language) : undefined;
	const accent =
		offer.accentVariant === "secondary"
			? "border-secondary/40 ring-1 ring-secondary/20"
			: "border-primary/30 ring-1 ring-primary/15";

	const uiLang = offerUiLocale(offer.language);
	const t = getOfferTemplateStrings(uiLang);
	const company = getOfferCompanyBlock(uiLang);

	const shell = isPrint
		? "offer-print-root mx-auto min-h-screen max-w-[210mm] px-6 py-10 print:max-w-none print:px-[15mm] print:py-[12mm]"
		: "mx-auto max-w-4xl px-6 pb-16 pt-8 md:px-10";

	const apiSuffix = mergeOfferApiSearchParams(searchSuffix, pageLocale);
	const pdfHref = `/api/offers/${encodeURIComponent(offer.slug)}/pdf${apiSuffix}`;
	const printHref = `${offerPostPath(pageLocale, offer.slug)}/print${searchSuffix}`;

	return (
		<div className={shell}>
			{!isPrint && showActionRow && (
				<div className="mb-8 flex flex-wrap items-center justify-end gap-3">
					<a
						href={printHref}
						className="font-label text-sm font-medium text-primary underline decoration-2 underline-offset-4 hover:text-primary-container"
					>
						{t.printView}
					</a>
					<a
						href={pdfHref}
						data-astro-reload
						className="font-label inline-flex items-center rounded-xl border border-border bg-surface-container-low px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container"
					>
						{t.downloadPdf}
					</a>
				</div>
			)}

			<header
				className={`mb-10 rounded-2xl border bg-surface-container-low/80 p-6 md:p-8 ${accent} ghost-border`}
			>
				<div className="mb-6 grid gap-6 md:grid-cols-3 md:items-start">
					<div className="md:col-span-1">
						<img
							src="/favicon.svg"
							alt="digiDEVS logo"
							className="h-28 w-28 p-1"
							loading="eager"
							decoding="async"
						/>
					</div>
					<address className="font-body not-italic text-sm leading-relaxed text-on-surface-variant md:col-span-1 md:text-center">
						<p className="font-label font-semibold text-on-surface">{company.legalName}</p>
						<p className="mt-1">{company.taxLine}</p>
						<p className="mt-1">{company.addressLine}</p>
						<p className="mt-1">
							<a href={`mailto:${company.email}`} className="text-primary hover:underline">
								{company.email}
							</a>
						</p>
						<p className="mt-1">
							<a href={`tel:${company.phoneTel}`} className="text-primary hover:underline">
								{company.phoneDisplay}
							</a>
						</p>
					</address>
					<div className="font-label text-sm text-on-surface-variant md:col-span-1 md:text-right">
						<p className="digi-wordmark text-xl font-bold tracking-tight text-on-surface">
							<span className="digi-wordmark__digi">digi</span>
							<span className="digi-wordmark__devs">DEVS</span>
						</p>
						{offer.offerNumber && (
							<p className="mt-1 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70">
								{t.offerNumberLabel}
							</p>
						)}
						{offer.offerNumber && (
							<p className="text-on-surface/80">
								<span className="text-on-surface-variant/80"># </span>
								<span className="text-on-surface">{offer.offerNumber}</span>
							</p>
						)}
						<p className="mt-1 text-xs font-semibold uppercase tracking-widest text-on-surface">
							{t.docSubtitle}
						</p>
						<p className="mt-1 capitalize text-primary">{offer.status}</p>
						{offer.hasLockedSnapshot && (
							<p className="mt-2 text-xs text-secondary">{t.lockedSnapshot}</p>
						)}
					</div>
				</div>
				<h1 className="font-headline text-3xl font-bold tracking-editorial text-on-surface md:text-4xl">
					{offer.title}
				</h1>
				{(issue || valid) && (
					<p className="font-body mt-4 text-sm text-on-surface-variant">
						{issue && (
							<>
								{t.issuedLabel}: {issue}
							</>
						)}
						{issue && valid ? " · " : ""}
						{valid && (
							<>
								{t.validUntilLabel}: {valid}
							</>
						)}
					</p>
				)}
			</header>

			<section>
				<h2 className="font-label mb-3 text-xs font-semibold uppercase tracking-widest text-secondary">
					{t.customerHeading}
				</h2>
				<div className="rounded-xl border border-border bg-surface-container p-4 text-sm">
					<p className="font-headline text-lg font-semibold text-on-surface">
						{offer.customer.companyName}
					</p>
					{offer.customer.orgNumber && (
						<p className="mt-2 text-on-surface-variant">
							{t.orgNumberPrefix} {offer.customer.orgNumber}
						</p>
					)}
					{offer.customer.address && (
						<p className="mt-2 whitespace-pre-line text-on-surface-variant">{offer.customer.address}</p>
					)}
					{offer.customer.contactName && (
						<p className="mt-2 text-secondary">
							{t.contactLabel}: {offer.customer.contactName}
						</p>
					)}
					{offer.customer.email && (
						<p className="mt-1">
							<a href={`mailto:${offer.customer.email}`} className="text-sm text-secondary hover:underline">
								{offer.customer.email}
							</a>
						</p>
					)}
				</div>
			</section>

			<section className="mt-10">
				<div>
					<h2 className="font-label mb-3 text-xs font-semibold uppercase tracking-widest text-secondary">
						{t.summaryHeading}
					</h2>
					{offer.summary && (
						<>
							<p className="font-body mb-8 text-on-surface-variant leading-relaxed">{offer.summary}</p>
						</>
					)}
					{offer.descriptionHtml ? (
						<>
							<h2 className="font-label mb-3 text-xs font-semibold uppercase tracking-widest text-secondary">
								{t.scopeHeading}
							</h2>
							<div
								className="offer-prose font-body space-y-4 leading-relaxed text-on-surface-variant [&_.offer-desc-figure]:my-6 [&_.offer-desc-figure]:mx-auto [&_.offer-desc-figure]:w-[60%] [&_.offer-desc-figure]:overflow-hidden [&_.offer-desc-figure]:rounded-xl [&_.offer-desc-figure]:border [&_.offer-desc-figure]:border-border [&_.offer-desc-figure]:bg-surface-container-low [&_.offer-desc-figure]:break-inside-auto [&_.offer-desc-figure]:[page-break-inside:auto] [&_.offer-desc-figure__img]:block [&_.offer-desc-figure__img]:h-auto [&_.offer-desc-figure__img]:w-full [&_.offer-desc-figure__img]:max-w-full [&_.offer-desc-figure__img]:object-contain [&_.offer-desc-figure__caption]:px-3 [&_.offer-desc-figure__caption]:py-2 [&_.offer-desc-figure__caption]:text-center [&_.offer-desc-figure__caption]:text-xs [&_.offer-desc-figure__caption]:text-on-surface-variant [&_a]:text-primary [&_h2]:font-headline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-on-surface [&_h3]:font-headline [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-on-surface [&_li]:ml-4 [&_ol]:list-decimal [&_ul]:list-disc"
								dangerouslySetInnerHTML={{ __html: offer.descriptionHtml }}
							/>
						</>
					) : null}
				</div>
			</section>

			{offer.media.length > 0 && (
				<section className="mt-12 break-inside-avoid">
					<h2 className="font-label mb-4 text-xs font-semibold uppercase tracking-widest text-secondary">
						{t.referenceHeading}
					</h2>
					<div className="grid gap-6 sm:grid-cols-2">
						{offer.media.map((m, i) => (
							<figure
								key={`${m.url}-${i}`}
								className="overflow-hidden rounded-xl border border-border bg-surface-container-low"
							>
								<img src={m.url} alt={m.alt} className="aspect-video w-full object-cover" loading={isPrint ? "eager" : "lazy"} />
								{m.caption && (
									<figcaption className="px-3 py-2 text-center text-xs text-on-surface-variant">
										{m.caption}
									</figcaption>
								)}
							</figure>
						))}
					</div>
				</section>
			)}

			{offer.sections.length > 0 && (
				<section className="mt-12 space-y-8">
					{offer.sections.map((s, i) => (
						<div key={`${s.title}-${i}`} className="break-inside-avoid">
							<h2 className="font-headline mb-3 text-xl font-bold tracking-editorial text-on-surface">{s.title}</h2>
							<div
								className="offer-prose font-body space-y-3 text-on-surface-variant [&_a]:text-primary [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4"
								dangerouslySetInnerHTML={{ __html: s.bodyHtml }}
							/>
						</div>
					))}
				</section>
			)}

			<section className="mt-12 break-inside-avoid">
				<h2 className="font-label mb-4 text-xs font-semibold uppercase tracking-widest text-secondary">
					{t.pricingHeading}
				</h2>
				{offer.lineItems.length === 0 ? (
					<p className="text-sm text-on-surface-variant">{t.noLineItems}</p>
				) : (
					<div className="overflow-x-auto rounded-xl border border-border">
						<table className="w-full min-w-[20rem] border-collapse text-left text-sm">
							<thead>
								<tr className="border-b border-outline-variant/30 bg-surface-container-low">
									<th className="px-4 py-3 font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
										{t.tableDescription}
									</th>
									<th className="px-4 py-3 font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
										{t.tableQty}
									</th>
									<th className="px-4 py-3 font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
										{t.tableUnit}
									</th>
									<th className="px-4 py-3 font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
										{t.tableMonthly}
									</th>
									<th className="px-4 py-3 text-right font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
										{t.tableLine}
									</th>
								</tr>
							</thead>
							<tbody>
								{offer.lineItems.map((row, idx) => (
									<tr key={row._key ?? idx} className="border-b border-border last:border-0">
										<td className="px-4 py-3 text-on-surface">
											{row.description}
											{row.notes && (
												<p className="mt-1 text-xs text-on-surface-variant">{row.notes}</p>
											)}
										</td>
										<td className="px-4 py-3 text-on-surface-variant">{row.quantity}</td>
										<td className="px-4 py-3 text-on-surface-variant">
											{row.discountAmount > 0 ? (
												<div className="space-y-1">
													<p className="line-through decoration-1">
														{formatMoney(row.unitPrice, offer.currency, offer.language)}
													</p>
													<p className="text-on-surface">
														{t.discountedUnit}:{" "}
														{formatMoney(row.discountedUnitPrice, offer.currency, offer.language)}
													</p>
												</div>
											) : (
												formatMoney(row.unitPrice, offer.currency, offer.language)
											)}
										</td>
										<td className="px-4 py-3 text-on-surface-variant">
											{row.monthlyPrice > 0 ? (
												row.monthlyDiscountAmount > 0 ? (
													<div className="space-y-1">
														<p className="line-through decoration-1">
															{formatMoney(row.monthlyPrice, offer.currency, offer.language)}
														</p>
														<p className="text-on-surface">
															{t.discountedMonthly}:{" "}
															{formatMoney(
																row.discountedMonthlyPrice,
																offer.currency,
																offer.language,
															)}
														</p>
													</div>
												) : (
													formatMoney(row.monthlyPrice, offer.currency, offer.language)
												)
											) : (
												"—"
											)}
										</td>
										<td className="px-4 py-3 text-right font-medium text-on-surface">
											{formatMoney(row.upfrontLineTotal, offer.currency, offer.language)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<div className="mt-6 ml-auto max-w-sm space-y-2 rounded-xl border border-border bg-surface-container p-4 text-sm">
					<div className="flex justify-between border-t border-border pt-2 font-headline text-base font-bold text-on-surface">
						<span>{t.totalUpfront}</span>
						<span className="text-primary">
							{formatMoney(upfrontTotal, offer.currency, offer.language)}
						</span>
					</div>
					<div className="flex justify-between font-headline text-base font-bold text-on-surface">
						<span>{t.totalPerMonth}</span>
						<span className="text-primary">
							{formatMoney(monthlyTotal, offer.currency, offer.language)}
						</span>
					</div>
				</div>
			</section>

			{offer.termsHtml ? (
				<section className="mt-12 break-inside-avoid border-t border-border pt-10">
					<h2 className="font-headline mb-4 text-lg font-bold text-on-surface">
						{offer.termsHeading ?? t.termsDefault}
					</h2>
					<div
						className="offer-prose font-body text-sm leading-relaxed text-on-surface-variant [&_li]:ml-4 [&_ol]:list-decimal [&_ul]:list-disc"
						dangerouslySetInnerHTML={{ __html: offer.termsHtml }}
					/>
				</section>
			) : null}

			<footer className="mt-16 border-t border-border pt-8 text-center text-xs text-on-surface-variant print:mt-8">
				<p className="font-label">{t.footerTagline}</p>
				<p className="mt-1">{t.footerUrl}</p>
			</footer>
		</div>
	);
}
