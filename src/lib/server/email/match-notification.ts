import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { LeagueMember, Match, User } from '$lib/server/db/schema';
import { Resend } from 'resend';

function getMatchUrl(matchId: string) {
	const baseUrl = publicEnv.PUBLIC_APP_URL || 'http://localhost:5173';
	return `${baseUrl.replace(/\/$/, '')}/matches/${matchId}`;
}

export async function sendMatchConfirmationEmail(input: {
	match: Match;
	submitter: LeagueMember;
	opponent: LeagueMember;
	opponentUser: User;
}) {
	if (!privateEnv.RESEND_API_KEY) return;

	const resend = new Resend(privateEnv.RESEND_API_KEY);
	const matchUrl = getMatchUrl(input.match.id);
	const from = privateEnv.RESEND_FROM || 'AGP <onboarding@resend.dev>';

	const result = await resend.emails.send({
		from,
		to: input.opponentUser.email,
		subject: `${input.submitter.displayName} registrou uma partida na AGP`,
		html: `
			<!doctype html>
			<html>
				<head>
					<meta name="color-scheme" content="light only">
					<meta name="supported-color-schemes" content="light only">
				</head>
				<body style="margin:0;padding:0;background-color:#f8f6ef;color:#111821;color-scheme:light only;">
					<div style="margin:0;background-color:#f8f6ef;padding:32px;font-family:Inter,Arial,sans-serif;color:#111821;">
						<div style="margin:0 auto;max-width:620px;border:1px solid #ded8cb;border-radius:28px;background-color:#fffdf9;overflow:hidden;color:#111821;">
							<div style="background-color:#e6efe4;background-image:linear-gradient(135deg,#e6efe4,#fffdf9);padding:32px;color:#111821;">
								<p style="margin:0 0 12px;color:#176b25;font-weight:800;text-transform:uppercase;letter-spacing:.08em">AGP</p>
								<h1 style="margin:0;font-family:Georgia,serif;font-size:40px;line-height:1.05;color:#111821;font-weight:900;">Resultado esperando tua confirmação</h1>
							</div>
							<div style="padding:32px;background-color:#fffdf9;color:#111821;">
								<p style="font-size:18px;line-height:1.6;color:#5b5f68;margin:0 0 24px">
									${input.submitter.displayName} registrou uma partida contra você com placar <strong style="color:#111821">${input.match.scoreText}</strong>.
								</p>
								<a href="${matchUrl}" style="display:block;text-align:center;background-color:#176b25;color:#ffffff !important;text-decoration:none;border-radius:18px;padding:16px 22px;font-weight:900;font-size:18px">Confirmar ou contestar resultado</a>
								<p style="font-size:14px;color:#5b5f68;margin:24px 0 0">Se o botão não abrir, acesse: <a style="color:#176b25 !important" href="${matchUrl}">${matchUrl}</a></p>
							</div>
						</div>
					</div>
				</body>
			</html>
		`
	});

	if (result.error) {
		throw new Error(`Resend failed to send match confirmation email: ${result.error.message}`);
	}

	return result.data;
}
