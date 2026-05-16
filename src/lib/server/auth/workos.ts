import { WORKOS_API_KEY, WORKOS_CLIENT_ID, WORKOS_REDIRECT_URI } from '$env/static/private';
import { WorkOS } from '@workos-inc/node';

export const workos = new WorkOS(WORKOS_API_KEY);

export function getLoginUrl() {
	return workos.userManagement.getAuthorizationUrl({
		clientId: WORKOS_CLIENT_ID,
		redirectUri: WORKOS_REDIRECT_URI,
		provider: 'authkit'
	});
}
