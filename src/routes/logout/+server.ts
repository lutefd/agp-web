import { clearUserSession } from '$lib/server/auth/require-user';
import { redirect } from '@sveltejs/kit';

export const GET = (event) => {
	clearUserSession(event);
	redirect(302, '/login');
};
