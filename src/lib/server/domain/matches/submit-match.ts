import { db } from '$lib/server/db';
import { leagueMembers, matches, type User } from '$lib/server/db/schema';
import { canSubmitMatch } from '$lib/server/permissions/matches';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function submitMatch(input: {
	leagueId: string;
	user: User;
	opponentMemberId: string;
	winnerMemberId: string;
	scoreText: string;
	playedAt: Date;
	notes?: string | null;
}) {
	const currentMember = await db.query.leagueMembers.findFirst({
		where: eq(leagueMembers.userId, input.user.id)
	});
	const opponent = await db.query.leagueMembers.findFirst({
		where: eq(leagueMembers.id, input.opponentMemberId)
	});
	if (!currentMember || !opponent || !canSubmitMatch(input.user, currentMember, opponent))
		error(400, 'Partida inválida para esta liga.');
	if (![currentMember.id, opponent.id].includes(input.winnerMemberId))
		error(400, 'O vencedor precisa ser um dos jogadores.');

	const [match] = await db
		.insert(matches)
		.values({
			leagueId: input.leagueId,
			playerOneMemberId: currentMember.id,
			playerTwoMemberId: opponent.id,
			winnerMemberId: input.winnerMemberId,
			scoreText: input.scoreText,
			playedAt: input.playedAt,
			status: 'pending',
			submittedByUserId: input.user.id,
			notes: input.notes
		})
		.returning();

	return match;
}
