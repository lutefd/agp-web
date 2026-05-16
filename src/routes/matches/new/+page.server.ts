import { requireUser } from '$lib/server/auth/require-user';
import { db } from '$lib/server/db';
import { leagueMembers } from '$lib/server/db/schema';
import { getCurrentLeague } from '$lib/server/domain/leagues/get-current-league';
import { submitMatch } from '$lib/server/domain/matches/submit-match';
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
			await submitMatch({
				leagueId: league.id,
				user,
				opponentMemberId: String(form.get('opponentMemberId')),
				winnerMemberId: String(form.get('winnerMemberId')),
				scoreText,
				playedAt,
				notes: String(form.get('notes') || '').trim() || null
			});
		} catch (err) {
			return fail(400, {
				message: err instanceof Error ? err.message : 'Não foi possível enviar o resultado.'
			});
		}
		redirect(303, '/matches');
	}
};
