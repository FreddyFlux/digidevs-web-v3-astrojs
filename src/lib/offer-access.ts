import { parseOfferGateCookie } from "./offer-gate-cookie";
import { getOfferGateSecret } from "./offer-gate-env";
import { isOfferGateKeyBypass } from "./offer-gate-helpers";
import { verifyOfferGateToken } from "./offer-session";

export { getOfferAccessSecret, getOfferGateSecret } from "./offer-gate-env";
export { hasOfferGateSessionCookie, isOfferGateKeyBypass } from "./offer-gate-helpers";

export function isOfferAccessAllowed(request: Request): boolean {
	if (!getOfferGateSecret()) return true;
	if (isOfferGateKeyBypass(request)) return true;
	return verifyOfferGateToken(parseOfferGateCookie(request.headers.get("cookie")));
}
