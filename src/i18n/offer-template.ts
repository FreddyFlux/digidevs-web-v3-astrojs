import type { Locale } from "./locales";
import { DEFAULT_LOCALE } from "./locales";

/** Normalize Sanity offer language to UI locale. */
export function offerUiLocale(lang: string): Locale {
	if (lang === "en" || lang === "hr") return lang;
	return DEFAULT_LOCALE;
}

export type OfferCompanyBlock = {
	legalName: string;
	taxLine: string;
	addressLine: string;
	email: string;
	phoneDisplay: string;
	phoneTel: string;
};

const COMPANY = {
	legalName: "DIGITAL DEVELOPERS d.o.o",
	addressLine: "Ljubićeva 9, 21000 Split",
	email: "fredrik@digidevs.no",
	phoneDisplay: "+47 45 39 96 39",
	phoneTel: "+4745399639",
	oib: "HR64590094165",
} as const;

/** Legal entity block on every offer (labels localized). */
export function getOfferCompanyBlock(locale: Locale): OfferCompanyBlock {
	const taxLine =
		locale === "en"
			? `Tax ID (OIB): ${COMPANY.oib}`
			: locale === "hr"
				? `OIB: ${COMPANY.oib}`
				: `Organisasjonsnr./OIB: ${COMPANY.oib}`;
	return {
		legalName: COMPANY.legalName,
		taxLine,
		addressLine: COMPANY.addressLine,
		email: COMPANY.email,
		phoneDisplay: COMPANY.phoneDisplay,
		phoneTel: COMPANY.phoneTel,
	};
}

export type OfferTemplateStrings = {
	docSubtitle: string;
	issuedLabel: string;
	validUntilLabel: string;
	customerHeading: string;
	orgNumberPrefix: string;
	summaryHeading: string;
	scopeHeading: string;
	referenceHeading: string;
	pricingHeading: string;
	noLineItems: string;
	tableDescription: string;
	tableQty: string;
	tableUnit: string;
	tableLine: string;
	subtotal: string;
	computedLines: string;
	discount: string;
	tax: string;
	total: string;
	termsDefault: string;
	lockedSnapshot: string;
	printView: string;
	downloadPdf: string;
	/** Internal: open modal to set password for `/offer/p/...` */
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
	customerViewerTitle: string;
	customerViewerPasswordLabel: string;
	customerViewerSubmit: string;
	customerViewerWrongPassword: string;
	footerTagline: string;
	footerUrl: string;
};

