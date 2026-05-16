import { describe, expect, it } from 'vitest';
import { calculateEloDelta, getExpectedScore, getKFactor } from './elo';

describe('elo rating', () => {
	it('calculates expected score for equal ratings', () => {
		expect(getExpectedScore(1000, 1000)).toBe(0.5);
	});

	it('selects k factor by experience', () => {
		expect(getKFactor(0)).toBe(40);
		expect(getKFactor(5)).toBe(32);
		expect(getKFactor(15)).toBe(24);
	});

	it('adds points to winner and removes points from loser', () => {
		expect(calculateEloDelta(1000, 1000, 0, 1).ratingDelta).toBe(20);
		expect(calculateEloDelta(1000, 1000, 0, 0).ratingDelta).toBe(-20);
	});
});
