import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { leagueInvitations, leagueMembers, type League, type User } from '$lib/server/db/schema';
import { getWorkos } from '$lib/server/auth/workos';
import { and, eq, inArray } from 'drizzle-orm';

function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

function getInitialAdminEmails() {
	return new Set((env.INITIAL_ADMIN_EMAILS ?? '').split(',').map(normalizeEmail).filter(Boolean));
}

export async function sendLeagueInvitation(input: {
	league: League;
	inviter: User;
	email: string;
	displayName: string;
	isAdmin: boolean;
}) {
	const email = normalizeEmail(input.email);
	const invitation = await getWorkos().userManagement.sendInvitation({
		email,
		inviterUserId: input.inviter.workosUserId,
		expiresInDays: 14
	});

	const [leagueInvitation] = await db
		.insert(leagueInvitations)
		.values({
			leagueId: input.league.id,
			email,
			displayName: input.displayName.trim() || email,
			isAdmin: input.isAdmin,
			workosInvitationId: invitation.id,
			acceptInvitationUrl: invitation.acceptInvitationUrl,
			invitedByUserId: input.inviter.id
		})
		.onConflictDoUpdate({
			target: [leagueInvitations.leagueId, leagueInvitations.email],
			set: {
				displayName: input.displayName.trim() || email,
				isAdmin: input.isAdmin,
				workosInvitationId: invitation.id,
				acceptInvitationUrl: invitation.acceptInvitationUrl,
				state: 'pending',
				updatedAt: new Date()
			}
		})
		.returning();

	return leagueInvitation;
}

export async function ensureLeagueMembership(user: User, league: League) {
	const existingMember = await db.query.leagueMembers.findFirst({
		where: and(eq(leagueMembers.userId, user.id), eq(leagueMembers.leagueId, league.id))
	});
	if (existingMember) return existingMember;

	const memberCount = await db.query.leagueMembers.findMany({
		where: eq(leagueMembers.leagueId, league.id),
		limit: 1
	});
	const initialAdminEmails = getInitialAdminEmails();
	if (memberCount.length === 0 && initialAdminEmails.has(normalizeEmail(user.email))) {
		const [member] = await db
			.insert(leagueMembers)
			.values({
				leagueId: league.id,
				userId: user.id,
				displayName: user.name || user.email,
				isAdmin: true
			})
			.returning();
		return member;
	}

	const invitation = await db.query.leagueInvitations.findFirst({
		where: and(
			eq(leagueInvitations.leagueId, league.id),
			eq(leagueInvitations.email, normalizeEmail(user.email)),
			inArray(leagueInvitations.state, ['pending', 'accepted'])
		)
	});
	if (!invitation) return null;

	const [member] = await db
		.insert(leagueMembers)
		.values({
			leagueId: league.id,
			userId: user.id,
			displayName: invitation.displayName,
			isAdmin: invitation.isAdmin
		})
		.onConflictDoNothing()
		.returning();

	await db
		.update(leagueInvitations)
		.set({ state: 'accepted', acceptedByUserId: user.id, updatedAt: new Date() })
		.where(eq(leagueInvitations.id, invitation.id));

	return member ?? null;
}
