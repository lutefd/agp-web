import { setUserSession, setWorkosSession, upsertLocalUser } from '$lib/server/auth/require-user';
import { getCurrentLeague } from '$lib/server/domain/leagues/get-current-league';
import { ensureLeagueMembership } from '$lib/server/domain/leagues/invitations';
import { getWorkos } from '$lib/server/auth/workos';
import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const code = event.url.searchParams.get('code');
	if (!code) error(400, 'Código de autenticação ausente.');

	if (!env.WORKOS_CLIENT_ID) throw new Error('WORKOS_CLIENT_ID is required');
	if (!env.WORKOS_COOKIE_PASSWORD) throw new Error('WORKOS_COOKIE_PASSWORD is required');
	const result = await getWorkos().userManagement.authenticateWithCode({
		clientId: env.WORKOS_CLIENT_ID,
		code,
		session: {
			sealSession: true,
			cookiePassword: env.WORKOS_COOKIE_PASSWORD
		}
	});
	const profile = result.user;
	const user = await upsertLocalUser({
		workosUserId: profile.id,
		email: profile.email,
		name: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.email,
		avatarUrl: profile.profilePictureUrl ?? null
	});
	const league = await getCurrentLeague();
	await ensureLeagueMembership(user, league);

	if (!result.sealedSession) throw new Error('WorkOS did not return a sealed session');
	setWorkosSession(event, result.sealedSession);
	setUserSession(event, user.id);
	redirect(302, '/leaderboard');
};
