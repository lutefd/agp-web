import { db } from '$lib/server/db';
import { users, type User } from '$lib/server/db/schema';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';

const cookieName = 'guris_user_id';

export function setUserSession(event: RequestEvent, userId: string) {
	event.cookies.set(cookieName, userId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		maxAge: 60 * 60 * 24 * 30
	});
}

export function clearUserSession(event: RequestEvent) {
	event.cookies.delete(cookieName, { path: '/' });
}

export async function getOptionalUser(event: RequestEvent): Promise<User | null> {
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
