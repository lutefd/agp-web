import { describe, expect, it } from 'vitest';
import { canConfirmMatch, canSubmitMatch } from './matches';

const user = { id: 'user-1' } as any;
const opponentUser = { id: 'user-2' } as any;
const outsider = { id: 'user-3' } as any;
const playerOne = { id: 'member-1', userId: 'user-1', leagueId: 'league-1' } as any;
const playerTwo = { id: 'member-2', userId: 'user-2', leagueId: 'league-1' } as any;
const otherLeaguePlayer = { id: 'member-3', userId: 'user-3', leagueId: 'league-2' } as any;

describe('match permissions', () => {
	it('allows a player to submit a match in the same league', () => {
		expect(canSubmitMatch(user, playerOne, playerTwo)).toBe(true);
		expect(canSubmitMatch(outsider, playerOne, playerTwo)).toBe(false);
		expect(canSubmitMatch(user, playerOne, otherLeaguePlayer)).toBe(false);
	});

	it('allows only opponent to confirm a pending match', () => {
		const match = { status: 'pending', submittedByUserId: user.id } as any;
		expect(canConfirmMatch(opponentUser, match, playerOne, playerTwo)).toBe(true);
		expect(canConfirmMatch(user, match, playerOne, playerTwo)).toBe(false);
		expect(canConfirmMatch(outsider, match, playerOne, playerTwo)).toBe(false);
		expect(
			canConfirmMatch(opponentUser, { ...match, status: 'disputed' }, playerOne, playerTwo)
		).toBe(false);
	});
});
