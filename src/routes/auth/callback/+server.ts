import { setUserSession, upsertLocalUser } from '$lib/server/auth/require-user';
import { getWorkos } from '$lib/server/auth/workos';
import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const code = event.url.searchParams.get('code');
	if (!code) error(400, 'Código de autenticação ausente.');

	if (!env.WORKOS_CLIENT_ID) throw new Error('WORKOS_CLIENT_ID is required');
	const result = await getWorkos().userManagement.authenticateWithCode({ clientId: env.WORKOS_CLIENT_ID, code });
	const profile = result.user;
	const user = await upsertLocalUser({
		workosUserId: profile.id,
		email: profile.email,
		name: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.email,
		avatarUrl: profile.profilePictureUrl ?? null
	});

	setUserSession(event, user.id);
	redirect(302, '/leaderboard');
};
