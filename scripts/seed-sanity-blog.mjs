/**
 * One-time import of the original four blog posts into Sanity.
 * Requires: SANITY_PROJECT_ID, SANITY_DATASET (optional), SANITY_API_WRITE_TOKEN with Editor rights.
 *
 * Run from astro-project: pnpm run seed:sanity
 */
import { createClient } from "@sanity/client";
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
	console.error("Set SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in the environment (use .env with pnpm run seed:sanity).");
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	apiVersion: "2024-01-01",
	token,
	useCdn: false,
});

function block(style, text, key) {
	return {
		_type: "block",
		_key: key,
		style,
		markDefs: [],
		children: [
			{
				_type: "span",
				_key: `${key}-s`,
				text,
				marks: [],
			},
		],
	};
}

function p(text, key) {
	return block("normal", text, key);
}

function h2(text, key) {
	return block("h2", text, key);
}

const COVERS = {
	"ghost-in-the-machine":
		"https://lh3.googleusercontent.com/aida-public/AB6AXuA0SIX5U2d9tQW66dGxIr9fOBc9zdhL7iUm_15AWblKMfE7lRgoXT1JjLJLHBVOQnPTzPFne1Jf8BhH6HneiXvYmJUoVtP6z_A2oRW8Bhrd0x18Cc3q1uf2ODcnQAMw_9dstmC7uvLgeFP1tZCLEvTAVFuyDpoURhQNzIaCgK7S8ui6SxFbMvfkVzh0fP2u0T6f7QMyiIDkeu79YjjfMgKnThmi5NRMg10m_BVW28uENRDeGWRZWrPLpmoPbPPLuClwchGQK_mOBE",
	"nordic-minimalism-ui-systems":
		"https://lh3.googleusercontent.com/aida-public/AB6AXuBGr0KhRos5y68IQIIW-a14nhkxbXfZn8j7wrbQ0t-vVqXTbuu47ucVRKBSJ12M5tdOQYwQ9JEtGi-XJpVpTUxHx-yaobgaj3xd8vIADEEi93W0Qc_XL9ne3326qCdwUP6DMisihsIiYigfTe09gG7pwA9Qhv4SeKXdp-QfeCoE3eeDS1LqyveNf6tQs7eMznKMKQAC7RTvpIuoV6gFKf9zWJ-AYzBtEgCtcI7Y2y9KQ3X6uAmQ9MbKE-mnLinTfDhrftUhqpXW79c",
	"mediterranean-dev-mindset":
		"https://lh3.googleusercontent.com/aida-public/AB6AXuCLNjQSHERRdcr7mCx0VaLAMWPLYeSkfaCn4AGRe0FxNIKaR5sHK6if4Zc_wdzTVhlTgtSpK6dCJWjrL5g_k4TyeZBSbD0fY5NnG-DoXCmM3QSMgjmqIQCAujvYLOiYhz232dzxswuRj6LAtQqnrWZIjkiDi9qLHZOxad-HhMm9rxCreb66wX9SZWr5sUu9kS7YG_h7dOXQ4Ci1LjqOGyAZ4WgLScmqsTzML8K9ErnPIBsVN8retuzhMJYVDPltoUXbFphwBXgvKpk",
	"boutique-vs-factory-scale":
		"https://lh3.googleusercontent.com/aida-public/AB6AXuAtx5FVkAj1RQkpb-Thu4OjeYFjfEmSF86uysju4yV8TD7AqwqeFQUAgFEc9D0yBh4O1puBWITOzLvdnNxUrcpTnqspzAPSd6urV5hx-QB3qDHKBqssya6p-aSyqco6feW2eTQdtyZsI613j2OBgmWnVtKxyh3tHsprEgmhXJ4GyZjVUS3wWxWlwjdwRcpQwMopUUxHpjy8T_32LSn9bQmyH9Y-UG5FB4sbz4_YyqMtp7l9QgCliArVsdP9UEw-l4veVvy_tZxlXs",
};

