import { env } from '$env/dynamic/public';
import { clearUserSession, getWorkosLogoutUrl } from '$lib/server/auth/require-user';
import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const returnTo = env.PUBLIC_APP_URL || `${event.url.origin}/login`;
	const logoutUrl = await getWorkosLogoutUrl(event, returnTo);
	clearUserSession(event);
	redirect(302, logoutUrl);
};
