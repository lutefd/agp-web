import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { users, type User } from '$lib/server/db/schema';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import { getWorkos } from './workos';

const cookieName = 'guris_user_id';
const workosSessionCookieName = 'wos_session';

export function setUserSession(event: RequestEvent, userId: string) {
	event.cookies.set(cookieName, userId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: event.url.protocol === 'https:',
		maxAge: 60 * 60 * 24 * 30
	});
}

export function setWorkosSession(event: RequestEvent, sealedSession: string) {
	event.cookies.set(workosSessionCookieName, sealedSession, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: event.url.protocol === 'https:',
		maxAge: 60 * 60 * 24 * 30
	});
}

export function clearUserSession(event: RequestEvent) {
	event.cookies.delete(cookieName, { path: '/' });
	event.cookies.delete(workosSessionCookieName, { path: '/' });
}

export async function getWorkosLogoutUrl(event: RequestEvent, returnTo: string) {
	const sealedSession = event.cookies.get(workosSessionCookieName);
	if (!sealedSession || !env.WORKOS_COOKIE_PASSWORD) return returnTo;

	const session = getWorkos().userManagement.loadSealedSession({
		sessionData: sealedSession,
		cookiePassword: env.WORKOS_COOKIE_PASSWORD
	});

	return session.getLogoutUrl({ returnTo });
}

export async function getOptionalUser(event: RequestEvent): Promise<User | null> {
	const sealedSession = event.cookies.get(workosSessionCookieName);
	if (sealedSession && env.WORKOS_COOKIE_PASSWORD) {
		const session = getWorkos().userManagement.loadSealedSession({
			sessionData: sealedSession,
			cookiePassword: env.WORKOS_COOKIE_PASSWORD
		});
		const authentication = await session.authenticate();
		if (!authentication.authenticated) return null;

		return (
			(await db.query.users.findFirst({
				where: eq(users.workosUserId, authentication.user.id)
			})) ?? null
		);
	}

	const userId = event.cookies.get(cookieName);
	if (!userId) return null;
	return (await db.query.users.findFirst({ where: eq(users.id, userId) })) ?? null;
}

export async function requireUser(event: RequestEvent) {
	const user = await getOptionalUser(event);
	if (!user) redirect(302, '/login');
	return user;
}

export async function upsertLocalUser(input: {
	workosUserId: string;
	email: string;
	name?: string | null;
	avatarUrl?: string | null;
}) {
	const existingUser = await db.query.users.findFirst({
		where: or(eq(users.workosUserId, input.workosUserId), eq(users.email, input.email))
	});

	if (existingUser) {
		const [user] = await db
			.update(users)
			.set({
				workosUserId: input.workosUserId,
				email: input.email,
				name: input.name,
				avatarUrl: input.avatarUrl,
				updatedAt: new Date()
			})
			.where(eq(users.id, existingUser.id))
			.returning();
		return user;
	}

	const [user] = await db.insert(users).values(input).returning();
	return user;
}
