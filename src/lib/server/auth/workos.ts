import { env } from '$env/dynamic/private';
import { WorkOS } from '@workos-inc/node';

export const workos = new WorkOS(env.WORKOS_API_KEY);

function requireEnv(name: 'WORKOS_CLIENT_ID' | 'WORKOS_REDIRECT_URI') {
	const value = env[name];
	if (!value) throw new Error(`${name} is required`);
	return value;
}

export function getLoginUrl() {
	return workos.userManagement.getAuthorizationUrl({
		clientId: requireEnv('WORKOS_CLIENT_ID'),
		redirectUri: requireEnv('WORKOS_REDIRECT_URI'),
		provider: 'authkit'
	});
}
