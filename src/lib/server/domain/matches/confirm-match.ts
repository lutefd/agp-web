import { db } from '$lib/server/db';
import { leagueMembers, matches, ratingEvents, type User } from '$lib/server/db/schema';
import { calculateEloDelta } from '$lib/server/domain/ratings/elo';
import { canConfirmMatch } from '$lib/server/permissions/matches';
import { error } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';

export async function confirmMatch(matchId: string, user: User) {
	return db.transaction(async (tx) => {
		const match = await tx.query.matches.findFirst({ where: eq(matches.id, matchId) });
		if (!match) error(404, 'Partida não encontrada.');

		const playerOne = await tx.query.leagueMembers.findFirst({
			where: eq(leagueMembers.id, match.playerOneMemberId)
		});
		const playerTwo = await tx.query.leagueMembers.findFirst({
			where: eq(leagueMembers.id, match.playerTwoMemberId)
		});
		if (!playerOne || !playerTwo || !canConfirmMatch(user, match, playerOne, playerTwo))
			error(403, 'Você não pode confirmar esta partida.');

		const updated = await tx
			.update(matches)
			.set({
				status: 'confirmed',
				confirmedByUserId: user.id,
				confirmedAt: new Date(),
				updatedAt: new Date()
			})
			.where(and(eq(matches.id, matchId), eq(matches.status, 'pending')))
			.returning();
		if (updated.length === 0) return match;

		const playerOneWon = match.winnerMemberId === playerOne.id;
		const playerOneRating = calculateEloDelta(
			playerOne.currentRating,
			playerTwo.currentRating,
			playerOne.matchesPlayed,
			playerOneWon ? 1 : 0
		);
		const playerTwoRating = calculateEloDelta(
			playerTwo.currentRating,
			playerOne.currentRating,
			playerTwo.matchesPlayed,
			playerOneWon ? 0 : 1
		);

		await tx
			.update(leagueMembers)
			.set({
				currentRating: playerOne.currentRating + playerOneRating.ratingDelta,
				matchesPlayed: sql`${leagueMembers.matchesPlayed} + 1`,
				wins: playerOneWon ? sql`${leagueMembers.wins} + 1` : leagueMembers.wins,
				losses: playerOneWon ? leagueMembers.losses : sql`${leagueMembers.losses} + 1`,
				updatedAt: new Date()
			})
			.where(eq(leagueMembers.id, playerOne.id));

		await tx
			.update(leagueMembers)
			.set({
				currentRating: playerTwo.currentRating + playerTwoRating.ratingDelta,
				matchesPlayed: sql`${leagueMembers.matchesPlayed} + 1`,
				wins: playerOneWon ? leagueMembers.wins : sql`${leagueMembers.wins} + 1`,
				losses: playerOneWon ? sql`${leagueMembers.losses} + 1` : leagueMembers.losses,
				updatedAt: new Date()
			})
			.where(eq(leagueMembers.id, playerTwo.id));

		await tx
			.insert(ratingEvents)
			.values([
				{
					leagueId: match.leagueId,
					matchId,
					memberId: playerOne.id,
					opponentMemberId: playerTwo.id,
					ratingBefore: playerOne.currentRating,
					ratingAfter: playerOne.currentRating + playerOneRating.ratingDelta,
					ratingDelta: playerOneRating.ratingDelta,
					expectedScore: String(playerOneRating.expectedScore),
					actualScore: playerOneWon ? '1' : '0',
					kFactor: playerOneRating.kFactor
				},
				{
					leagueId: match.leagueId,
					matchId,
					memberId: playerTwo.id,
					opponentMemberId: playerOne.id,
					ratingBefore: playerTwo.currentRating,
					ratingAfter: playerTwo.currentRating + playerTwoRating.ratingDelta,
					ratingDelta: playerTwoRating.ratingDelta,
					expectedScore: String(playerTwoRating.expectedScore),
					actualScore: playerOneWon ? '0' : '1',
					kFactor: playerTwoRating.kFactor
				}
			])
			.onConflictDoNothing();

		return updated[0];
	});
}
