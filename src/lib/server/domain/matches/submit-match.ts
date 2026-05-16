import { db } from '$lib/server/db';
import { leagueMembers, matches, type User } from '$lib/server/db/schema';
import { canSubmitMatch } from '$lib/server/permissions/matches';
import { error } from '@sveltejs/kit';
import { and, eq, gte } from 'drizzle-orm';

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
		where: and(eq(leagueMembers.userId, input.user.id), eq(leagueMembers.leagueId, input.leagueId))
	});
	const opponent = await db.query.leagueMembers.findFirst({
		where: and(
			eq(leagueMembers.id, input.opponentMemberId),
			eq(leagueMembers.leagueId, input.leagueId)
		)
	});
	if (!currentMember || !opponent || !canSubmitMatch(input.user, currentMember, opponent))
		error(400, 'Partida inválida para esta liga.');
	if (![currentMember.id, opponent.id].includes(input.winnerMemberId))
		error(400, 'O vencedor precisa ser um dos jogadores.');
	if (!input.scoreText) error(400, 'Informe o placar da partida.');
	if (Number.isNaN(input.playedAt.getTime())) error(400, 'Informe uma data válida para a partida.');

	const duplicateWindowStartedAt = new Date(Date.now() - 30_000);
	const duplicateMatch = await db.query.matches.findFirst({
		where: and(
			eq(matches.leagueId, input.leagueId),
			eq(matches.submittedByUserId, input.user.id),
			eq(matches.playerOneMemberId, currentMember.id),
			eq(matches.playerTwoMemberId, opponent.id),
			eq(matches.winnerMemberId, input.winnerMemberId),
			eq(matches.scoreText, input.scoreText),
			eq(matches.status, 'pending'),
			gte(matches.createdAt, duplicateWindowStartedAt)
		)
	});
	if (duplicateMatch) return duplicateMatch;

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
