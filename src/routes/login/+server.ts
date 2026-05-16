import { getLoginUrl } from '$lib/server/auth/workos';
import { redirect } from '@sveltejs/kit';

export const GET = () => {
	redirect(302, getLoginUrl());
};
