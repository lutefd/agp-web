import { requireUser } from '$lib/server/auth/require-user';
import { db } from '$lib/server/db';
import { leagueMembers, matches, ratingEvents, users } from '$lib/server/db/schema';
import { acceptDisputedMatch, confirmMatch } from '$lib/server/domain/matches/confirm-match';
import { disputeMatch } from '$lib/server/domain/matches/dispute-match';
import { sendMatchDisputedEmail } from '$lib/server/email/match-notification';
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
	const canAcceptDispute = match.status === 'disputed' && match.submittedByUserId === user.id;
	return {
		match,
		canReview,
		canAcceptDispute,
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
		const form = await event.request.formData();
		const updatedMatch = await disputeMatch(event.params.id, user, {
			winnerMemberId: String(form.get('winnerMemberId') || ''),
			scoreText: String(form.get('scoreText') || '')
				.trim()
				.replace(/\s+/g, ' '),
			notes: String(form.get('notes') || '').trim() || null
		});
		const disputer = await db.query.leagueMembers.findFirst({
			where: eq(leagueMembers.userId, user.id)
		});
		const submitterUser = await db.query.users.findFirst({
			where: eq(users.id, updatedMatch.submittedByUserId)
		});
		if (disputer && submitterUser) {
			await sendMatchDisputedEmail({ match: updatedMatch, disputer, submitterUser }).catch(
				(err) => {
					console.error('Failed to send match dispute email', err);
				}
			);
		}
		redirect(303, `/matches/${event.params.id}`);
	},
	acceptDispute: async (event) => {
		const user = await requireUser(event);
		await acceptDisputedMatch(event.params.id, user);
		redirect(303, `/matches/${event.params.id}`);
	}
};
