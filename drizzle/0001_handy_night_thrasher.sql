CREATE TABLE "league_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"workos_invitation_id" text NOT NULL,
	"accept_invitation_url" text NOT NULL,
	"state" text DEFAULT 'pending' NOT NULL,
	"invited_by_user_id" uuid NOT NULL,
	"accepted_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "league_invitations_workos_invitation_id_unique" UNIQUE("workos_invitation_id"),
	CONSTRAINT "league_invitations_league_id_email_unique" UNIQUE("league_id","email")
);
--> statement-breakpoint
ALTER TABLE "matches" DROP CONSTRAINT "matches_different_players";--> statement-breakpoint
ALTER TABLE "matches" DROP CONSTRAINT "matches_valid_winner";--> statement-breakpoint
ALTER TABLE "matches" DROP CONSTRAINT "matches_valid_status";--> statement-breakpoint
ALTER TABLE "league_invitations" ADD CONSTRAINT "league_invitations_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_invitations" ADD CONSTRAINT "league_invitations_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_invitations" ADD CONSTRAINT "league_invitations_accepted_by_user_id_users_id_fk" FOREIGN KEY ("accepted_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_different_players" CHECK (player_one_member_id <> player_two_member_id);--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_valid_winner" CHECK (winner_member_id in (player_one_member_id, player_two_member_id));--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_valid_status" CHECK (status in ('pending', 'confirmed', 'disputed', 'cancelled'));