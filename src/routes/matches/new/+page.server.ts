import { requireUser } from '$lib/server/auth/require-user';
import { db } from '$lib/server/db';
import { leagueMembers, users } from '$lib/server/db/schema';
import { getCurrentLeague } from '$lib/server/domain/leagues/get-current-league';
import { submitMatch } from '$lib/server/domain/matches/submit-match';
import { sendMatchConfirmationEmail } from '$lib/server/email/match-notification';
import { requireLeagueMember } from '$lib/server/permissions/league-member';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	const user = await requireUser(event);
	const league = await getCurrentLeague();
	const member = await requireLeagueMember(user.id, league.id);
	return {
		member,
		members: await db.query.leagueMembers.findMany({ where: eq(leagueMembers.leagueId, league.id) })
	};
};

export const actions = {
	default: async (event) => {
		const user = await requireUser(event);
		const league = await getCurrentLeague();
		const form = await event.request.formData();
		const scoreText = String(form.get('scoreText') || '')
			.trim()
			.replace(/\s+/g, ' ');
		const playedAt = new Date(String(form.get('playedAt')));
		if (!scoreText) return fail(400, { message: 'Informe o placar da partida.' });
		if (Number.isNaN(playedAt.getTime())) return fail(400, { message: 'Informe uma data válida.' });
		try {
			const match = await submitMatch({
				leagueId: league.id,
				user,
				opponentMemberId: String(form.get('opponentMemberId')),
				winnerMemberId: String(form.get('winnerMemberId')),
				scoreText,
				playedAt,
				notes: String(form.get('notes') || '').trim() || null
			});
			const submitter = await db.query.leagueMembers.findFirst({
				where: eq(leagueMembers.userId, user.id)
			});
			const opponent = await db.query.leagueMembers.findFirst({
				where: eq(leagueMembers.id, String(form.get('opponentMemberId')))
			});
			const opponentUser = opponent
				? await db.query.users.findFirst({ where: eq(users.id, opponent.userId) })
				: null;
			if (submitter && opponent && opponentUser) {
				await sendMatchConfirmationEmail({ match, submitter, opponent, opponentUser }).catch(
					(err) => {
						console.error('Failed to send match confirmation email', err);
					}
				);
			}
		} catch (err) {
			return fail(400, {
				message: err instanceof Error ? err.message : 'Não foi possível enviar o resultado.'
			});
		}
		redirect(303, '/matches');
	}
};
