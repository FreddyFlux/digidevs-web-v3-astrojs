export type BlogPost = {
	slug: string;
	title: string;
	description: string;
	date: string;
	category: string;
	readTime: string;
	author: string;
	featured?: boolean;
	/** Simple HTML for article body (replace with Sanity portable text later) */
	bodyHtml: string;
};

export const blogPosts: BlogPost[] = [
	{
		slug: "ghost-in-the-machine",
		title: "The Ghost in the Machine: Why LLMs need Human Nuance",
		description:
			"Exploring the intersection of architectural precision and the unpredictability of human creativity in modern engineering stacks.",
		date: "2024-03-15",
		category: "Deep Dive",
		readTime: "12 min read",
		author: "Lars S.",
		featured: true,
		bodyHtml: `
<p>Large language models have reshaped how we prototype and ship software. Yet the most reliable systems still embed human judgment at critical decision points.</p>
<p>This article argues for a hybrid posture: use LLMs for speed and variation, but keep architectural boundaries, security review, and product taste in the hands of experienced engineers.</p>
<h2>What changes in practice</h2>
<p>Teams that win treat models as accelerators, not oracles. They invest in evaluation harnesses, traceability, and clear escalation paths when outputs drift from organizational standards.</p>
<p>That is the nuance the machine cannot supply on its own — and it is what keeps delivery safe as tools evolve.</p>
`,
	},
	{
		slug: "nordic-minimalism-ui-systems",
		title: "Nordic Minimalism in UI Systems",
		description:
			"How the principles of Scandinavian furniture design can be applied to scalable React components.",
		date: "2024-03-12",
		category: "Engineering",
		readTime: "8 min read",
		author: "Lars S.",
		bodyHtml: `
<p>Restraint in UI systems is not absence of style — it is a disciplined vocabulary of surfaces, spacing, and motion that scales across products.</p>
<p>We look at tokens, composition, and how to avoid one-off components that collapse under real-world variation.</p>
`,
	},
	{
		slug: "mediterranean-dev-mindset",
		title: "The Mediterranean Dev Mindset",
		description:
			"Embracing the slow-code movement for high-impact, bug-free delivery cycles in agile environments.",
		date: "2024-03-08",
		category: "Strategy",
		readTime: "6 min read",
		author: "Elena M.",
		bodyHtml: `
<p>Velocity without calm judgment creates rework. The “slow code” mindset is about front-loading clarity: better naming, smaller batches, and explicit contracts between services.</p>
`,
	},
	{
		slug: "boutique-vs-factory-scale",
		title: "Boutique vs. Factory Scale",
		description:
			"Why small, elite teams outperform traditional enterprise dev departments on complex problem solving.",
		date: "2024-02-29",
		category: "Culture",
		readTime: "10 min read",
		author: "Markus K.",
		bodyHtml: `
<p>Factory-scale process has its place. For ambiguous problem domains, boutique teams with senior ownership often ship better outcomes per dollar because communication overhead stays low.</p>
`,
	},
];

export function getPostBySlug(slug: string) {
	return blogPosts.find((p) => p.slug === slug);
}

export function getFeaturedPost() {
	return blogPosts.find((p) => p.featured) ?? blogPosts[0];
}

export function getListingPosts() {
	return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}
