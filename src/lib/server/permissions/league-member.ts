import { db } from '$lib/server/db';
import { leagueMembers } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function getLeagueMember(userId: string, leagueId: string) {
	return db.query.leagueMembers.findFirst({
		where: and(eq(leagueMembers.userId, userId), eq(leagueMembers.leagueId, leagueId))
	});
}

export async function requireLeagueMember(userId: string, leagueId: string) {
	const member = await getLeagueMember(userId, leagueId);
	if (!member) error(403, 'Você não participa desta liga.');
	return member;
}

export async function requireLeagueAdmin(userId: string, leagueId: string) {
	const member = await requireLeagueMember(userId, leagueId);
	if (!member.isAdmin) error(403, 'Apenas administradores podem acessar esta página.');
	return member;
}