const posts = [
	{
		_id: "post-ghost-in-the-machine",
		title: "The Ghost in the Machine: Why LLMs need Human Nuance",
		slug: "ghost-in-the-machine",
		excerpt:
			"Exploring the intersection of architectural precision and the unpredictability of human creativity in modern engineering stacks.",
		publishedAt: "2024-03-15T12:00:00.000Z",
		author: "Lars S.",
		categories: ["AI"],
		readTime: "12 min read",
		featured: true,
		coverAlt: "Abstract editorial image for the featured article on LLMs and human nuance",
		body: [
			p(
				"Large language models have reshaped how we prototype and ship software. Yet the most reliable systems still embed human judgment at critical decision points.",
				"a1",
			),
			p(
				"This article argues for a hybrid posture: use LLMs for speed and variation, but keep architectural boundaries, security review, and product taste in the hands of experienced engineers.",
				"a2",
			),
			h2("What changes in practice", "a3"),
			p(
				"Teams that win treat models as accelerators, not oracles. They invest in evaluation harnesses, traceability, and clear escalation paths when outputs drift from organizational standards.",
				"a4",
			),
			p(
				"That is the nuance the machine cannot supply on its own — and it is what keeps delivery safe as tools evolve.",
				"a5",
			),
		],
	},
	{
		_id: "post-nordic-minimalism-ui-systems",
		title: "Nordic Minimalism in UI Systems",
		slug: "nordic-minimalism-ui-systems",
		excerpt:
			"How the principles of Scandinavian furniture design can be applied to scalable React components.",
		publishedAt: "2024-03-12T12:00:00.000Z",
		author: "Lars S.",
		categories: ["Frontend"],
		readTime: "8 min read",
		featured: false,
		coverAlt: "Minimal UI composition and surfaces",
		body: [
			p(
				"Restraint in UI systems is not absence of style — it is a disciplined vocabulary of surfaces, spacing, and motion that scales across products.",
				"b1",
			),
			p(
				"We look at tokens, composition, and how to avoid one-off components that collapse under real-world variation.",
				"b2",
			),
		],
	},
	{
		_id: "post-mediterranean-dev-mindset",
		title: "The Mediterranean Dev Mindset",
		slug: "mediterranean-dev-mindset",
		excerpt:
			"Embracing the slow-code movement for high-impact, bug-free delivery cycles in agile environments.",
		publishedAt: "2024-03-08T12:00:00.000Z",
		author: "Elena M.",
		categories: ["Business"],
		readTime: "6 min read",
		featured: false,
		coverAlt: "Calm engineering workflow metaphor",
		body: [
			p(
				"Velocity without calm judgment creates rework. The “slow code” mindset is about front-loading clarity: better naming, smaller batches, and explicit contracts between services.",
				"c1",
			),
		],
	},
	{
		_id: "post-boutique-vs-factory-scale",
		title: "Boutique vs. Factory Scale",
		slug: "boutique-vs-factory-scale",
		excerpt:
			"Why small, elite teams outperform traditional enterprise dev departments on complex problem solving.",
		publishedAt: "2024-02-29T12:00:00.000Z",
		author: "Markus K.",
		categories: ["Work"],
		readTime: "10 min read",
		featured: false,
		coverAlt: "Team scale and delivery",
		body: [
			p(
				"Factory-scale process has its place. For ambiguous problem domains, boutique teams with senior ownership often ship better outcomes per dollar because communication overhead stays low.",
				"d1",
			),
		],
	},
];

async function uploadCover(slug, alt) {
	const url = COVERS[slug];
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch image for ${slug}: ${res.status}`);
	const buf = Buffer.from(await res.arrayBuffer());
	const asset = await client.assets.upload("image", buf, {
		filename: `${slug}-cover.jpg`,
	});
	return {
		_type: "image",
		asset: {
			_type: "reference",
			_ref: asset._id,
		},
		alt,
	};
}

async function main() {
	for (const post of posts) {
		const coverImage = await uploadCover(post.slug, post.coverAlt);
		const doc = {
			_type: "post",
			_id: post._id,
			language: "no",
			title: post.title,
			slug: { _type: "slug", current: post.slug },
			excerpt: post.excerpt,
			publishedAt: post.publishedAt,
			author: post.author,
			categories: post.categories,
			readTime: post.readTime,
			featured: post.featured,
			coverImage,
			body: post.body,
		};
		await client.createOrReplace(doc);
		console.log("Upserted:", post.slug);
	}
	console.log("Done. Open Sanity Studio and publish if drafts appear.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
