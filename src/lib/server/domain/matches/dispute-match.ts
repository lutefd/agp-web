import { db } from '$lib/server/db';
import { leagueMembers, matches, type User } from '$lib/server/db/schema';
import { canDisputeMatch } from '$lib/server/permissions/matches';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function disputeMatch(matchId: string, user: User) {
	const match = await db.query.matches.findFirst({ where: eq(matches.id, matchId) });
	if (!match) error(404, 'Partida não encontrada.');
	const playerOne = await db.query.leagueMembers.findFirst({
		where: eq(leagueMembers.id, match.playerOneMemberId)
	});
	const playerTwo = await db.query.leagueMembers.findFirst({
		where: eq(leagueMembers.id, match.playerTwoMemberId)
	});
	if (!playerOne || !playerTwo || !canDisputeMatch(user, match, playerOne, playerTwo))
		error(403, 'Você não pode contestar esta partida.');

	const [updated] = await db
		.update(matches)
		.set({
			status: 'disputed',
			disputedByUserId: user.id,
			disputedAt: new Date(),
			updatedAt: new Date()
		})
		.where(and(eq(matches.id, matchId), eq(matches.status, 'pending')))
		.returning();
	return updated ?? match;
}