export function getOfferTemplateStrings(locale: Locale): OfferTemplateStrings {
	if (locale === "en") {
		return {
			docSubtitle: "Commercial offer",
			issuedLabel: "Issued",
			validUntilLabel: "Valid until",
			customerHeading: "Customer",
			orgNumberPrefix: "Reg. no.",
			summaryHeading: "Summary",
			scopeHeading: "Scope",
			referenceHeading: "References",
			pricingHeading: "Pricing",
			noLineItems: "No line items.",
			tableDescription: "Item",
			tableQty: "Qty",
			tableUnit: "Unit",
			tableLine: "Line",
			subtotal: "Subtotal",
			computedLines: "Computed lines",
			discount: "Discount",
			tax: "Tax",
			total: "Total",
			termsDefault: "Terms & conditions",
			lockedSnapshot: "Locked snapshot (export)",
			printView: "Print view",
			downloadPdf: "Download PDF",
			createCustomerPage: "Customer page",
			customerShareModalTitle: "Password for customer page",
			customerSharePassword: "Password",
			customerSharePasswordConfirm: "Confirm password",
			customerShareSubmit: "Save and enable link",
			customerShareBusy: "Saving…",
			customerShareCopyLink: "Copy link",
			customerShareCopied: "Copied",
			customerShareClose: "Close",
			customerShareSuccessHint: "Share this URL with your customer. They will use the password you set.",
			customerShareError: "Something went wrong. Try again.",
			customerViewerTitle: "View offer",
			customerViewerPasswordLabel: "Password",
			customerViewerSubmit: "Continue",
			customerViewerWrongPassword: "Incorrect password. Try again.",
			footerTagline: "digiDEVS · Senior-level development · EU nearshore",
			footerUrl: "digidevs.no",
		};
	}
	if (locale === "hr") {
		return {
			docSubtitle: "Komercijalna ponuda",
			issuedLabel: "Datum",
			validUntilLabel: "Vrijedi do",
			customerHeading: "Kupac",
			orgNumberPrefix: "Reg. br.",
			summaryHeading: "Sažetak",
			scopeHeading: "Opseg",
			referenceHeading: "Reference",
			pricingHeading: "Cijene",
			noLineItems: "Nema stavki.",
			tableDescription: "Stavka",
			tableQty: "Kol.",
			tableUnit: "Jed.",
			tableLine: "Ukupno",
			subtotal: "Međuzbroj",
			computedLines: "Linije",
			discount: "Popust",
			tax: "Porez",
			total: "Ukupno",
			termsDefault: "Uvjeti",
			lockedSnapshot: "Zaključan izvoz (snapshot)",
			printView: "Ispis",
			downloadPdf: "Preuzmi PDF",
			createCustomerPage: "Stranica za kupca",
			customerShareModalTitle: "Lozinka za stranicu ponude",
			customerSharePassword: "Lozinka",
			customerSharePasswordConfirm: "Potvrdi lozinku",
			customerShareSubmit: "Spremi i uključi poveznicu",
			customerShareBusy: "Spremanje…",
			customerShareCopyLink: "Kopiraj poveznicu",
			customerShareCopied: "Kopirano",
			customerShareClose: "Zatvori",
			customerShareSuccessHint: "Podijelite URL s kupcem. Koristit će lozinku koju ste postavili.",
			customerShareError: "Nešto je pošlo po krivu. Pokušajte ponovo.",
			customerViewerTitle: "Pregled ponude",
			customerViewerPasswordLabel: "Lozinka",
			customerViewerSubmit: "Nastavi",
			customerViewerWrongPassword: "Netočna lozinka. Pokušajte ponovo.",
			footerTagline: "digiDEVS · Razvoj seniorske razine · EU nearshore",
			footerUrl: "digidevs.no",
		};
	}
	return {
		docSubtitle: "Tilbud / tilbudsgrunnlag",
		issuedLabel: "Utstedt",
		validUntilLabel: "Gyldig til",
		customerHeading: "Kunde",
		orgNumberPrefix: "Org.nr.",
		summaryHeading: "Sammendrag",
		scopeHeading: "Omfang",
		referenceHeading: "Referanser / skjermbilder",
		pricingHeading: "Priser",
		noLineItems: "Ingen linjeposter.",
		tableDescription: "Beskrivelse",
		tableQty: "Ant.",
		tableUnit: "Enhet",
		tableLine: "Beløp",
		subtotal: "Sum linjer",
		computedLines: "Beregnet",
		discount: "Rabatt",
		tax: "Mva",
		total: "Totalt",
		termsDefault: "Vilkår",
		lockedSnapshot: "Låst snapshot (eksport)",
		printView: "Utskriftsvisning",
		downloadPdf: "Last ned PDF",
		createCustomerPage: "Kundeside",
		customerShareModalTitle: "Passord for kundeside",
		customerSharePassword: "Passord",
		customerSharePasswordConfirm: "Bekreft passord",
		customerShareSubmit: "Lagre og aktiver lenke",
		customerShareBusy: "Lagrer…",
		customerShareCopyLink: "Kopier lenke",
		customerShareCopied: "Kopiert",
		customerShareClose: "Lukk",
		customerShareSuccessHint: "Del denne URL-en med kunden. De bruker passordet du setter.",
		customerShareError: "Noe gikk galt. Prøv igjen.",
		customerViewerTitle: "Se tilbud",
		customerViewerPasswordLabel: "Passord",
		customerViewerSubmit: "Fortsett",
		customerViewerWrongPassword: "Feil passord. Prøv igjen.",
		footerTagline: "digiDEVS · Utvikling på seniornivå · EU nearshore",
		footerUrl: "digidevs.no",
	};
}
