import type { APIRoute } from "astro";
import { checkContactRateLimit, getClientIp } from "../../lib/contact-rate-limit";

export const prerender = false;

function jsonResponse(data: unknown, status: number) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

function escapeHtml(s: string) {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

async function parseBody(request: Request): Promise<{
	name: string;
	email: string;
	company: string;
	message: string;
	contact_hp: string;
} | null> {
	const ct = request.headers.get("content-type") ?? "";
	try {
		if (ct.includes("application/json")) {
			const raw = (await request.json()) as Record<string, unknown>;
			return {
				name: typeof raw.name === "string" ? raw.name : "",
				email: typeof raw.email === "string" ? raw.email : "",
				company: typeof raw.company === "string" ? raw.company : "",
				message: typeof raw.message === "string" ? raw.message : "",
				contact_hp:
					typeof raw.contact_hp === "string" ? raw.contact_hp : "",
			};
		}
		if (
			ct.includes("application/x-www-form-urlencoded") ||
			ct.includes("multipart/form-data")
		) {
			const fd = await request.formData();
			return {
				name: String(fd.get("name") ?? ""),
				email: String(fd.get("email") ?? ""),
				company: String(fd.get("company") ?? ""),
				message: String(fd.get("message") ?? ""),
				contact_hp: String(fd.get("contact_hp") ?? ""),
			};
		}
	} catch {
		return null;
	}
	return null;
}

function getMethodNotAllowedPageHtml(acceptLang: string | null) {
	const prefersNorwegian =
		acceptLang && /^(no|nb|nn)(?:$|,)/i.test(acceptLang.split(",")[0]?.trim() ?? "");
	const title = prefersNorwegian ? "Bruk kontaktsiden" : "Use the contact page";
	const body = prefersNorwegian
		? "Denne adressen er bare for innsendte skjemaer. Gå tilbake til kontaktsiden for å sende en melding."
		: "This URL only accepts form submissions. Go back to the contact page to send a message.";
	return `<!DOCTYPE html>
<html lang="${prefersNorwegian ? "no" : "en"}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${title} — digiDEVS</title>
  <style>
    :root { --bg: #0f1419; --fg: #e8eaed; --accent: #0d9488; --muted: #9ca3af; }
    body { margin:0; min-height:100vh; font-family: system-ui, sans-serif; background: var(--bg); color: var(--fg);
      display:flex; align-items:center; justify-content:center; padding: 24px; box-sizing: border-box; }
    .card { max-width: 32rem; padding: 2rem; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; background: rgba(255,255,255,.03); }
    p { line-height: 1.6; color: var(--muted); margin: 0 0 1.5rem; }
    h1 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.75rem; }
    a { color: var(--accent); font-weight: 600; text-decoration: none; }
    a:hover { text-decoration: underline; }
    nav { display: flex; flex-wrap: wrap; gap: 1rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${body}</p>
    <nav>
      <a href="javascript:history.back()">${prefersNorwegian ? "Tilbake" : "Go back"}</a>
      <a href="/contact">${prefersNorwegian ? "Kontakt (norsk)" : "Contact (Norwegian)"}</a>
      <a href="/en/contact">English</a>
    </nav>
  </div>
</body>
</html>`;
}

/** Browsers (or bad prefetch) may GET this URL — return HTML, not raw JSON. */
export const GET: APIRoute = ({ request }) => {
	const accept = request.headers.get("Accept") ?? "";
	if (accept.includes("text/html")) {
		const acceptLang = request.headers.get("Accept-Language");
		return new Response(getMethodNotAllowedPageHtml(acceptLang), {
			status: 405,
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}
	return jsonResponse({ error: "Method Not Allowed" }, 405);
};

export const POST: APIRoute = async ({ request }) => {
	try {
		const parsed = await parseBody(request);
		if (!parsed) {
			return jsonResponse({ error: "Invalid request body" }, 400);
		}

		const name = parsed.name.trim();
		const email = parsed.email.trim();
		const company = parsed.company.trim();
		const message = parsed.message.trim();
		const contactHp = parsed.contact_hp.trim();

		// Honeypot: pretend success so simple bots cannot probe the field
		if (contactHp) {
			return jsonResponse({ success: true }, 200);
		}

		const ip = getClientIp(request);
		const limit = checkContactRateLimit(ip);
		if (!limit.ok) {
			return new Response(JSON.stringify({ error: "rate_limited" }), {
				status: 429,
				headers: {
					"Content-Type": "application/json",
					"Retry-After": String(limit.retryAfterSec),
				},
			});
		}

		if (!email || !message) {
			return jsonResponse(
				{ error: "email and message are required" },
				400,
			);
		}

		const apiKey = import.meta.env.BREVO_API_KEY;
		const senderEmail = import.meta.env.BREVO_SENDER_EMAIL;
		const senderName = import.meta.env.BREVO_SENDER_NAME ?? "digiDEVS";
		const recipientEmail = import.meta.env.BREVO_RECIPIENT_EMAIL;

		if (!apiKey || !senderEmail || !recipientEmail) {
			console.error(
				"[contact] Missing Brevo env: BREVO_API_KEY, BREVO_SENDER_EMAIL, or BREVO_RECIPIENT_EMAIL",
			);
			return jsonResponse({ error: "Server configuration error" }, 500);
		}

		const replyName = name || email;
		const textContent = [
			"New contact form submission — digiDEVS",
			"",
			`Name: ${name || "—"}`,
			`Email: ${email}`,
			`Company: ${company || "—"}`,
			"",
			"Message:",
			message,
		].join("\n");

		const htmlContent = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a;background:#f8f9fa;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <tr>
      <td style="padding:20px 24px;background:#0d9488;color:#fff;font-weight:600;font-size:16px;">New contact — digiDEVS</td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <table role="presentation" cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr><td style="border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Name</td></tr>
          <tr><td style="padding-bottom:16px;">${escapeHtml(name || "—")}</td></tr>
          <tr><td style="border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Email</td></tr>
          <tr><td style="padding-bottom:16px;"><a href="mailto:${escapeHtml(email)}" style="color:#0d9488;">${escapeHtml(email)}</a></td></tr>
          <tr><td style="border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Company</td></tr>
          <tr><td style="padding-bottom:16px;">${escapeHtml(company || "—")}</td></tr>
          <tr><td style="border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Message</td></tr>
          <tr><td style="white-space:pre-wrap;">${escapeHtml(message)}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

		const payload = {
			sender: { name: senderName, email: senderEmail },
			to: [{ email: recipientEmail, name: "DigiDevs" }],
			replyTo: { email, name: replyName },
			subject: "New contact form submission — digiDEVS",
			htmlContent,
			textContent,
		};

		const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				"api-key": apiKey,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!brevoRes.ok) {
			const errText = await brevoRes.text();
			console.error("[contact] Brevo error:", brevoRes.status, errText);
			return jsonResponse(
				{ error: "Failed to send message. Please try again later." },
				502,
			);
		}

		return jsonResponse({ success: true }, 200);
	} catch (err) {
		console.error("[contact]", err);
		return jsonResponse({ error: "Internal server error" }, 500);
	}
};
