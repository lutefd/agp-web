export function getExpectedScore(playerRating: number, opponentRating: number) {
	return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

export function getKFactor(matchesPlayed: number) {
	if (matchesPlayed < 5) return 40;
	if (matchesPlayed < 15) return 32;
	return 24;
}

export function calculateEloDelta(playerRating: number, opponentRating: number, matchesPlayed: number, actualScore: 0 | 1) {
	const expectedScore = getExpectedScore(playerRating, opponentRating);
	const kFactor = getKFactor(matchesPlayed);
	const ratingDelta = Math.round(kFactor * (actualScore - expectedScore));

	return { expectedScore, kFactor, ratingDelta };
}
