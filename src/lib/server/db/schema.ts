import { relations } from 'drizzle-orm';
import {
	boolean,
	check,
	date,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	unique,
	uuid
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	workosUserId: text('workos_user_id').notNull().unique(),
	email: text('email').notNull().unique(),
	name: text('name'),
	avatarUrl: text('avatar_url'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const leagues = pgTable('leagues', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	seasonStartsAt: date('season_starts_at'),
	seasonEndsAt: date('season_ends_at'),
	createdByUserId: uuid('created_by_user_id').references(() => users.id),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const leagueMembers = pgTable(
	'league_members',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		leagueId: uuid('league_id')
			.notNull()
			.references(() => leagues.id),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
		displayName: text('display_name').notNull(),
		initialRating: integer('initial_rating').notNull().default(1000),
		currentRating: integer('current_rating').notNull().default(1000),
		matchesPlayed: integer('matches_played').notNull().default(0),
		wins: integer('wins').notNull().default(0),
		losses: integer('losses').notNull().default(0),
		isAdmin: boolean('is_admin').notNull().default(false),
		joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => ({ memberUserUnique: unique().on(table.leagueId, table.userId) })
);

export const matches = pgTable(
	'matches',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		leagueId: uuid('league_id')
			.notNull()
			.references(() => leagues.id),
		playerOneMemberId: uuid('player_one_member_id')
			.notNull()
			.references(() => leagueMembers.id),
		playerTwoMemberId: uuid('player_two_member_id')
			.notNull()
			.references(() => leagueMembers.id),
		winnerMemberId: uuid('winner_member_id')
			.notNull()
			.references(() => leagueMembers.id),
		scoreText: text('score_text').notNull(),
		playedAt: timestamp('played_at', { withTimezone: true }).notNull(),
		status: text('status').notNull(),
		submittedByUserId: uuid('submitted_by_user_id')
			.notNull()
			.references(() => users.id),
		confirmedByUserId: uuid('confirmed_by_user_id').references(() => users.id),
		disputedByUserId: uuid('disputed_by_user_id').references(() => users.id),
		submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
		confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
		disputedAt: timestamp('disputed_at', { withTimezone: true }),
		notes: text('notes'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => ({
		differentPlayers: check(
			'matches_different_players',
			sql`player_one_member_id <> player_two_member_id`
		),
		validWinner: check(
			'matches_valid_winner',
			sql`winner_member_id in (player_one_member_id, player_two_member_id)`
		),
		validStatus: check(
			'matches_valid_status',
			sql`status in ('pending', 'confirmed', 'disputed', 'cancelled')`
		)
	})
);

export const ratingEvents = pgTable(
	'rating_events',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		leagueId: uuid('league_id')
			.notNull()
			.references(() => leagues.id),
		matchId: uuid('match_id')
			.notNull()
			.references(() => matches.id),
		memberId: uuid('member_id')
			.notNull()
			.references(() => leagueMembers.id),
		opponentMemberId: uuid('opponent_member_id')
			.notNull()
			.references(() => leagueMembers.id),
		ratingBefore: integer('rating_before').notNull(),
		ratingAfter: integer('rating_after').notNull(),
		ratingDelta: integer('rating_delta').notNull(),
		expectedScore: numeric('expected_score').notNull(),
		actualScore: numeric('actual_score').notNull(),
		kFactor: integer('k_factor').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => ({ eventMemberUnique: unique().on(table.matchId, table.memberId) })
);

export const usersRelations = relations(users, ({ many }) => ({
	memberships: many(leagueMembers)
}));
export const leaguesRelations = relations(leagues, ({ many }) => ({
	members: many(leagueMembers),
	matches: many(matches)
}));

export type User = typeof users.$inferSelect;
export type League = typeof leagues.$inferSelect;
export type LeagueMember = typeof leagueMembers.$inferSelect;
export type Match = typeof matches.$inferSelect;
