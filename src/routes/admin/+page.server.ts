import { requireUser } from '$lib/server/auth/require-user';
import { db } from '$lib/server/db';
import { leagueInvitations, leagueMembers, matches } from '$lib/server/db/schema';
import { getCurrentLeague } from '$lib/server/domain/leagues/get-current-league';
import { sendLeagueInvitation } from '$lib/server/domain/leagues/invitations';
import { requireLeagueAdmin } from '$lib/server/permissions/league-member';
import { fail, redirect } from '@sveltejs/kit';
import { and, desc, eq, inArray } from 'drizzle-orm';

export const load = async (event) => {
	const user = await requireUser(event);
	const league = await getCurrentLeague();
	await requireLeagueAdmin(user.id, league.id);
	return {
		members: await db.query.leagueMembers.findMany({
			where: eq(leagueMembers.leagueId, league.id)
		}),
		invitations: await db.query.leagueInvitations.findMany({
			where: eq(leagueInvitations.leagueId, league.id),
			orderBy: [desc(leagueInvitations.createdAt)]
		}),
		matches: await db.query.matches.findMany({
			where: inArray(matches.status, ['pending', 'disputed'])
		})
	};
};

export const actions = {
	inviteMember: async (event) => {
		const user = await requireUser(event);
		const league = await getCurrentLeague();
		await requireLeagueAdmin(user.id, league.id);
		const form = await event.request.formData();
		const email = String(form.get('email') || '').trim();
		if (!email) return fail(400, { message: 'Informe o e-mail do convidado.' });
		await sendLeagueInvitation({
			league,
			inviter: user,
			email,
			displayName: String(form.get('displayName') || email),
			isAdmin: form.get('isAdmin') === 'on'
		});
		redirect(303, '/admin');
	},
	cancelMatch: async (event) => {
		const user = await requireUser(event);
		const league = await getCurrentLeague();
		await requireLeagueAdmin(user.id, league.id);
		const form = await event.request.formData();
		await db
			.update(matches)
			.set({ status: 'cancelled', updatedAt: new Date() })
			.where(
				and(
					eq(matches.id, String(form.get('matchId'))),
					inArray(matches.status, ['pending', 'disputed'])
				)
			);
		redirect(303, '/admin');
	}
};
