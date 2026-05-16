import { env } from '$env/dynamic/private';
import { WorkOS } from '@workos-inc/node';

export const workos = new WorkOS(env.WORKOS_API_KEY);

export function getLoginUrl() {
	return workos.userManagement.getAuthorizationUrl({
		clientId: env.WORKOS_CLIENT_ID,
		redirectUri: env.WORKOS_REDIRECT_URI,
		provider: 'authkit'
	});
}
