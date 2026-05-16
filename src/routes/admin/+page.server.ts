import { requireUser } from '$lib/server/auth/require-user';
import { db } from '$lib/server/db';
import { leagueMembers, matches, users } from '$lib/server/db/schema';
import { getCurrentLeague } from '$lib/server/domain/leagues/get-current-league';
import { requireLeagueAdmin } from '$lib/server/permissions/league-member';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, inArray } from 'drizzle-orm';

export const load = async (event) => { const user = await requireUser(event); const league = await getCurrentLeague(); await requireLeagueAdmin(user.id, league.id); return { members: await db.query.leagueMembers.findMany({ where: eq(leagueMembers.leagueId, league.id) }), users: await db.query.users.findMany(), matches: await db.query.matches.findMany({ where: inArray(matches.status, ['pending', 'disputed']) }) }; };

export const actions = {
	addMember: async (event) => { const user = await requireUser(event); const league = await getCurrentLeague(); await requireLeagueAdmin(user.id, league.id); const form = await event.request.formData(); const email = String(form.get('email')); const target = await db.query.users.findFirst({ where: eq(users.email, email) }); if (!target) return fail(400, { message: 'Usuário precisa entrar uma vez antes de virar membro.' }); await db.insert(leagueMembers).values({ leagueId: league.id, userId: target.id, displayName: String(form.get('displayName') || target.name || target.email), isAdmin: form.get('isAdmin') === 'on' }).onConflictDoNothing(); redirect(303, '/admin'); },
	cancelMatch: async (event) => { const user = await requireUser(event); const league = await getCurrentLeague(); await requireLeagueAdmin(user.id, league.id); const form = await event.request.formData(); await db.update(matches).set({ status: 'cancelled', updatedAt: new Date() }).where(and(eq(matches.id, String(form.get('matchId'))), inArray(matches.status, ['pending', 'disputed']))); redirect(303, '/admin'); }
};
