CREATE TABLE "ai_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"section" text NOT NULL,
	"original_text" text NOT NULL,
	"improved_text" text NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"job_complexity" integer,
	"ats_difficulty" integer,
	"technical_depth" integer,
	"leadership_requirement" integer,
	"communication_requirement" integer,
	"estimated_competition" text,
	"seniority_level" text,
	"insights" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_descriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_title" text NOT NULL,
	"company" text NOT NULL,
	"location" text,
	"employment_type" text,
	"work_mode" text,
	"salary" text,
	"notes" text,
	"raw_description" text NOT NULL,
	"parsed_data" jsonb,
	"status" text DEFAULT 'saved' NOT NULL,
	"is_parsed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_keywords" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"keyword" text NOT NULL,
	"category" text NOT NULL,
	"keyword_type" text NOT NULL,
	"frequency" integer DEFAULT 1 NOT NULL,
	"weight" integer DEFAULT 50 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"overall_score" integer,
	"ats_score" integer,
	"strengths" jsonb,
	"weaknesses" jsonb,
	"recommendations" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_job_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"job_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"resume_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text DEFAULT 'Untitled resume' NOT NULL,
	"resume_json" jsonb NOT NULL,
	"selected_template" text DEFAULT 'classic' NOT NULL,
	"resume_score" integer,
	"ats_score" integer,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"default_template" text DEFAULT 'classic' NOT NULL,
	"default_font" text DEFAULT 'Inter' NOT NULL,
	"accent_color" text DEFAULT '#6366f1' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_history" ADD CONSTRAINT "ai_history_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_analysis" ADD CONSTRAINT "job_analysis_job_id_job_descriptions_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job_descriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_descriptions" ADD CONSTRAINT "job_descriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_keywords" ADD CONSTRAINT "job_keywords_job_id_job_descriptions_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job_descriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_analysis" ADD CONSTRAINT "resume_analysis_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_job_links" ADD CONSTRAINT "resume_job_links_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_job_links" ADD CONSTRAINT "resume_job_links_job_id_job_descriptions_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job_descriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "job_analysis_job_id_unique" ON "job_analysis" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_descriptions_user_updated_at_idx" ON "job_descriptions" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "job_descriptions_user_status_idx" ON "job_descriptions" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "job_keywords_job_idx" ON "job_keywords" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_keywords_category_idx" ON "job_keywords" USING btree ("job_id","category");--> statement-breakpoint
CREATE UNIQUE INDEX "resume_job_links_unique" ON "resume_job_links" USING btree ("resume_id","job_id");--> statement-breakpoint
CREATE INDEX "resume_job_links_resume_idx" ON "resume_job_links" USING btree ("resume_id");--> statement-breakpoint
CREATE INDEX "resume_job_links_job_idx" ON "resume_job_links" USING btree ("job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resume_versions_resume_version_unique" ON "resume_versions" USING btree ("resume_id","version_number");--> statement-breakpoint
CREATE INDEX "resumes_user_updated_at_idx" ON "resumes" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_settings_user_id_unique" ON "user_settings" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_clerk_user_id_unique" ON "users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");