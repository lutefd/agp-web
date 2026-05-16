import type { LeagueMember, Match, User } from '$lib/server/db/schema';

export function canSubmitMatch(user: User, playerOne: LeagueMember, playerTwo: LeagueMember) {
	return (
		playerOne.leagueId === playerTwo.leagueId &&
		playerOne.id !== playerTwo.id &&
		[playerOne.userId, playerTwo.userId].includes(user.id)
	);
}

export function canConfirmMatch(
	user: User,
	match: Match,
	playerOne: LeagueMember,
	playerTwo: LeagueMember
) {
	return (
		match.status === 'pending' &&
		user.id !== match.submittedByUserId &&
		[playerOne.userId, playerTwo.userId].includes(user.id)
	);
}

export const canDisputeMatch = canConfirmMatch;
