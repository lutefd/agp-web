import { getOptionalUser } from '$lib/server/auth/require-user';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const user = await getOptionalUser(event);
	if (user) redirect(302, '/leaderboard');
};
