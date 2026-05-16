import { env } from '$env/dynamic/private';
import { WorkOS } from '@workos-inc/node';

export function getWorkos() {
	if (!env.WORKOS_API_KEY) throw new Error('WORKOS_API_KEY is required');
	if (!env.WORKOS_CLIENT_ID) throw new Error('WORKOS_CLIENT_ID is required');
	return new WorkOS({ apiKey: env.WORKOS_API_KEY, clientId: env.WORKOS_CLIENT_ID });
}

function requireEnv(name: 'WORKOS_CLIENT_ID' | 'WORKOS_REDIRECT_URI') {
	const value = env[name];
	if (!value) throw new Error(`${name} is required`);
	return value;
}

export function getLoginUrl() {
	return getWorkos().userManagement.getAuthorizationUrl({
		clientId: requireEnv('WORKOS_CLIENT_ID'),
		redirectUri: requireEnv('WORKOS_REDIRECT_URI'),
		provider: 'authkit'
	});
}
