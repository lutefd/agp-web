import { requireUser } from '$lib/server/auth/require-user';
import { db } from '$lib/server/db';
import { leagueMembers, matches, ratingEvents } from '$lib/server/db/schema';
import { confirmMatch } from '$lib/server/domain/matches/confirm-match';
import { disputeMatch } from '$lib/server/domain/matches/dispute-match';
import { canConfirmMatch } from '$lib/server/permissions/matches';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	const user = await requireUser(event);
	const match = await db.query.matches.findFirst({ where: eq(matches.id, event.params.id) });
	if (!match) error(404, 'Partida não encontrada.');
	const members = await db.query.leagueMembers.findMany({
		where: eq(leagueMembers.leagueId, match.leagueId)
	});
	const playerOne = members.find((member) => member.id === match.playerOneMemberId);
	const playerTwo = members.find((member) => member.id === match.playerTwoMemberId);
	const canReview =
		playerOne && playerTwo ? canConfirmMatch(user, match, playerOne, playerTwo) : false;
	return {
		match,
		canReview,
		members,
		ratingEvents: await db.query.ratingEvents.findMany({
			where: eq(ratingEvents.matchId, match.id)
		})
	};
};

export const actions = {
	confirm: async (event) => {
		const user = await requireUser(event);
		await confirmMatch(event.params.id, user);
		redirect(303, `/matches/${event.params.id}`);
	},
	dispute: async (event) => {
		const user = await requireUser(event);
		await disputeMatch(event.params.id, user);
		redirect(303, `/matches/${event.params.id}`);
	}
};
