import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is required');
}

try {
	new URL(DATABASE_URL);
} catch {
	throw new Error(
		'DATABASE_URL must be a valid Postgres URL. Check for missing quotes, spaces, or an unescaped password in .env.'
	);
}

const client = postgres(DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });
export type Database = typeof db;
