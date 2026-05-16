import { requireUser } from '$lib/server/auth/require-user';
import { db } from '$lib/server/db';
import { leagueMembers, matches, ratingEvents } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { desc, eq, or } from 'drizzle-orm';

export const load = async (event) => {
	await requireUser(event);
	const member = await db.query.leagueMembers.findFirst({
		where: eq(leagueMembers.id, event.params.id)
	});
	if (!member) error(404, 'Jogador não encontrado.');
	const memberMatches = await db.query.matches.findMany({
		where: or(eq(matches.playerOneMemberId, member.id), eq(matches.playerTwoMemberId, member.id)),
		orderBy: [desc(matches.playedAt)]
	});
	const events = await db.query.ratingEvents.findMany({
		where: eq(ratingEvents.memberId, member.id),
		orderBy: [desc(ratingEvents.createdAt)]
	});
	return { member, matches: memberMatches, events };
};
