import { PUBLIC_APP_NAME } from '$env/static/public';
import { getOptionalUser } from '$lib/server/auth/require-user';
import { getCurrentLeague } from '$lib/server/domain/leagues/get-current-league';
import { getLeagueMember } from '$lib/server/permissions/league-member';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const user = await getOptionalUser(event);
	const league = user ? await getCurrentLeague() : null;
	const member = user && league ? await getLeagueMember(user.id, league.id) : null;

	return {
		appName: PUBLIC_APP_NAME || 'Guris League',
		user: user ? { id: user.id, name: user.name, email: user.email } : null,
		member: member ? { id: member.id, displayName: member.displayName, isAdmin: member.isAdmin } : null
	};
};
