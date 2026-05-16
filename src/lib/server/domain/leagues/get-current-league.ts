import { db } from '$lib/server/db';
import { leagues } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const DEFAULT_LEAGUE_SLUG = 'guris-league';

export async function getCurrentLeague() {
	let league = await db.query.leagues.findFirst({ where: eq(leagues.slug, DEFAULT_LEAGUE_SLUG) });
	if (!league) {
		[league] = await db
			.insert(leagues)
			.values({ name: 'Guris League', slug: DEFAULT_LEAGUE_SLUG })
			.returning();
	}
	return league;
}
