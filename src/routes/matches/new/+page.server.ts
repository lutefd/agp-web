import { requireUser } from '$lib/server/auth/require-user';
import { db } from '$lib/server/db';
import { leagueMembers } from '$lib/server/db/schema';
import { getCurrentLeague } from '$lib/server/domain/leagues/get-current-league';
import { submitMatch } from '$lib/server/domain/matches/submit-match';
import { requireLeagueMember } from '$lib/server/permissions/league-member';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	const user = await requireUser(event); const league = await getCurrentLeague(); const member = await requireLeagueMember(user.id, league.id);
	return { member, members: await db.query.leagueMembers.findMany({ where: eq(leagueMembers.leagueId, league.id) }) };
};

export const actions = { default: async (event) => {
	const user = await requireUser(event); const league = await getCurrentLeague(); const form = await event.request.formData();
	try {
		const match = await submitMatch({ leagueId: league.id, user, opponentMemberId: String(form.get('opponentMemberId')), winnerMemberId: String(form.get('winnerMemberId')), scoreText: String(form.get('scoreText') || '').trim(), playedAt: new Date(String(form.get('playedAt'))), notes: String(form.get('notes') || '').trim() || null });
		redirect(302, `/matches/${match.id}`);
	} catch (err) { return fail(400, { message: err instanceof Error ? err.message : 'Não foi possível enviar o resultado.' }); }
} };
