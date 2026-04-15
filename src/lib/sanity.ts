import { createClient, type SanityClient } from "@sanity/client";
import {
	createImageUrlBuilder,
	type ImageUrlBuilder,
	type SanityImageSource,
} from "@sanity/image-url";

function requireEnv(name: string): string {
	const value = import.meta.env[name];
	if (!value || typeof value !== "string") {
		throw new Error(
			`${name} is not set. Add it to astro-project/.env (see .env.example). Builds need Sanity credentials.`,
		);
	}
	return value;
}

let client: SanityClient | null = null;
let imageBuilder: ImageUrlBuilder | null = null;

export function getSanityClient(): SanityClient {
	if (!client) {
		client = createClient({
			projectId: requireEnv("SANITY_PROJECT_ID"),
			dataset: import.meta.env.SANITY_DATASET ?? "production",
			apiVersion: import.meta.env.SANITY_API_VERSION ?? "2024-01-01",
			useCdn: true,
			token: import.meta.env.SANITY_API_READ_TOKEN || undefined,
		});
	}
	return client;
}

export function getImageUrlBuilder(): ImageUrlBuilder {
	if (!imageBuilder) {
		imageBuilder = createImageUrlBuilder({
			projectId: requireEnv("SANITY_PROJECT_ID"),
			dataset: import.meta.env.SANITY_DATASET ?? "production",
		});
	}
	return imageBuilder;
}

export function urlForImage(source: SanityImageSource | undefined | null): string | null {
	if (!source) return null;
	try {
		return getImageUrlBuilder().image(source).width(1600).fit("max").auto("format").url();
	} catch {
		return null;
	}
}

/** Open Graph / social share (~1200×630). Prefer over `urlForImage` for meta tags. */
export function urlForOgImage(source: SanityImageSource | undefined | null): string | null {
	if (!source) return null;
	try {
		return getImageUrlBuilder()
			.image(source)
			.width(1200)
			.height(630)
			.fit("crop")
			.auto("format")
			.url();
	} catch {
		return null;
	}
}
