import { requireUser } from '$lib/server/auth/require-user';
import { db } from '$lib/server/db';
import { leagueMembers } from '$lib/server/db/schema';
import { getCurrentLeague } from '$lib/server/domain/leagues/get-current-league';
import { requireLeagueMember } from '$lib/server/permissions/league-member';
import { desc, eq } from 'drizzle-orm';

export const load = async (event) => {
	const user = await requireUser(event);
	const league = await getCurrentLeague();
	await requireLeagueMember(user.id, league.id);

	return {
		members: await db.query.leagueMembers.findMany({
			where: eq(leagueMembers.leagueId, league.id),
			orderBy: [desc(leagueMembers.currentRating)]
		})
	};
};
