import { requireUser } from '$lib/server/auth/require-user';
import { db } from '$lib/server/db';
import { leagueMembers, matches } from '$lib/server/db/schema';
import { getCurrentLeague } from '$lib/server/domain/leagues/get-current-league';
import { requireLeagueMember } from '$lib/server/permissions/league-member';
import { and, desc, eq, or } from 'drizzle-orm';

export const load = async (event) => {
	const user = await requireUser(event);
	const league = await getCurrentLeague();
	await requireLeagueMember(user.id, league.id);
	const members = await db.query.leagueMembers.findMany({ where: eq(leagueMembers.leagueId, league.id), orderBy: [desc(leagueMembers.currentRating), desc(leagueMembers.wins)] });
	const confirmed = await db.query.matches.findMany({ where: and(eq(matches.leagueId, league.id), eq(matches.status, 'confirmed')), orderBy: [desc(matches.confirmedAt)] });
	return { members, formByMember: Object.fromEntries(members.map((member) => [member.id, confirmed.filter((match) => match.playerOneMemberId === member.id || match.playerTwoMemberId === member.id).slice(0, 5).map((match) => match.winnerMemberId === member.id ? 'V' : 'D')])) };
};
