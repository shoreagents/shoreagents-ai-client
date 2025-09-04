-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

-- DROP TYPE public."break_type_enum";

CREATE TYPE public."break_type_enum" AS ENUM (
	'Morning',
	'Lunch',
	'Afternoon',
	'NightFirst',
	'NightMeal',
	'NightSecond');

-- DROP TYPE public."gender_enum";

CREATE TYPE public."gender_enum" AS ENUM (
	'Male',
	'Female',
	'Other',
	'Prefer not to say');

-- DROP TYPE public."item_type_medical";

CREATE TYPE public."item_type_medical" AS ENUM (
	'Medicine',
	'Supply');

-- DROP TYPE public."member_service_enum";

CREATE TYPE public."member_service_enum" AS ENUM (
	'One Agent',
	'Team',
	'Workforce');

-- DROP TYPE public."member_status_enum";

CREATE TYPE public."member_status_enum" AS ENUM (
	'Current Client',
	'Lost Client');

-- DROP TYPE public."ticket_status_enum";

CREATE TYPE public."ticket_status_enum" AS ENUM (
	'For Approval',
	'On Hold',
	'In Progress',
	'Approved',
	'Stuck',
	'Actioned',
	'Closed');

-- DROP TYPE public."user_type_enum";

CREATE TYPE public."user_type_enum" AS ENUM (
	'Agent',
	'Client',
	'Internal');

-- DROP SEQUENCE public.activity_data_id_seq;

CREATE SEQUENCE public.activity_data_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.break_sessions_id_seq;

CREATE SEQUENCE public.break_sessions_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.clinic_log_medicines_id_seq;

CREATE SEQUENCE public.clinic_log_medicines_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.clinic_log_supplies_id_seq;

CREATE SEQUENCE public.clinic_log_supplies_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.clinic_logs_id_seq;

CREATE SEQUENCE public.clinic_logs_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.departments_id_seq;

CREATE SEQUENCE public.departments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.floor_plan_members_id_seq;

CREATE SEQUENCE public.floor_plan_members_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.floor_plans_id_seq;

CREATE SEQUENCE public.floor_plans_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.internal_roles_id_seq;

CREATE SEQUENCE public.internal_roles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.inventory_medical_categories_id_seq;

CREATE SEQUENCE public.inventory_medical_categories_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.inventory_medical_id_seq;

CREATE SEQUENCE public.inventory_medical_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.inventory_medical_suppliers_id_seq;

CREATE SEQUENCE public.inventory_medical_suppliers_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.job_info_id_seq;

CREATE SEQUENCE public.job_info_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.meetings_id_seq;

CREATE SEQUENCE public.meetings_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.member_comments_id_seq;

CREATE SEQUENCE public.member_comments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.members_activity_log_id_seq;

CREATE SEQUENCE public.members_activity_log_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.members_id_seq;

CREATE SEQUENCE public.members_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.notifications_id_seq;

CREATE SEQUENCE public.notifications_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.personal_info_id_seq;

CREATE SEQUENCE public.personal_info_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.productivity_scores_id_seq;

CREATE SEQUENCE public.productivity_scores_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.recruits_comments_id_seq;

CREATE SEQUENCE public.recruits_comments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.recruits_id_seq;

CREATE SEQUENCE public.recruits_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.roles_id_seq;

CREATE SEQUENCE public.roles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.stations_id_seq;

CREATE SEQUENCE public.stations_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.talent_pool_id_seq;

CREATE SEQUENCE public.talent_pool_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ticket_categories_id_seq;

CREATE SEQUENCE public.ticket_categories_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ticket_comments_id_seq;

CREATE SEQUENCE public.ticket_comments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ticket_id_seq;

CREATE SEQUENCE public.ticket_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.tickets_id_seq;

CREATE SEQUENCE public.tickets_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.users_id_seq;

CREATE SEQUENCE public.users_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.weekly_activity_summary_id_seq;

CREATE SEQUENCE public.weekly_activity_summary_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public.bpoc_recruits definition

-- Drop table

-- DROP TABLE public.bpoc_recruits;

CREATE TABLE public.bpoc_recruits ( id int4 DEFAULT nextval('recruits_id_seq'::regclass) NOT NULL, applicant_id uuid NOT NULL, resume_slug text NULL, status text NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, video_introduction_url text NULL, current_salary numeric NULL, expected_monthly_salary numeric NULL, shift text NULL, "position" numeric(10, 3) DEFAULT 0 NULL, job_ids _int4 DEFAULT '{}'::integer[] NOT NULL, bpoc_application_ids _uuid DEFAULT '{}'::uuid[] NOT NULL, interested_clients _int4 DEFAULT '{}'::integer[] NOT NULL, CONSTRAINT bpoc_recruits_applicant_id_unique UNIQUE (applicant_id), CONSTRAINT bpoc_recruits_pkey PRIMARY KEY (id));
CREATE INDEX idx_bpoc_recruits_status_position ON public.bpoc_recruits USING btree (status, "position");
CREATE INDEX idx_recruits_bpoc_app_ids_gin ON public.bpoc_recruits USING gin (bpoc_application_ids);
CREATE INDEX idx_recruits_interested_clients_gin ON public.bpoc_recruits USING gin (interested_clients);
CREATE INDEX idx_recruits_job_ids_gin ON public.bpoc_recruits USING gin (job_ids);
CREATE INDEX idx_status_position ON public.bpoc_recruits USING btree (status, "position");

-- Table Triggers

create trigger update_bpoc_recruits_updated_at before
update
    on
    public.bpoc_recruits for each row execute function update_updated_at_column();
create trigger trigger_applicant_changes after
insert
    or
delete
    or
update
    on
    public.bpoc_recruits for each row execute function notify_applicant_changes();
create trigger trigger_add_to_talent_pool_insert after
insert
    on
    public.bpoc_recruits for each row execute function add_to_talent_pool();
create trigger trigger_add_to_talent_pool_update after
update
    of status on
    public.bpoc_recruits for each row execute function add_to_talent_pool();


-- public.break_sessions definition

-- Drop table

-- DROP TABLE public.break_sessions;

CREATE TABLE public.break_sessions ( id serial4 NOT NULL, agent_user_id int4 NOT NULL, start_time timestamptz NOT NULL, end_time timestamptz NULL, break_date date NOT NULL, pause_time timestamptz NULL, resume_time timestamptz NULL, time_remaining_at_pause int4 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, break_type public."break_type_enum" NOT NULL, duration_minutes int4 NULL, pause_used bool DEFAULT false NULL, CONSTRAINT break_sessions_break_type_check CHECK ((break_type = ANY (ARRAY['Morning'::break_type_enum, 'Lunch'::break_type_enum, 'Afternoon'::break_type_enum, 'NightFirst'::break_type_enum, 'NightMeal'::break_type_enum, 'NightSecond'::break_type_enum]))), CONSTRAINT break_sessions_pkey PRIMARY KEY (id));
CREATE INDEX idx_break_sessions_agent_user_id ON public.break_sessions USING btree (agent_user_id);
CREATE INDEX idx_break_sessions_break_date ON public.break_sessions USING btree (break_date);
CREATE INDEX idx_break_sessions_break_type ON public.break_sessions USING btree (break_type);

-- Table Triggers

create trigger update_break_sessions_updated_at before
update
    on
    public.break_sessions for each row execute function update_updated_at_column();
create trigger notify_break_sessions_changes after
insert
    or
delete
    or
update
    on
    public.break_sessions for each row execute function notify_break_sessions_changes();


-- public.floor_plans definition

-- Drop table

-- DROP TABLE public.floor_plans;

CREATE TABLE public.floor_plans ( id serial4 NOT NULL, "name" text NOT NULL, building text NULL, svg_url text NULL, svg_path text NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT floor_plans_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_floor_plans_updated_at before
update
    on
    public.floor_plans for each row execute function update_updated_at_column();


-- public.inventory_medical_categories definition

-- Drop table

-- DROP TABLE public.inventory_medical_categories;

CREATE TABLE public.inventory_medical_categories ( id serial4 NOT NULL, item_type public."item_type_medical" NOT NULL, "name" varchar(100) NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT inventory_medical_categories_item_type_name_key UNIQUE (item_type, name), CONSTRAINT inventory_medical_categories_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_inventory_medical_categories_updated_at before
update
    on
    public.inventory_medical_categories for each row execute function update_updated_at_column();


-- public.inventory_medical_suppliers definition

-- Drop table

-- DROP TABLE public.inventory_medical_suppliers;

CREATE TABLE public.inventory_medical_suppliers ( id serial4 NOT NULL, "name" varchar(255) NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT inventory_medical_suppliers_name_key UNIQUE (name), CONSTRAINT inventory_medical_suppliers_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_inventory_medical_suppliers_updated_at before
update
    on
    public.inventory_medical_suppliers for each row execute function update_updated_at_column();


-- public.meetings definition

-- Drop table

-- DROP TABLE public.meetings;

CREATE TABLE public.meetings ( id serial4 NOT NULL, agent_user_id int4 NOT NULL, title varchar(255) NOT NULL, description text NULL, start_time timestamptz DEFAULT now() NULL, end_time timestamptz DEFAULT now() NULL, duration_minutes int4 NOT NULL, meeting_type varchar(50) NOT NULL, status varchar(50) DEFAULT 'scheduled'::character varying NOT NULL, is_in_meeting bool DEFAULT false NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, actual_start_time timestamptz DEFAULT now() NULL, CONSTRAINT meetings_meeting_type_check CHECK (((meeting_type)::text = ANY (ARRAY[('video'::character varying)::text, ('audio'::character varying)::text, ('in-person'::character varying)::text]))), CONSTRAINT meetings_pkey PRIMARY KEY (id), CONSTRAINT meetings_status_check CHECK (((status)::text = ANY (ARRAY[('scheduled'::character varying)::text, ('in-progress'::character varying)::text, ('completed'::character varying)::text, ('cancelled'::character varying)::text]))));
CREATE INDEX idx_meetings_agent_user_id ON public.meetings USING btree (agent_user_id);
CREATE INDEX idx_meetings_created_at ON public.meetings USING btree (created_at);
CREATE INDEX idx_meetings_start_time ON public.meetings USING btree (start_time);
CREATE INDEX idx_meetings_status ON public.meetings USING btree (status);

-- Table Triggers

create trigger trigger_update_meetings_updated_at before
update
    on
    public.meetings for each row execute function update_meetings_updated_at();


-- public.roles definition

-- Drop table

-- DROP TABLE public.roles;

CREATE TABLE public.roles ( id serial4 NOT NULL, "name" text NOT NULL, description text NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT roles_name_key UNIQUE (name), CONSTRAINT roles_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_roles_updated_at before
update
    on
    public.roles for each row execute function update_updated_at_column();


-- public.ticket_categories definition

-- Drop table

-- DROP TABLE public.ticket_categories;

CREATE TABLE public.ticket_categories ( id serial4 NOT NULL, "name" varchar(100) NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT ticket_categories_name_key UNIQUE (name), CONSTRAINT ticket_categories_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_ticket_categories_updated_at before
update
    on
    public.ticket_categories for each row execute function update_updated_at_column();


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users ( id serial4 NOT NULL, email text NOT NULL, user_type public."user_type_enum" NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT users_email_key UNIQUE (email), CONSTRAINT users_pkey PRIMARY KEY (id));
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_user_type ON public.users USING btree (user_type);

-- Table Triggers

create trigger update_users_updated_at before
update
    on
    public.users for each row execute function update_updated_at_column();


-- public.activity_data definition

-- Drop table

-- DROP TABLE public.activity_data;

CREATE TABLE public.activity_data ( id serial4 NOT NULL, user_id int4 NOT NULL, is_currently_active bool DEFAULT false NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, today_active_seconds int4 DEFAULT 0 NULL, today_inactive_seconds int4 DEFAULT 0 NULL, last_session_start timestamptz NULL, today_date date DEFAULT CURRENT_DATE NOT NULL, CONSTRAINT activity_data_pkey PRIMARY KEY (id), CONSTRAINT activity_data_user_date_unique UNIQUE (user_id, today_date), CONSTRAINT activity_data_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_activity_data_updated_at before
update
    on
    public.activity_data for each row execute function update_updated_at_column();


-- public.clinic_logs definition

-- Drop table

-- DROP TABLE public.clinic_logs;

CREATE TABLE public.clinic_logs ( id serial4 NOT NULL, patient_id int4 NOT NULL, additional_notes text NULL, issued_by varchar(255) NOT NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, patient_diagnose text NOT NULL, CONSTRAINT clinic_logs_pkey PRIMARY KEY (id), CONSTRAINT clinic_logs_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.users(id) ON DELETE CASCADE);


-- public.internal definition

-- Drop table

-- DROP TABLE public.internal;

CREATE TABLE public.internal ( user_id int4 NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT internal_pkey PRIMARY KEY (user_id), CONSTRAINT internal_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_internal_updated_at before
update
    on
    public.internal for each row execute function update_updated_at_column();


-- public.internal_roles definition

-- Drop table

-- DROP TABLE public.internal_roles;

CREATE TABLE public.internal_roles ( id serial4 NOT NULL, internal_user_id int4 NOT NULL, role_id int4 NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT internal_roles_pkey PRIMARY KEY (id), CONSTRAINT unique_internal_role_assignment UNIQUE (internal_user_id, role_id), CONSTRAINT internal_roles_internal_user_id_fkey FOREIGN KEY (internal_user_id) REFERENCES public.internal(user_id) ON DELETE CASCADE, CONSTRAINT internal_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_internal_roles_updated_at before
update
    on
    public.internal_roles for each row execute function update_updated_at_column();


-- public.inventory_medical definition

-- Drop table

-- DROP TABLE public.inventory_medical;

CREATE TABLE public.inventory_medical ( id serial4 NOT NULL, item_type public."item_type_medical" NOT NULL, "name" varchar(255) NOT NULL, description text NULL, category_id int4 NULL, stock int4 DEFAULT 0 NOT NULL, reorder_level int4 DEFAULT 10 NOT NULL, price numeric(10, 2) NULL, supplier_id int4 NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT inventory_medical_pkey PRIMARY KEY (id), CONSTRAINT inventory_medical_reorder_level_check CHECK ((reorder_level >= 0)), CONSTRAINT inventory_medical_stock_check CHECK ((stock >= 0)), CONSTRAINT inventory_medical_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.inventory_medical_categories(id) ON DELETE RESTRICT, CONSTRAINT inventory_medical_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.inventory_medical_suppliers(id) ON DELETE SET NULL);

-- Table Triggers

create trigger update_inventory_medical_updated_at before
update
    on
    public.inventory_medical for each row execute function update_updated_at_column();


-- public.members definition

-- Drop table

-- DROP TABLE public.members;

CREATE TABLE public.members ( id serial4 NOT NULL, company text NOT NULL, address text NULL, phone text NULL, logo text NULL, service public."member_service_enum" NULL, status public."member_status_enum" NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, badge_color text NULL, country text NULL, website _text NULL, company_id uuid NOT NULL, created_by int4 NULL, updated_by int4 NULL, CONSTRAINT members_company_id_key UNIQUE (company_id), CONSTRAINT members_pkey PRIMARY KEY (id), CONSTRAINT members_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL, CONSTRAINT members_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL);
CREATE INDEX idx_members_company ON public.members USING btree (company);
CREATE INDEX idx_members_country ON public.members USING btree (country);
CREATE INDEX idx_members_listing ON public.members USING btree (status, country) INCLUDE (id, company, service, badge_color);
CREATE INDEX idx_members_status ON public.members USING btree (status);

-- Table Triggers

create trigger update_members_updated_at before
update
    on
    public.members for each row execute function update_updated_at_column();
create trigger trigger_member_changes after
insert
    or
delete
    or
update
    on
    public.members for each row execute function notify_member_changes();


-- public.members_activity_log definition

-- Drop table

-- DROP TABLE public.members_activity_log;

CREATE TABLE public.members_activity_log ( id serial4 NOT NULL, member_id int4 NOT NULL, field_name text NOT NULL, "action" text NOT NULL, old_value text NULL, new_value text NULL, user_id int4 NULL, created_at timestamptz DEFAULT now() NULL, CONSTRAINT members_activity_log_action_check CHECK ((action = ANY (ARRAY['created'::text, 'set'::text, 'updated'::text, 'removed'::text, 'selected'::text, 'deselected'::text]))), CONSTRAINT members_activity_log_pkey PRIMARY KEY (id), CONSTRAINT fk_members_activity_log_member FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE, CONSTRAINT fk_members_activity_log_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL);
CREATE INDEX idx_members_activity_log_action ON public.members_activity_log USING btree (action);
CREATE INDEX idx_members_activity_log_created_at ON public.members_activity_log USING btree (created_at);
CREATE INDEX idx_members_activity_log_member_id ON public.members_activity_log USING btree (member_id);
CREATE INDEX idx_members_activity_log_user_id ON public.members_activity_log USING btree (user_id);

-- Table Triggers

create trigger notify_member_activity_changes after
insert
    or
delete
    or
update
    on
    public.members_activity_log for each row execute function notify_member_activity_changes();


-- public.notifications definition

-- Drop table

-- DROP TABLE public.notifications;

CREATE TABLE public.notifications ( id serial4 NOT NULL, user_id int4 NOT NULL, category text NOT NULL, "type" text NOT NULL, title text NOT NULL, message text NOT NULL, payload jsonb NULL, is_read bool DEFAULT false NULL, created_at timestamptz DEFAULT now() NULL, CONSTRAINT notifications_pkey PRIMARY KEY (id), CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_notifications_user_created ON public.notifications USING btree (user_id, created_at DESC);

-- Table Triggers

create trigger trg_notify_notification after
insert
    on
    public.notifications for each row execute function notify_notification();


-- public.personal_info definition

-- Drop table

-- DROP TABLE public.personal_info;

CREATE TABLE public.personal_info ( id serial4 NOT NULL, user_id int4 NOT NULL, first_name text NOT NULL, middle_name text NULL, last_name text NOT NULL, nickname text NULL, profile_picture text NULL, phone text NULL, birthday date NULL, city text NULL, address text NULL, gender public."gender_enum" NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT personal_info_pkey PRIMARY KEY (id), CONSTRAINT personal_info_user_id_key UNIQUE (user_id), CONSTRAINT personal_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_personal_info_user_id ON public.personal_info USING btree (user_id);

-- Table Triggers

create trigger update_personal_info_updated_at before
update
    on
    public.personal_info for each row execute function update_updated_at_column();
create trigger notify_personal_info_changes after
insert
    or
delete
    or
update
    on
    public.personal_info for each row execute function notify_personal_info_changes();


-- public.productivity_scores definition

-- Drop table

-- DROP TABLE public.productivity_scores;

CREATE TABLE public.productivity_scores ( id serial4 NOT NULL, user_id int4 NOT NULL, month_year varchar(7) NOT NULL, productivity_score numeric(5, 2) NOT NULL, total_active_seconds int4 DEFAULT 0 NULL, total_inactive_seconds int4 DEFAULT 0 NULL, total_seconds int4 DEFAULT 0 NULL, active_percentage numeric(5, 2) DEFAULT 0.00 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT productivity_scores_pkey PRIMARY KEY (id), CONSTRAINT productivity_scores_user_id_month_year_key UNIQUE (user_id, month_year), CONSTRAINT productivity_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_productivity_scores_month_top ON public.productivity_scores USING btree (month_year, total_active_seconds DESC) INCLUDE (user_id, active_percentage, total_seconds, total_inactive_seconds, productivity_score);

-- Table Triggers

create trigger update_productivity_scores_updated_at before
update
    on
    public.productivity_scores for each row execute function update_updated_at_column();


-- public.stations definition

-- Drop table

-- DROP TABLE public.stations;

CREATE TABLE public.stations ( id serial4 NOT NULL, station_id varchar(50) NOT NULL, assigned_user_id int4 NULL, asset_id varchar(50) NULL, floor_plan_id int4 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT stations_pkey PRIMARY KEY (id), CONSTRAINT stations_station_id_key UNIQUE (station_id), CONSTRAINT unique_user_per_station UNIQUE (assigned_user_id), CONSTRAINT stations_assigned_user_id_fkey FOREIGN KEY (assigned_user_id) REFERENCES public.users(id) ON DELETE SET NULL, CONSTRAINT stations_floor_plan_id_fkey FOREIGN KEY (floor_plan_id) REFERENCES public.floor_plans(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_stations_updated_at before
update
    on
    public.stations for each row execute function update_updated_at_column();


-- public.talent_pool definition

-- Drop table

-- DROP TABLE public.talent_pool;

CREATE TABLE public.talent_pool ( id serial4 NOT NULL, applicant_id uuid NOT NULL, interested_clients _int4 NULL, last_contact_date timestamptz NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT talent_pool_pkey PRIMARY KEY (id), CONSTRAINT talent_pool_applicant_id_fkey FOREIGN KEY (applicant_id) REFERENCES public.bpoc_recruits(applicant_id));
CREATE INDEX idx_talent_pool_applicant_id ON public.talent_pool USING btree (applicant_id);
CREATE INDEX idx_talent_pool_interested_clients ON public.talent_pool USING gin (interested_clients);


-- public.tickets definition

-- Drop table

-- DROP TABLE public.tickets;

CREATE TABLE public.tickets ( id serial4 NOT NULL, ticket_id varchar(50) NOT NULL, user_id int4 NOT NULL, concern text NOT NULL, details text NULL, status public."ticket_status_enum" DEFAULT 'For Approval'::ticket_status_enum NOT NULL, resolved_by int4 NULL, resolved_at timestamptz DEFAULT now() NULL, created_at timestamptz DEFAULT now() NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL, "position" int4 DEFAULT 0 NOT NULL, category_id int4 NULL, supporting_files _text DEFAULT '{}'::text[] NULL, file_count int4 DEFAULT 0 NULL, role_id int4 NULL, clear bool DEFAULT false NOT NULL, CONSTRAINT check_file_count CHECK (((file_count = array_length(supporting_files, 1)) OR ((file_count = 0) AND (supporting_files = '{}'::text[])))), CONSTRAINT tickets_pkey PRIMARY KEY (id), CONSTRAINT tickets_ticket_id_key UNIQUE (ticket_id), CONSTRAINT tickets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.ticket_categories(id) ON DELETE SET NULL, CONSTRAINT tickets_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id) ON DELETE SET NULL, CONSTRAINT tickets_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL, CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_tickets_active ON public.tickets USING btree (status, "position") WHERE (status <> 'Closed'::ticket_status_enum);
CREATE INDEX idx_tickets_clear_status ON public.tickets USING btree (clear, status);
CREATE INDEX idx_tickets_closed_clear ON public.tickets USING btree (resolved_at, clear) WHERE (status = 'Closed'::ticket_status_enum);
CREATE INDEX idx_tickets_created_at ON public.tickets USING btree (created_at);
CREATE INDEX idx_tickets_resolved_at ON public.tickets USING btree (resolved_at);
CREATE INDEX idx_tickets_status ON public.tickets USING btree (status);
CREATE INDEX idx_tickets_status_clear ON public.tickets USING btree (status, clear);
CREATE INDEX idx_tickets_status_role ON public.tickets USING btree (status, role_id);
CREATE INDEX idx_tickets_user_id ON public.tickets USING btree (user_id);

-- Table Triggers

create trigger update_tickets_updated_at before
update
    on
    public.tickets for each row execute function update_updated_at_column();
create trigger notify_ticket_insert after
insert
    on
    public.tickets for each row execute function notify_ticket_change();
create trigger notify_ticket_update after
update
    on
    public.tickets for each row execute function notify_ticket_change();
create trigger notify_ticket_delete after
delete
    on
    public.tickets for each row execute function notify_ticket_change();
create trigger auto_generate_ticket_id before
insert
    on
    public.tickets for each row
    when (((new.ticket_id is null)
        or ((new.ticket_id)::text = ''::text))) execute function generate_ticket_id();


-- public.weekly_activity_summary definition

-- Drop table

-- DROP TABLE public.weekly_activity_summary;

CREATE TABLE public.weekly_activity_summary ( id serial4 NOT NULL, user_id int4 NOT NULL, week_start_date date NOT NULL, week_end_date date NOT NULL, total_active_seconds int4 DEFAULT 0 NULL, total_inactive_seconds int4 DEFAULT 0 NULL, total_days_active int4 DEFAULT 0 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT weekly_activity_summary_pkey PRIMARY KEY (id), CONSTRAINT weekly_activity_summary_user_id_week_start_date_key UNIQUE (user_id, week_start_date), CONSTRAINT weekly_activity_summary_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_weekly_activity_updated_at before
update
    on
    public.weekly_activity_summary for each row execute function update_updated_at_column();


-- public.clinic_log_medicines definition

-- Drop table

-- DROP TABLE public.clinic_log_medicines;

CREATE TABLE public.clinic_log_medicines ( id serial4 NOT NULL, clinic_log_id int4 NOT NULL, "name" varchar(255) NOT NULL, quantity int4 NOT NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, inventory_item_id int4 NULL, CONSTRAINT clinic_log_medicines_pkey PRIMARY KEY (id), CONSTRAINT clinic_log_medicines_quantity_check CHECK ((quantity > 0)), CONSTRAINT clinic_log_medicines_clinic_log_id_fkey FOREIGN KEY (clinic_log_id) REFERENCES public.clinic_logs(id) ON DELETE CASCADE, CONSTRAINT clinic_log_medicines_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_medical(id) ON DELETE RESTRICT);

-- Table Triggers

create trigger update_clinic_log_medicines_updated_at before
update
    on
    public.clinic_log_medicines for each row execute function update_updated_at_column();
create trigger update_inventory_on_medicine_usage after
insert
    on
    public.clinic_log_medicines for each row execute function update_inventory_stock_on_clinic_log();


-- public.clinic_log_supplies definition

-- Drop table

-- DROP TABLE public.clinic_log_supplies;

CREATE TABLE public.clinic_log_supplies ( id serial4 NOT NULL, clinic_log_id int4 NOT NULL, "name" varchar(255) NOT NULL, quantity int4 NOT NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, inventory_item_id int4 NULL, CONSTRAINT clinic_log_supplies_pkey PRIMARY KEY (id), CONSTRAINT clinic_log_supplies_quantity_check CHECK ((quantity > 0)), CONSTRAINT clinic_log_supplies_clinic_log_id_fkey FOREIGN KEY (clinic_log_id) REFERENCES public.clinic_logs(id) ON DELETE CASCADE, CONSTRAINT clinic_log_supplies_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_medical(id) ON DELETE RESTRICT);

-- Table Triggers

create trigger update_clinic_log_supplies_updated_at before
update
    on
    public.clinic_log_supplies for each row execute function update_updated_at_column();
create trigger update_inventory_on_supply_usage after
insert
    on
    public.clinic_log_supplies for each row execute function update_inventory_stock_on_clinic_log();


-- public.departments definition

-- Drop table

-- DROP TABLE public.departments;

CREATE TABLE public.departments ( id serial4 NOT NULL, "name" text NOT NULL, description text NULL, member_id int4 NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT departments_pkey PRIMARY KEY (id), CONSTRAINT unique_department_id_member UNIQUE (id, member_id), CONSTRAINT unique_department_per_member UNIQUE (name, member_id), CONSTRAINT departments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL);

-- Table Triggers

create trigger update_departments_updated_at before
update
    on
    public.departments for each row execute function update_updated_at_column();


-- public.floor_plan_members definition

-- Drop table

-- DROP TABLE public.floor_plan_members;

CREATE TABLE public.floor_plan_members ( id serial4 NOT NULL, floor_plan_id int4 NOT NULL, member_id int4 NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT floor_plan_members_floor_plan_id_member_id_key UNIQUE (floor_plan_id, member_id), CONSTRAINT floor_plan_members_pkey PRIMARY KEY (id), CONSTRAINT floor_plan_members_floor_plan_id_fkey FOREIGN KEY (floor_plan_id) REFERENCES public.floor_plans(id) ON DELETE CASCADE, CONSTRAINT floor_plan_members_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL);


-- public.member_comments definition

-- Drop table

-- DROP TABLE public.member_comments;

CREATE TABLE public.member_comments ( id serial4 NOT NULL, member_id int4 NOT NULL, user_id int4 NOT NULL, "comment" text NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT member_comments_pkey PRIMARY KEY (id), CONSTRAINT member_comments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE, CONSTRAINT member_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_member_comments_created_at ON public.member_comments USING btree (created_at);
CREATE INDEX idx_member_comments_member_id ON public.member_comments USING btree (member_id);
CREATE INDEX idx_member_comments_member_id_created_at ON public.member_comments USING btree (member_id, created_at DESC);
CREATE INDEX idx_member_comments_user_id ON public.member_comments USING btree (user_id);

-- Table Triggers

create trigger notify_member_comment_insert after
insert
    on
    public.member_comments for each row execute function notify_member_comment_changes();
create trigger notify_member_comment_update after
update
    on
    public.member_comments for each row execute function notify_member_comment_changes();
create trigger notify_member_comment_delete after
delete
    on
    public.member_comments for each row execute function notify_member_comment_changes();
create trigger update_member_comments_updated_at before
update
    on
    public.member_comments for each row execute function update_updated_at_column();


-- public.recruits_comments definition

-- Drop table

-- DROP TABLE public.recruits_comments;

CREATE TABLE public.recruits_comments ( id serial4 NOT NULL, "comment" text NOT NULL, created_by int4 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, comment_type varchar(50) DEFAULT 'general'::character varying NULL, talent_pool_id int4 NULL, CONSTRAINT recruits_comments_pkey PRIMARY KEY (id), CONSTRAINT recruits_comments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id), CONSTRAINT recruits_comments_talent_pool_id_fkey FOREIGN KEY (talent_pool_id) REFERENCES public.talent_pool(id) ON DELETE CASCADE);
CREATE INDEX idx_recruits_comments_created_by ON public.recruits_comments USING btree (created_by);
CREATE INDEX idx_recruits_comments_talent_pool_id ON public.recruits_comments USING btree (talent_pool_id);
CREATE INDEX idx_recruits_comments_type ON public.recruits_comments USING btree (comment_type);


-- public.ticket_comments definition

-- Drop table

-- DROP TABLE public.ticket_comments;

CREATE TABLE public.ticket_comments ( id serial4 NOT NULL, ticket_id int4 NOT NULL, user_id int4 NOT NULL, "comment" text NOT NULL, created_at timestamptz DEFAULT now() NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL, CONSTRAINT ticket_comments_pkey PRIMARY KEY (id), CONSTRAINT ticket_comments_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE, CONSTRAINT ticket_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);


-- public.agents definition

-- Drop table

-- DROP TABLE public.agents;

CREATE TABLE public.agents ( user_id int4 NOT NULL, member_id int4 NULL, department_id int4 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, exp_points int4 DEFAULT 0 NULL, CONSTRAINT agents_pkey PRIMARY KEY (user_id), CONSTRAINT agents_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL, CONSTRAINT agents_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL, CONSTRAINT agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_agents_department_member ON public.agents USING btree (department_id, member_id);
CREATE INDEX idx_agents_listing ON public.agents USING btree (department_id, member_id) INCLUDE (user_id, created_at);
CREATE INDEX idx_agents_member_department ON public.agents USING btree (member_id, department_id);
CREATE INDEX idx_agents_member_user ON public.agents USING btree (member_id, user_id);
CREATE INDEX idx_agents_user_department ON public.agents USING btree (user_id, department_id);

-- Table Triggers

create trigger trigger_agent_member_changes after
update
    on
    public.agents for each row execute function notify_agent_member_changes();
create trigger update_agents_updated_at before
update
    on
    public.agents for each row execute function update_updated_at_column();


-- public.clients definition

-- Drop table

-- DROP TABLE public.clients;

CREATE TABLE public.clients ( user_id int4 NOT NULL, member_id int4 NULL, department_id int4 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT clients_pkey PRIMARY KEY (user_id), CONSTRAINT clients_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL, CONSTRAINT clients_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL, CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_clients_member_department ON public.clients USING btree (member_id, department_id);

-- Table Triggers

create trigger trigger_client_member_changes after
update
    on
    public.clients for each row execute function notify_client_member_changes();
create trigger update_clients_updated_at before
update
    on
    public.clients for each row execute function update_updated_at_column();


-- public.job_info definition

-- Drop table

-- DROP TABLE public.job_info;

CREATE TABLE public.job_info ( id serial4 NOT NULL, employee_id varchar(20) NOT NULL, agent_user_id int4 NULL, internal_user_id int4 NULL, job_title text NULL, shift_period text NULL, shift_schedule text NULL, shift_time text NULL, work_setup text NULL, employment_status text NULL, hire_type text NULL, staff_source text NULL, start_date date NULL, exit_date date NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, work_email text NULL, CONSTRAINT chk_job_info_employee_type CHECK ((((agent_user_id IS NOT NULL) AND (internal_user_id IS NULL)) OR ((agent_user_id IS NULL) AND (internal_user_id IS NOT NULL)))), CONSTRAINT job_info_employee_id_key UNIQUE (employee_id), CONSTRAINT job_info_pkey PRIMARY KEY (id), CONSTRAINT job_info_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.agents(user_id) ON DELETE CASCADE, CONSTRAINT job_info_internal_user_id_fkey FOREIGN KEY (internal_user_id) REFERENCES public.internal(user_id) ON DELETE CASCADE);
CREATE INDEX idx_job_info_agent_user ON public.job_info USING btree (agent_user_id);

-- Table Triggers

create trigger update_job_info_updated_at before
update
    on
    public.job_info for each row execute function update_updated_at_column();
create trigger notify_job_info_changes after
insert
    or
delete
    or
update
    on
    public.job_info for each row execute function notify_job_info_changes();



-- DROP FUNCTION public.add_to_talent_pool();

CREATE OR REPLACE FUNCTION public.add_to_talent_pool()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_talent_pool_id int4;
BEGIN
    IF NEW.status = 'passed' AND (OLD.status IS NULL OR OLD.status <> 'passed') THEN
        IF NOT EXISTS (SELECT 1 FROM public.talent_pool WHERE applicant_id = NEW.applicant_id) THEN
            -- Create talent pool row first
            INSERT INTO public.talent_pool (applicant_id, created_at, updated_at)
            VALUES (NEW.applicant_id, NOW(), NOW())
            RETURNING id INTO v_talent_pool_id;

            -- Create comment linked to that talent pool row
            INSERT INTO public.recruits_comments (
                comment, comment_type, created_by, created_at, updated_at, talent_pool_id
            ) VALUES (
                'Added to Talent Pool', 'activity', NULL, NOW(), NOW(), v_talent_pool_id
            );

            RAISE NOTICE 'Applicant % added to talent pool', NEW.applicant_id;
        ELSE
            RAISE NOTICE 'Applicant % already exists in talent pool', NEW.applicant_id;
        END IF;

    ELSIF OLD.status = 'passed' AND NEW.status <> 'passed' THEN
        DELETE FROM public.talent_pool WHERE applicant_id = NEW.applicant_id;
        RAISE NOTICE 'Applicant % removed from talent pool (status changed to: %)', NEW.applicant_id, NEW.status;
    END IF;

    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.armor(bytea);

CREATE OR REPLACE FUNCTION public.armor(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

-- DROP FUNCTION public.armor(bytea, _text, _text);

CREATE OR REPLACE FUNCTION public.armor(bytea, text[], text[])
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

-- DROP FUNCTION public.calculate_break_duration();

CREATE OR REPLACE FUNCTION public.calculate_break_duration()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
      BEGIN
          -- If end_time is being set and start_time exists, calculate duration
          IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
              -- If break was paused, calculate based on pause state
              IF NEW.pause_time IS NOT NULL THEN
                  -- If break was resumed, use normal pause calculation
                  IF NEW.resume_time IS NOT NULL THEN
                      -- Total duration = (pause_time - start_time) + (end_time - resume_time)
                      NEW.duration_minutes = EXTRACT(EPOCH FROM (
                          (NEW.pause_time - NEW.start_time) + 
                          (NEW.end_time - NEW.resume_time)
                      )) / 60;
                  ELSE
                      -- Break was paused but never resumed (auto-ended)
                      -- Use the time from start to pause as the actual break duration
                      NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.pause_time - NEW.start_time)) / 60;
                  END IF;
              ELSE
                  -- Normal calculation for non-paused breaks
                  NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
              END IF;
          END IF;
          RETURN NEW;
      END;
      $function$
;

COMMENT ON FUNCTION public.calculate_break_duration() IS 'Calculates break duration in minutes. For paused breaks that are auto-ended, uses time from start to pause as the actual break duration.';

-- DROP FUNCTION public.calculate_break_windows(int4);

CREATE OR REPLACE FUNCTION public.calculate_break_windows(p_user_id integer)
 RETURNS TABLE(break_type break_type_enum, start_time time without time zone, end_time time without time zone)
 LANGUAGE plpgsql
AS $function$
      DECLARE
          shift_info RECORD;
          shift_start_time TIME;
          shift_end_time TIME;
          is_night_shift BOOLEAN;
      BEGIN
          -- Get agent's actual shift information
          SELECT * INTO shift_info FROM get_agent_shift_info(p_user_id) LIMIT 1;
          
          IF NOT FOUND OR shift_info.shift_time IS NULL THEN
              RETURN; -- No shift configured
          END IF;
          
          -- Parse shift time (e.g., "7:00 AM - 4:00 PM" or "10:00 PM - 7:00 AM")
          shift_start_time := CASE 
              WHEN split_part(shift_info.shift_time, ' - ', 1) LIKE '%PM' AND 
                   NOT split_part(shift_info.shift_time, ' - ', 1) LIKE '12:%PM' THEN
                  (split_part(split_part(shift_info.shift_time, ' - ', 1), ' ', 1)::TIME + INTERVAL '12 hours')::TIME
              WHEN split_part(shift_info.shift_time, ' - ', 1) LIKE '12:%AM' THEN
                  replace(split_part(shift_info.shift_time, ' - ', 1), '12:', '00:')::TIME
              ELSE
                  split_part(split_part(shift_info.shift_time, ' - ', 1), ' ', 1)::TIME
          END;
          
          shift_end_time := CASE 
              WHEN split_part(shift_info.shift_time, ' - ', 2) LIKE '%PM' AND 
                   NOT split_part(shift_info.shift_time, ' - ', 2) LIKE '12:%PM' THEN
                  (split_part(split_part(shift_info.shift_time, ' - ', 2), ' ', 1)::TIME + INTERVAL '12 hours')::TIME
              WHEN split_part(shift_info.shift_time, ' - ', 2) LIKE '12:%PM' THEN
                  (split_part(split_part(shift_info.shift_time, ' - ', 2), ' ', 1)::TIME + INTERVAL '12 hours')::TIME
              ELSE
                  split_part(split_part(shift_info.shift_time, ' - ', 2), ' ', 1)::TIME
          END;
          
          -- Determine if it's a night shift (crosses midnight)
          is_night_shift := shift_start_time > shift_end_time;
          
          -- Return break windows based on shift start time
          -- Morning/First Night break: 2 hours after shift start
          RETURN QUERY SELECT 
              CASE 
                  WHEN shift_info.shift_period = 'Day Shift' THEN 'Morning'::break_type_enum
                  ELSE 'NightFirst'::break_type_enum
              END,
              shift_start_time + INTERVAL '2 hours',
              shift_start_time + INTERVAL '3 hours';
          
          -- Lunch/Night Meal break: 4 hours after shift start
          RETURN QUERY SELECT 
              CASE 
                  WHEN shift_info.shift_period = 'Day Shift' THEN 'Lunch'::break_type_enum
                  ELSE 'NightMeal'::break_type_enum
              END,
              shift_start_time + INTERVAL '4 hours',
              shift_start_time + INTERVAL '7 hours';
          
          -- Afternoon/Second Night break: 7 hours 45 minutes after shift start
          RETURN QUERY SELECT 
              CASE 
                  WHEN shift_info.shift_period = 'Day Shift' THEN 'Afternoon'::break_type_enum
                  ELSE 'NightSecond'::break_type_enum
              END,
              shift_start_time + INTERVAL '7 hours 45 minutes',
              shift_start_time + INTERVAL '8 hours 45 minutes';
      END;
      $function$
;

COMMENT ON FUNCTION public.calculate_break_windows(int4) IS 'Calculates break windows based on agent shift times (force cleaned)';

-- DROP FUNCTION public.can_agent_take_break(int4, break_type_enum);

CREATE OR REPLACE FUNCTION public.can_agent_take_break(p_agent_user_id integer, p_break_type break_type_enum)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
			DECLARE
				break_count INTEGER;
			BEGIN
				-- Check if agent has already used this break type today
				SELECT COUNT(*)
				INTO break_count
				FROM public.break_sessions
				WHERE agent_user_id = p_agent_user_id
				AND break_type = p_break_type
				AND break_date = (NOW() AT TIME ZONE 'Asia/Manila')::date
				AND end_time IS NOT NULL; -- Only count completed breaks
				
				-- Each break type can only be used once per day
				RETURN break_count = 0;
			END;
			$function$
;

-- DROP FUNCTION public.check_break_reminders();

CREATE OR REPLACE FUNCTION public.check_break_reminders()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
            DECLARE
                agent_record RECORD;
                notifications_sent INTEGER := 0;
                check_time TIMESTAMP;
            BEGIN
                check_time := NOW() AT TIME ZONE 'Asia/Manila';

                -- NOTE: Task notifications are now handled by a separate scheduler
                -- This function only handles break-related notifications

                -- Loop through all active agents
                FOR agent_record IN
                    SELECT DISTINCT u.id as user_id
                    FROM users u
                    INNER JOIN agents a ON u.id = a.user_id
                    WHERE u.user_type = 'Agent'
                LOOP
                    -- Check for breaks available soon (15 minutes before)
                    IF is_break_available_soon(agent_record.user_id, 'Morning', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'Morning');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_soon(agent_record.user_id, 'Lunch', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'Lunch');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_soon(agent_record.user_id, 'Afternoon', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'Afternoon');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for night shift breaks available soon
                    IF is_break_available_soon(agent_record.user_id, 'NightFirst', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'NightFirst');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_soon(agent_record.user_id, 'NightMeal', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'NightMeal');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_soon(agent_record.user_id, 'NightSecond', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'NightSecond');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for breaks that are currently available/active (ONLY if notification not already sent)
                    IF is_break_available_now(agent_record.user_id, 'Morning', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'Morning', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'Morning');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_now(agent_record.user_id, 'Lunch', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'Lunch', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'Lunch');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_now(agent_record.user_id, 'Afternoon', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'Afternoon', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'Afternoon');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for night shift breaks currently available (ONLY if notification not already sent)
                    IF is_break_available_now(agent_record.user_id, 'NightFirst', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'NightFirst', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'NightFirst');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_now(agent_record.user_id, 'NightMeal', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'NightMeal', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'NightMeal');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_now(agent_record.user_id, 'NightSecond', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'NightSecond', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'NightSecond');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for missed breaks (30 minutes after break becomes available)
                    -- This will send "You have not taken your [Break] yet!" notifications
                    IF is_break_missed(agent_record.user_id, 'Morning', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'Morning');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_missed(agent_record.user_id, 'Lunch', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'Lunch');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_missed(agent_record.user_id, 'Afternoon', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'Afternoon');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for night shift missed breaks
                    IF is_break_missed(agent_record.user_id, 'NightFirst', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'NightFirst');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_missed(agent_record.user_id, 'NightMeal', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'NightMeal');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_missed(agent_record.user_id, 'NightSecond', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'NightSecond');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for break window ending soon (15 minutes before break window expires)
                    -- This prevents generic "Break ending soon" notifications
                    IF is_break_window_ending_soon(agent_record.user_id, 'Morning', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'Morning');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_window_ending_soon(agent_record.user_id, 'Lunch', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'Lunch');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_window_ending_soon(agent_record.user_id, 'Afternoon', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'Afternoon');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for night shift break windows ending soon
                    IF is_break_window_ending_soon(agent_record.user_id, 'NightFirst', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'NightFirst');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_window_ending_soon(agent_record.user_id, 'NightMeal', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'NightMeal');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_window_ending_soon(agent_record.user_id, 'NightSecond', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'NightSecond');
                        notifications_sent := notifications_sent + 1;
                    END IF;
                END LOOP;

                RETURN notifications_sent;
            END;
            $function$
;

-- DROP FUNCTION public.create_break_reminder_notification(int4, text, break_type_enum);

CREATE OR REPLACE FUNCTION public.create_break_reminder_notification(p_agent_user_id integer, p_notification_type text, p_break_type break_type_enum DEFAULT NULL::break_type_enum)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
            DECLARE
                notif_category TEXT := 'break';
                notif_type TEXT := 'info';
                title_text TEXT;
                message_text TEXT;
                payload_data JSONB;
                break_name TEXT;
                current_time_manila TIMESTAMP;
                last_notification_time TIMESTAMP;
                minutes_since_last_notification INTEGER;
                detected_break_type break_type_enum;
            BEGIN
                -- Get current Manila time for logic calculations
                current_time_manila := NOW() AT TIME ZONE 'Asia/Manila';

                -- For ending_soon, detect the current break type based on time and break windows
                IF p_notification_type = 'ending_soon' AND p_break_type IS NULL THEN
                    -- Find which break window is ending soon by checking all break windows
                    SELECT bw.break_type INTO detected_break_type
                    FROM calculate_break_windows(p_agent_user_id) bw
                    WHERE bw.end_time > (current_time_manila::TIME - INTERVAL '17 minutes')
                    AND bw.end_time <= (current_time_manila::TIME + INTERVAL '2 minutes')
                    ORDER BY bw.end_time ASC
                    LIMIT 1;
                    
                    -- If we found a break window ending soon, use it
                    IF detected_break_type IS NOT NULL THEN
                        p_break_type := detected_break_type;
                    END IF;
                END IF;

                -- Determine break name for display
                break_name := CASE p_break_type
                    WHEN 'Morning' THEN 'Morning break'
                    WHEN 'Lunch' THEN 'Lunch break'
                    WHEN 'Afternoon' THEN 'Afternoon break'
                    WHEN 'NightFirst' THEN 'First night break'
                    WHEN 'NightMeal' THEN 'Night meal break'
                    WHEN 'NightSecond' THEN 'Second night break'
                    ELSE 'Break'
                END;

                -- Set notification content based on type
                IF p_notification_type = 'available_soon' THEN
                    title_text := break_name || ' available soon';
                    message_text := 'Your ' || break_name || ' will be available in 15 minutes';
                    notif_type := 'info';
                    payload_data := jsonb_build_object(
                        'reminder_type', 'available_soon',
                        'break_type', p_break_type,
                        'action_url', '/status/breaks'
                    );
                ELSIF p_notification_type = 'available_now' THEN
                    title_text := break_name || ' is now available';
                    message_text := 'Your ' || break_name || ' is now available! You can take it now.';
                    notif_type := 'success';
                    payload_data := jsonb_build_object(
                        'reminder_type', 'available_now',
                        'break_type', p_break_type,
                        'action_url', '/status/breaks'
                    );
                ELSIF p_notification_type = 'ending_soon' THEN
                    title_text := break_name || ' ending soon';
                    -- FIXED: More accurate message since the actual window is 14-16 minutes
                    message_text := 'Your ' || break_name || ' will end soon';
                    notif_type := 'warning';
                    payload_data := jsonb_build_object(
                        'reminder_type', 'ending_soon',
                        'break_type', p_break_type,
                        'action_url', '/status/breaks'
                    );
                ELSIF p_notification_type = 'missed_break' THEN
                    title_text := 'You have not taken your ' || break_name || ' yet!';
                    message_text := 'Your ' || break_name || ' was available but you haven''t taken it yet. Please take your break soon.';
                    notif_type := 'warning';
                    payload_data := jsonb_build_object(
                        'reminder_type', 'missed_break',
                        'break_type', p_break_type,
                        'action_url', '/status/breaks'
                    );
                ELSE
                    RETURN; -- Invalid notification type
                END IF;

                -- FIXED: Enhanced duplicate prevention logic
                -- Check for similar notification in the last 60 minutes using UTC timestamps
                SELECT MAX(created_at) INTO last_notification_time
                FROM notifications
                WHERE user_id = p_agent_user_id
                AND category = notif_category
                AND title = title_text
                AND created_at > (NOW() - INTERVAL '60 minutes');

                -- If a recent notification exists, check if enough time has passed
                IF last_notification_time IS NOT NULL THEN
                    -- Calculate minutes since last notification
                    minutes_since_last_notification := EXTRACT(EPOCH FROM (NOW() - last_notification_time)) / 60;
                    
                    -- Different cooldown periods for different notification types
                    IF p_notification_type = 'available_soon' THEN
                        -- Available soon: Only send once per 15-minute window
                        IF minutes_since_last_notification < 15 THEN
                            RETURN; -- Too soon, don't send
                        END IF;
                    ELSIF p_notification_type = 'available_now' THEN
                        -- Available now: Only send once per break window
                        IF minutes_since_last_notification < 60 THEN
                            RETURN; -- Too soon, don't send
                        END IF;
                    ELSIF p_notification_type = 'ending_soon' THEN
                        -- Ending soon: Only send once per 15-minute window
                        IF minutes_since_last_notification < 15 THEN
                            RETURN; -- Too soon, don't send
                        END IF;
                    ELSIF p_notification_type = 'missed_break' THEN
                        -- Missed break: Only send once per 30-minute reminder cycle
                        IF minutes_since_last_notification < 30 THEN
                            RETURN; -- Too soon, don't send
                        END IF;
                    END IF;
                END IF;

                -- Insert the notification (database will use default UTC timestamp)
                INSERT INTO notifications (user_id, category, type, title, message, payload)
                VALUES (p_agent_user_id, notif_category, notif_type, title_text, message_text, payload_data);
            END;
            $function$
;

COMMENT ON FUNCTION public.create_break_reminder_notification(int4, text, break_type_enum) IS 'Fixed: Now properly detects break types for ending_soon notifications';

-- DROP FUNCTION public.create_break_status_notification();

CREATE OR REPLACE FUNCTION public.create_break_status_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  title_text text;
  message_text text;
  notif_type text := 'info';
BEGIN
  IF TG_OP = 'INSERT' THEN
    title_text := 'Break started';
    message_text := format('%s break started', NEW.break_type);
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.end_time IS NOT NULL AND (OLD.end_time IS NULL OR NEW.end_time <> OLD.end_time) THEN
      title_text := 'Break ended';
      message_text := format('%s break completed (%s min)', NEW.break_type, COALESCE(NEW.duration_minutes, 0));
      notif_type := 'success';
    ELSIF NEW.pause_time IS NOT NULL AND (OLD.pause_time IS DISTINCT FROM NEW.pause_time) THEN
      title_text := 'Break paused';
      message_text := format('%s break paused', NEW.break_type);
      notif_type := 'warning';
    ELSIF NEW.resume_time IS NOT NULL AND (OLD.resume_time IS DISTINCT FROM NEW.resume_time) THEN
      title_text := 'Break resumed';
      message_text := format('%s break resumed', NEW.break_type);
    ELSE
      RETURN NEW;
    END IF;
  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (user_id, category, type, title, message, payload)
  VALUES (
    NEW.agent_user_id,
    'break',
    notif_type,
    title_text,
    message_text,
    json_build_object('break_type', NEW.break_type, 'break_session_id', NEW.id, 'break_date', NEW.break_date, 'action_url', '/status/breaks')
  );
  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.crypt(text, text);

CREATE OR REPLACE FUNCTION public.crypt(text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_crypt$function$
;

-- DROP FUNCTION public.dearmor(text);

CREATE OR REPLACE FUNCTION public.dearmor(text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_dearmor$function$
;

-- DROP FUNCTION public.decrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.decrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt$function$
;

-- DROP FUNCTION public.decrypt_iv(bytea, bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.decrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt_iv$function$
;

-- DROP FUNCTION public.digest(bytea, text);

CREATE OR REPLACE FUNCTION public.digest(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

-- DROP FUNCTION public.digest(text, text);

CREATE OR REPLACE FUNCTION public.digest(text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

-- DROP FUNCTION public.encrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.encrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt$function$
;

-- DROP FUNCTION public.encrypt_iv(bytea, bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.encrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt_iv$function$
;

-- DROP FUNCTION public.gen_random_bytes(int4);

CREATE OR REPLACE FUNCTION public.gen_random_bytes(integer)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_random_bytes$function$
;

-- DROP FUNCTION public.gen_random_uuid();

CREATE OR REPLACE FUNCTION public.gen_random_uuid()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE
AS '$libdir/pgcrypto', $function$pg_random_uuid$function$
;

-- DROP FUNCTION public.gen_salt(text, int4);

CREATE OR REPLACE FUNCTION public.gen_salt(text, integer)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt_rounds$function$
;

-- DROP FUNCTION public.gen_salt(text);

CREATE OR REPLACE FUNCTION public.gen_salt(text)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt$function$
;

-- DROP FUNCTION public.generate_ticket_id();

CREATE OR REPLACE FUNCTION public.generate_ticket_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.ticket_id := 'TKT-' || LPAD(nextval('ticket_id_seq')::text, 6, '0');
  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.get_active_meeting(int4);

CREATE OR REPLACE FUNCTION public.get_active_meeting(p_user_id integer)
 RETURNS TABLE(id integer, title character varying, description text, start_time timestamp with time zone, end_time timestamp with time zone, duration_minutes integer, meeting_type character varying, status character varying, is_in_meeting boolean, actual_start_time timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.description,
        m.start_time,
        m.end_time,
        m.duration_minutes,
        m.meeting_type,
        m.status,
        m.is_in_meeting,
        m.actual_start_time
    FROM meetings m
    WHERE m.agent_user_id = p_user_id
    AND m.status = 'in-progress'
    ORDER BY m.created_at DESC
    LIMIT 1;
END;
$function$
;

-- DROP FUNCTION public.get_agent_daily_breaks(int4);

CREATE OR REPLACE FUNCTION public.get_agent_daily_breaks(p_agent_user_id integer)
 RETURNS TABLE(break_type break_type_enum, break_count integer, total_minutes integer, can_take_break boolean)
 LANGUAGE plpgsql
AS $function$
			BEGIN
				RETURN QUERY
				WITH break_types AS (
					SELECT unnest(enum_range(NULL::break_type_enum)) AS bt
				),
				today_breaks AS (
					SELECT 
						bs.break_type,
						COUNT(*) as break_count,
						COALESCE(SUM(bs.duration_minutes), 0) as total_minutes
					FROM public.break_sessions bs
					WHERE bs.agent_user_id = p_agent_user_id
					AND bs.break_date = (NOW() AT TIME ZONE 'Asia/Manila')::date
					AND bs.end_time IS NOT NULL
					GROUP BY bs.break_type
				)
				SELECT 
					bt.bt as break_type,
					COALESCE(tb.break_count, 0)::INTEGER as break_count,
					COALESCE(tb.total_minutes, 0)::INTEGER as total_minutes,
					(COALESCE(tb.break_count, 0) = 0) as can_take_break
				FROM break_types bt
				LEFT JOIN today_breaks tb ON bt.bt = tb.break_type
				ORDER BY bt.bt;
			END;
			$function$
;

-- DROP FUNCTION public.get_agent_shift_info(int4);

CREATE OR REPLACE FUNCTION public.get_agent_shift_info(p_agent_user_id integer)
 RETURNS TABLE(user_id integer, shift_time text, shift_period text, shift_schedule text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        u.id as user_id,
        ji.shift_time,  -- Remove COALESCE - return actual value or NULL
        ji.shift_period, -- Remove COALESCE - return actual value or NULL
        ji.shift_schedule -- Remove COALESCE - return actual value or NULL
    FROM users u
    LEFT JOIN agents a ON u.id = a.user_id
    LEFT JOIN job_info ji ON ji.agent_user_id = a.user_id
    WHERE u.id = p_agent_user_id;
END;
$function$
;

COMMENT ON FUNCTION public.get_agent_shift_info(int4) IS 'Gets agent shift information from job_info table with fallback defaults';

-- DROP FUNCTION public.get_local_break_date(text);

CREATE OR REPLACE FUNCTION public.get_local_break_date(p_timezone text DEFAULT 'Asia/Manila'::text)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE p_timezone)::DATE;
END;
$function$
;

-- DROP FUNCTION public.get_meeting_statistics(int4, int4);

CREATE OR REPLACE FUNCTION public.get_meeting_statistics(p_user_id integer, p_days integer DEFAULT 7)
 RETURNS TABLE(total_meetings integer, completed_meetings integer, cancelled_meetings integer, total_duration_minutes integer, avg_duration_minutes numeric, today_meetings integer, today_duration_minutes integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*)::INTEGER as total_count,
            COUNT(*) FILTER (WHERE status = 'completed')::INTEGER as completed_count,
            COUNT(*) FILTER (WHERE status = 'cancelled')::INTEGER as cancelled_count,
            COALESCE(SUM(duration_minutes), 0)::INTEGER as total_duration,
            COALESCE(AVG(duration_minutes), 0) as avg_duration,
            COUNT(*) FILTER (WHERE DATE(created_at) = now()::date)::INTEGER as today_count,
            COALESCE(SUM(duration_minutes) FILTER (WHERE DATE(created_at) = now()::date), 0)::INTEGER as today_duration
        FROM meetings
        WHERE agent_user_id = p_user_id
        AND created_at >= now()::date - INTERVAL '1 day' * p_days
    )
    SELECT 
        total_count,
        completed_count,
        cancelled_count,
        total_duration,
        avg_duration,
        today_count,
        today_duration
    FROM stats;
END;
$function$
;

-- DROP FUNCTION public.get_user_meetings(int4, int4);

CREATE OR REPLACE FUNCTION public.get_user_meetings(p_user_id integer, p_days integer DEFAULT 7)
 RETURNS TABLE(id integer, title character varying, description text, start_time timestamp with time zone, end_time timestamp with time zone, duration_minutes integer, meeting_type character varying, status character varying, is_in_meeting boolean, actual_start_time timestamp with time zone, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.description,
        m.start_time,
        m.end_time,
        m.duration_minutes,
        m.meeting_type,
        m.status,
        m.is_in_meeting,
        m.actual_start_time,
        m.created_at
    FROM meetings m
    WHERE m.agent_user_id = p_user_id
    AND m.created_at >= now()::date - INTERVAL '1 day' * p_days
    ORDER BY m.created_at DESC;
END;
$function$
;

-- DROP FUNCTION public.hmac(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.hmac(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

-- DROP FUNCTION public.hmac(text, text, text);

CREATE OR REPLACE FUNCTION public.hmac(text, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

-- DROP FUNCTION public.is_break_available_now(int4, break_type_enum, timestamp);

CREATE OR REPLACE FUNCTION public.is_break_available_now(p_agent_user_id integer, p_break_type break_type_enum, p_current_time timestamp without time zone DEFAULT NULL::timestamp without time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
      DECLARE
          shift_info RECORD;
          current_time_manila TIMESTAMP;
          current_time_only TIME;
          break_start_time TIME;
          break_end_time TIME;
          break_already_taken BOOLEAN;
      BEGIN
          -- Get agent's actual shift information
          SELECT * INTO shift_info FROM get_agent_shift_info(p_agent_user_id) LIMIT 1;
          
          IF NOT FOUND OR shift_info.shift_time IS NULL THEN
              RETURN FALSE; -- No shift configured
          END IF;
          
          -- Get current Manila time
          IF p_current_time IS NULL THEN
              current_time_manila := CURRENT_TIMESTAMP + INTERVAL '8 hours';
          ELSE
              current_time_manila := p_current_time;
          END IF;
          
          current_time_only := current_time_manila::TIME;
          
          -- Check if break was already taken today
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = current_time_manila::DATE
              AND end_time IS NOT NULL
          ) INTO break_already_taken;
          
          IF break_already_taken THEN
              RETURN FALSE; -- Break already taken
          END IF;
          
          -- Get break window from calculate_break_windows
          SELECT start_time, end_time INTO break_start_time, break_end_time
          FROM calculate_break_windows(p_agent_user_id)
          WHERE break_type = p_break_type
          LIMIT 1;
          
          IF NOT FOUND THEN
              RETURN FALSE; -- No break window for this type
          END IF;
          
          -- Check if current time is within the break window
          RETURN current_time_only >= break_start_time AND current_time_only < break_end_time;
      END;
      $function$
;

-- DROP FUNCTION public.is_break_available_now_notification_sent(int4, break_type_enum, timestamp);

CREATE OR REPLACE FUNCTION public.is_break_available_now_notification_sent(p_agent_user_id integer, p_break_type break_type_enum, p_check_time timestamp without time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    break_start_time TIMESTAMP;
    break_end_time TIMESTAMP;
    notification_exists BOOLEAN;
BEGIN
    -- Get the break window for the current day
    SELECT 
        (CURRENT_DATE + (SPLIT_PART(ji.shift_time, ' - ', 1))::time) AT TIME ZONE 'Asia/Manila' INTO break_start_time
    FROM job_info ji 
    WHERE ji.agent_user_id = p_agent_user_id;
    
    IF break_start_time IS NULL THEN
        RETURN FALSE; -- No shift configured
    END IF;
    
    -- Calculate break start time based on break type
    CASE p_break_type
        WHEN 'Lunch' THEN
            break_start_time := break_start_time + INTERVAL '4 hours'; -- 4 hours after shift start
            break_end_time := break_start_time + INTERVAL '1 hour'; -- 1 hour break
        WHEN 'Morning' THEN
            break_start_time := break_start_time + INTERVAL '2 hours'; -- 2 hours after shift start
            break_end_time := break_start_time + INTERVAL '15 minutes'; -- 15 minute break
        WHEN 'Afternoon' THEN
            break_start_time := break_start_time + INTERVAL '6 hours'; -- 6 hours after shift start
            break_end_time := break_start_time + INTERVAL '15 minutes'; -- 15 minute break
        ELSE
            RETURN FALSE; -- Unknown break type
    END CASE;
    
    -- Check if "available_now" notification was already sent for this break period today
    -- We check for notifications sent today, not just within the current break window
    SELECT EXISTS(
        SELECT 1 FROM notifications 
        WHERE user_id = p_agent_user_id 
        AND category = 'break'
        AND payload->>'reminder_type' = 'available_now'
        AND payload->>'break_type' = p_break_type::text
        AND DATE(created_at AT TIME ZONE 'Asia/Manila') = CURRENT_DATE
    ) INTO notification_exists;
    
    RETURN notification_exists;
END;
$function$
;

COMMENT ON FUNCTION public.is_break_available_now_notification_sent(int4, break_type_enum, timestamp) IS 'Checks if "available_now" notification was already sent for current break period';

-- DROP FUNCTION public.is_break_available_soon(int4, break_type_enum, timestamp);

CREATE OR REPLACE FUNCTION public.is_break_available_soon(p_agent_user_id integer, p_break_type break_type_enum, p_current_time timestamp without time zone DEFAULT NULL::timestamp without time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
      DECLARE
          shift_info RECORD;
          current_time_manila TIMESTAMP;
          current_time_only TIME;
          break_start_time TIME;
          minutes_until_break INTEGER;
          break_already_taken BOOLEAN;
      BEGIN
          -- Get agent's actual shift information
          SELECT * INTO shift_info FROM get_agent_shift_info(p_agent_user_id) LIMIT 1;
          
          IF NOT FOUND OR shift_info.shift_time IS NULL THEN
              RETURN FALSE; -- No shift configured
          END IF;
          
          -- Get current Manila time
          IF p_current_time IS NULL THEN
              current_time_manila := CURRENT_TIMESTAMP + INTERVAL '8 hours';
          ELSE
              current_time_manila := p_current_time;
          END IF;
          
          current_time_only := current_time_manila::TIME;
          
          -- Check if break was already taken today
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = current_time_manila::DATE
              AND end_time IS NOT NULL
          ) INTO break_already_taken;
          
          IF break_already_taken THEN
              RETURN FALSE; -- Break already taken
          END IF;
          
          -- Get break start time from calculate_break_windows
          SELECT start_time INTO break_start_time
          FROM calculate_break_windows(p_agent_user_id)
          WHERE break_type = p_break_type
          LIMIT 1;
          
          IF NOT FOUND THEN
              RETURN FALSE; -- No break window for this type
          END IF;
          
          -- Calculate minutes until break starts
          minutes_until_break := EXTRACT(EPOCH FROM (break_start_time - current_time_only)) / 60;
          
          -- Handle day rollover for night shifts
          IF minutes_until_break < -720 THEN -- More than 12 hours in the past
              minutes_until_break := minutes_until_break + 1440; -- Add 24 hours
          END IF;
          
          -- Return true if break starts within the next 15 minutes
          RETURN minutes_until_break > 0 AND minutes_until_break <= 15;
      END;
      $function$
;

-- DROP FUNCTION public.is_break_missed(int4, break_type_enum, timestamp);

CREATE OR REPLACE FUNCTION public.is_break_missed(p_agent_user_id integer, p_break_type break_type_enum, p_current_time timestamp without time zone DEFAULT NULL::timestamp without time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
      DECLARE
          shift_info RECORD;
          current_time_manila TIMESTAMP;
          current_time_only TIME;
          break_start_time TIME;
          break_end_time TIME;
          minutes_since_break_start INTEGER;
          break_already_taken BOOLEAN;
          break_currently_active BOOLEAN;  -- NEW: Check for currently active breaks
          current_date_manila DATE;
          last_notification_time TIMESTAMP;
          minutes_since_last_notification INTEGER;
      BEGIN
          -- Get agent's actual shift information
          SELECT * INTO shift_info FROM get_agent_shift_info(p_agent_user_id) LIMIT 1;
          
          IF NOT FOUND OR shift_info.shift_time IS NULL THEN
              RETURN FALSE; -- No shift configured
          END IF;
          
          -- Get current Manila time
          IF p_current_time IS NULL THEN
              current_time_manila := CURRENT_TIMESTAMP + INTERVAL '8 hours';
          ELSE
              current_time_manila := p_current_time;
          END IF;
          
          current_time_only := current_time_manila::TIME;
          current_date_manila := current_time_manila::DATE;
          
          -- NEW: Check if break is currently active (being used right now)
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = current_date_manila
              AND end_time IS NULL  -- Currently active break
          ) INTO break_currently_active;
          
          IF break_currently_active THEN
              RETURN FALSE; -- Break is currently active, don't send reminder
          END IF;
          
          -- Check if break was already taken today
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = current_date_manila
              AND end_time IS NOT NULL
          ) INTO break_already_taken;
          
          IF break_already_taken THEN
              RETURN FALSE; -- Break already taken
          END IF;
          
          -- Get break window from calculate_break_windows
          SELECT start_time, end_time INTO break_start_time, break_end_time
          FROM calculate_break_windows(p_agent_user_id)
          WHERE break_type = p_break_type
          LIMIT 1;
          
          IF NOT FOUND THEN
              RETURN FALSE; -- No break window for this type
          END IF;
          
          -- Check if we're within the break window
          IF current_time_only < break_start_time OR current_time_only >= break_end_time THEN
              RETURN FALSE; -- Outside break window
          END IF;
          
          -- Calculate minutes since break start
          minutes_since_break_start := EXTRACT(EPOCH FROM (current_time_only - break_start_time)) / 60;
          
          -- Check if it's been at least 30 minutes since break start
          IF minutes_since_break_start < 30 THEN
              RETURN FALSE; -- Too early to send reminder
          END IF;
          
          -- Check if we're too close to break end (within last 15 minutes)
          IF EXTRACT(EPOCH FROM (break_end_time - current_time_only)) / 60 < 15 THEN
              RETURN FALSE; -- Too close to break end
          END IF;
          
          -- Check if we've sent a notification in the last 25 minutes (prevent spam)
          SELECT MAX(created_at) INTO last_notification_time
          FROM notifications 
          WHERE user_id = p_agent_user_id 
          AND category = 'break' 
          AND payload->>'break_type' = p_break_type::TEXT
          AND payload->>'reminder_type' = 'missed_break'
          AND created_at > current_time_manila - INTERVAL '1 hour';
          
          IF last_notification_time IS NOT NULL THEN
              minutes_since_last_notification := EXTRACT(EPOCH FROM (current_time_manila - last_notification_time)) / 60;
              IF minutes_since_last_notification < 25 THEN
                  RETURN FALSE; -- Too soon since last notification
              END IF;
          END IF;
          
          -- Send reminder every 30 minutes during the break window
          -- This ensures reminders at :00 and :30 of each hour
          RETURN (minutes_since_break_start % 30) < 5;
      END;
      $function$
;

COMMENT ON FUNCTION public.is_break_missed(int4, break_type_enum, timestamp) IS 'FIXED: Now excludes currently active breaks from missed break notifications. Users will not receive "you have not taken" notifications while they are currently on break.';

-- DROP FUNCTION public.is_break_window_ending_soon(int4, break_type_enum, timestamptz);

CREATE OR REPLACE FUNCTION public.is_break_window_ending_soon(p_agent_user_id integer, p_break_type break_type_enum, p_check_time timestamp with time zone DEFAULT now())
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
      DECLARE
          shift_info RECORD;
          break_windows RECORD;
          current_time_only TIME;
          break_end_time TIME;
          minutes_until_expiry INTEGER;
          break_already_taken BOOLEAN;
          break_currently_active BOOLEAN;  -- NEW: Check for currently active breaks
      BEGIN
          -- Get agent shift information
          SELECT * INTO shift_info FROM get_agent_shift_info(p_agent_user_id) LIMIT 1;
          
          IF NOT FOUND OR shift_info.shift_time IS NULL THEN
              RETURN FALSE;
          END IF;
          
          -- NEW: Check if break is currently active (being used right now)
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = (p_check_time AT TIME ZONE 'Asia/Manila')::DATE
              AND end_time IS NULL  -- Currently active break
          ) INTO break_currently_active;
          
          IF break_currently_active THEN
              RETURN FALSE; -- Break is currently active, don't send ending soon notification
          END IF;
          
          -- Check if break was already taken today
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = (p_check_time AT TIME ZONE 'Asia/Manila')::DATE
              AND end_time IS NOT NULL
          ) INTO break_already_taken;
          
          IF break_already_taken THEN
              RETURN FALSE; -- Break already taken, no need for ending soon notification
          END IF;
          
          -- Get break windows using user_id
          SELECT * INTO break_windows FROM calculate_break_windows(p_agent_user_id)
          WHERE break_type = p_break_type LIMIT 1;
          
          IF NOT FOUND THEN
              RETURN FALSE;
          END IF;
          
          -- SIMPLE APPROACH: Extract time part directly from input timestamp
          -- Treat the input as local time (Manila time)
          current_time_only := p_check_time::TIME;
          break_end_time := break_windows.end_time;
          
          -- Calculate minutes until break window expires
          IF current_time_only > break_end_time THEN
              -- Current time is after break end time, so it's already ended
              minutes_until_expiry := 0;
          ELSE
              -- Calculate minutes until end
              minutes_until_expiry := EXTRACT(EPOCH FROM (break_end_time - current_time_only)) / 60;
          END IF;
          
          -- Return true if break window is ending in 15 minutes (with 1-minute tolerance)
          -- This means between 14-16 minutes before the end (narrower, more precise window)
          RETURN (minutes_until_expiry >= 14 AND minutes_until_expiry <= 16);
      END;
      $function$
;

COMMENT ON FUNCTION public.is_break_window_ending_soon(int4, break_type_enum, timestamptz) IS 'FIXED: Now excludes currently active breaks from break window ending soon notifications. Users will not receive "break ending soon" notifications while they are currently on break.';

-- DROP FUNCTION public.is_user_in_meeting(int4);

CREATE OR REPLACE FUNCTION public.is_user_in_meeting(p_user_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    meeting_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO meeting_count
    FROM meetings
    WHERE agent_user_id = p_user_id
    AND is_in_meeting = TRUE
    AND status = 'in-progress';
    
    RETURN meeting_count > 0;
END;
$function$
;

-- DROP FUNCTION public.notify_agent_member_changes();

CREATE OR REPLACE FUNCTION public.notify_agent_member_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  old_company_id INTEGER;
  new_company_id INTEGER;
  old_employee_count INTEGER;
  new_employee_count INTEGER;
  agent_data JSON;
BEGIN
  -- Only send notification if member_id changed (assignment change)
  IF TG_OP = 'UPDATE' AND (OLD.member_id IS DISTINCT FROM NEW.member_id) THEN
    -- Get old and new company IDs
    old_company_id := OLD.member_id;
    new_company_id := NEW.member_id;
    
    -- Get full agent data by joining with correct tables
    SELECT json_build_object(
      'user_id', u.id,
      'first_name', pi.first_name,        -- ✅ From personal_info
      'last_name', pi.last_name,          -- ✅ From personal_info
      'profile_picture', pi.profile_picture, -- ✅ From personal_info
      'employee_id', ji.employee_id,      -- ✅ From job_info
      'job_title', ji.job_title,          -- ✅ From job_info
      'member_id', a.member_id
    ) INTO agent_data
    FROM public.agents a
    JOIN public.users u ON a.user_id = u.id
    JOIN public.personal_info pi ON a.user_id = pi.user_id  -- ✅ JOIN personal_info
    LEFT JOIN public.job_info ji ON a.user_id = ji.agent_user_id  -- ✅ LEFT JOIN job_info
    WHERE a.user_id = NEW.user_id;
    
    -- Calculate employee counts for old and new companies
    IF old_company_id IS NOT NULL THEN
      SELECT COUNT(*) INTO old_employee_count 
      FROM public.agents 
      WHERE member_id = old_company_id;
    ELSE
      old_employee_count := NULL;
    END IF;
    
    IF new_company_id IS NOT NULL THEN
      SELECT COUNT(*) INTO new_employee_count 
      FROM public.agents 
      WHERE member_id = new_company_id;
    ELSE
      new_employee_count := NULL;
    END IF;
    
    PERFORM pg_notify(
      'agent_assignment_changes',
      json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'record', COALESCE(agent_data, row_to_json(NEW)),
        'old_record', row_to_json(OLD),
        'count_updates', json_build_object(
          'old_company_id', old_company_id,
          'old_employee_count', old_employee_count,
          'new_company_id', new_company_id,
          'new_employee_count', new_employee_count
        ),
        'timestamp', now()
      )::text
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_applicant_changes();

CREATE OR REPLACE FUNCTION public.notify_applicant_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    payload JSON;
BEGIN
    -- Create payload based on trigger operation
    CASE TG_OP
        WHEN 'INSERT' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'INSERT',
                'record', row_to_json(NEW),
                'timestamp', now()
            );
        WHEN 'UPDATE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'UPDATE',
                'record', row_to_json(NEW),
                'old_record', row_to_json(OLD),
                'timestamp', now()
            );
        WHEN 'DELETE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'DELETE',
                'record', row_to_json(OLD),
                'timestamp', now()
            );
    END CASE;
    
    -- Send notification
    PERFORM pg_notify('applicant_changes', payload::text);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_break_sessions_changes();

CREATE OR REPLACE FUNCTION public.notify_break_sessions_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    payload JSON;
    break_data JSON;
    old_break_data JSON;
BEGIN
    -- Create payload based on trigger operation
    CASE TG_OP
        WHEN 'INSERT' THEN
            -- Get break session with joined agent data
            SELECT json_build_object(
                'id', bs.id,
                'agent_user_id', bs.agent_user_id,
                'break_type', bs.break_type,
                'start_time', bs.start_time,
                'end_time', bs.end_time,
                'duration_minutes', bs.duration_minutes,
                'created_at', bs.created_at,
                'pause_time', bs.pause_time,
                'resume_time', bs.resume_time,
                'pause_used', bs.pause_used,
                'time_remaining_at_pause', bs.time_remaining_at_pause,
                'break_date', bs.break_date,
                'updated_at', bs.updated_at,
                'first_name', pi.first_name,
                'last_name', pi.last_name,
                'profile_picture', pi.profile_picture,
                'email', u.email,
                'department_name', d.name
            ) INTO break_data
            FROM break_sessions bs
            LEFT JOIN personal_info pi ON bs.agent_user_id = pi.user_id
            LEFT JOIN users u ON bs.agent_user_id = u.id
            LEFT JOIN agents a ON bs.agent_user_id = a.user_id
            LEFT JOIN departments d ON a.department_id = d.id
            WHERE bs.id = NEW.id;
            
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'INSERT',
                'record', break_data,
                'timestamp', now()
            );
        WHEN 'UPDATE' THEN
            -- Get updated break session with joined agent data
            SELECT json_build_object(
                'id', bs.id,
                'agent_user_id', bs.agent_user_id,
                'break_type', bs.break_type,
                'start_time', bs.start_time,
                'end_time', bs.end_time,
                'duration_minutes', bs.duration_minutes,
                'created_at', bs.created_at,
                'pause_time', bs.pause_time,
                'resume_time', bs.resume_time,
                'pause_used', bs.pause_used,
                'time_remaining_at_pause', bs.time_remaining_at_pause,
                'break_date', bs.break_date,
                'updated_at', bs.updated_at,
                'first_name', pi.first_name,
                'last_name', pi.last_name,
                'profile_picture', pi.profile_picture,
                'email', u.email,
                'department_name', d.name
            ) INTO break_data
            FROM break_sessions bs
            LEFT JOIN personal_info pi ON bs.agent_user_id = pi.user_id
            LEFT JOIN users u ON bs.agent_user_id = u.id
            LEFT JOIN agents a ON bs.agent_user_id = a.user_id
            LEFT JOIN departments d ON a.department_id = d.id
            WHERE bs.id = NEW.id;
            
            -- Get old break session with joined agent data
            SELECT json_build_object(
                'id', bs.id,
                'agent_user_id', bs.agent_user_id,
                'break_type', bs.break_type,
                'start_time', bs.start_time,
                'end_time', bs.end_time,
                'duration_minutes', bs.duration_minutes,
                'created_at', bs.created_at,
                'pause_time', bs.pause_time,
                'resume_time', bs.resume_time,
                'pause_used', bs.pause_used,
                'time_remaining_at_pause', bs.time_remaining_at_pause,
                'break_date', bs.break_date,
                'updated_at', bs.updated_at,
                'first_name', pi.first_name,
                'last_name', pi.last_name,
                'profile_picture', pi.profile_picture,
                'email', u.email,
                'department_name', d.name
            ) INTO old_break_data
            FROM break_sessions bs
            LEFT JOIN personal_info pi ON bs.agent_user_id = pi.user_id
            LEFT JOIN users u ON bs.agent_user_id = u.id
            LEFT JOIN agents a ON bs.agent_user_id = a.user_id
            LEFT JOIN departments d ON a.department_id = d.id
            WHERE bs.id = OLD.id;
            
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'UPDATE',
                'record', break_data,
                'old_record', old_break_data,
                'timestamp', now()
            );
        WHEN 'DELETE' THEN
            -- For DELETE, we can't join since the record is gone, so use OLD data
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'DELETE',
                'record', row_to_json(OLD),
                'timestamp', now()
            );
    END CASE;
    
    -- Send notification
    PERFORM pg_notify('break_sessions_changes', payload::text);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_client_member_changes();

CREATE OR REPLACE FUNCTION public.notify_client_member_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  old_company_id INTEGER;
  new_company_id INTEGER;
  old_client_count INTEGER;
  new_client_count INTEGER;
  client_data JSON;
BEGIN
  -- Only send notification if member_id changed (assignment change)
  IF TG_OP = 'UPDATE' AND (OLD.member_id IS DISTINCT FROM NEW.member_id) THEN
    -- Get old and new company IDs
    old_company_id := OLD.member_id;
    new_company_id := NEW.member_id;
    
    -- Get full client data by joining with correct tables
    SELECT json_build_object(
      'user_id', u.id,
      'first_name', pi.first_name,        -- ✅ From personal_info
      'last_name', pi.last_name,          -- ✅ From personal_info
      'profile_picture', pi.profile_picture, -- ✅ From personal_info
      'member_id', c.member_id
    ) INTO client_data
    FROM public.clients c
    JOIN public.users u ON c.user_id = u.id
    JOIN public.personal_info pi ON c.user_id = pi.user_id  -- ✅ JOIN personal_info
    WHERE c.user_id = NEW.user_id;
    
    -- Calculate client counts for old and new companies
    IF old_company_id IS NOT NULL THEN
      SELECT COUNT(*) INTO old_client_count 
      FROM public.clients 
      WHERE member_id = old_company_id;
    ELSE
      old_client_count := NULL;
    END IF;
    
    IF new_company_id IS NOT NULL THEN
      SELECT COUNT(*) INTO new_client_count 
      FROM public.clients 
      WHERE member_id = new_company_id;
    ELSE
      new_client_count := NULL;
    END IF;
    
    PERFORM pg_notify(
      'client_assignment_changes',
      json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'record', COALESCE(client_data, row_to_json(NEW)),
        'old_record', row_to_json(OLD),
        'count_updates', json_build_object(
          'old_company_id', old_company_id,
          'old_client_count', old_client_count,
          'new_company_id', new_company_id,
          'new_client_count', new_client_count
        ),
        'timestamp', now()
      )::text
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_job_info_changes();

CREATE OR REPLACE FUNCTION public.notify_job_info_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    payload JSON;
    user_data JSON;
    user_id_val INTEGER;
    user_type_val TEXT;
BEGIN
    -- Determine if this is an agent or internal user and get the user_id
    IF NEW.agent_user_id IS NOT NULL THEN
        user_id_val := NEW.agent_user_id;
        user_type_val := 'Agent';
    ELSIF NEW.internal_user_id IS NOT NULL THEN
        user_id_val := NEW.internal_user_id;
        user_type_val := 'Internal';
    ELSE
        -- Handle DELETE case where NEW might be NULL
        IF OLD.agent_user_id IS NOT NULL THEN
            user_id_val := OLD.agent_user_id;
            user_type_val := 'Agent';
        ELSIF OLD.internal_user_id IS NOT NULL THEN
            user_id_val := OLD.internal_user_id;
            user_type_val := 'Internal';
        ELSE
            -- Fallback, shouldn't happen but just in case
            RETURN COALESCE(NEW, OLD);
        END IF;
    END IF;

    -- Get full user data by joining with the appropriate table
    IF user_type_val = 'Agent' THEN
        -- For agents, join with agents table
        SELECT json_build_object(
          'user_id', a.user_id,
          'user_type', 'Agent',
          'employee_id', ji.employee_id,
          'job_title', ji.job_title,
          'shift_period', ji.shift_period,
          'shift_schedule', ji.shift_schedule,
          'shift_time', ji.shift_time,
          'work_setup', ji.work_setup,
          'employment_status', ji.employment_status,
          'hire_type', ji.hire_type,
          'staff_source', ji.staff_source,
          'start_date', ji.start_date,
          'exit_date', ji.exit_date,
          'work_email', ji.work_email,
          'created_at', ji.created_at,
          'updated_at', ji.updated_at
        ) INTO user_data
        FROM public.job_info ji
        JOIN public.agents a ON ji.agent_user_id = a.user_id
        WHERE ji.agent_user_id = user_id_val;
    ELSE
        -- For internal users, join with internal table
        SELECT json_build_object(
          'user_id', i.user_id,
          'user_type', 'Internal',
          'employee_id', ji.employee_id,
          'job_title', ji.job_title,
          'shift_period', ji.shift_period,
          'shift_schedule', ji.shift_schedule,
          'shift_time', ji.shift_time,
          'work_setup', ji.work_setup,
          'employment_status', ji.employment_status,
          'hire_type', ji.hire_type,
          'staff_source', ji.staff_source,
          'start_date', ji.start_date,
          'exit_date', ji.exit_date,
          'work_email', ji.work_email,
          'created_at', ji.created_at,
          'updated_at', ji.updated_at
        ) INTO user_data
        FROM public.job_info ji
        JOIN public.internal i ON ji.internal_user_id = i.user_id
        WHERE ji.internal_user_id = user_id_val;
    END IF;

    -- Create payload based on trigger operation
    CASE TG_OP
        WHEN 'INSERT' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'INSERT',
                'record', user_data,
                'timestamp', now()
            );
        WHEN 'UPDATE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'UPDATE',
                'record', user_data,
                'old_record', row_to_json(OLD),
                'timestamp', now()
            );
        WHEN 'DELETE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'DELETE',
                'record', user_data,
                'timestamp', now()
            );
    END CASE;
    
    -- Send notification
    PERFORM pg_notify('job_info_changes', payload::text);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_member_activity_changes();

CREATE OR REPLACE FUNCTION public.notify_member_activity_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Send notification when activity logs change
  PERFORM pg_notify(
    'member_activity_changes',
    json_build_object(
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record', CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW) END,
      'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
      'timestamp', now()
    )::text
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_member_changes();

CREATE OR REPLACE FUNCTION public.notify_member_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM pg_notify(
      'member_changes',
      json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'record', row_to_json(NEW),
        'timestamp', now()
      )::text
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM pg_notify(
      'member_changes',
      json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'record', row_to_json(NEW),
        'old_record', row_to_json(OLD),
        'timestamp', now()
      )::text
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM pg_notify(
      'member_changes',
      json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'old_record', row_to_json(OLD),
        'timestamp', now()
      )::text
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_member_comment_changes();

CREATE OR REPLACE FUNCTION public.notify_member_comment_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Send notification when comments change
  PERFORM pg_notify(
    'member_comment_changes',
    json_build_object(
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record', CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW) END,
      'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
      'timestamp', now()
    )::text
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_notification();

CREATE OR REPLACE FUNCTION public.notify_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  PERFORM pg_notify(
    'notifications',
    json_build_object(
      'id', NEW.id,
      'user_id', NEW.user_id,
      'category', NEW.category,
      'type', NEW.type,
      'title', NEW.title,
      'message', NEW.message,
      'payload', COALESCE(NEW.payload, '{}'::jsonb),
      'created_at', NEW.created_at
    )::text
  );
  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.notify_personal_info_changes();

CREATE OR REPLACE FUNCTION public.notify_personal_info_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    payload JSON;
    agent_data JSON;
BEGIN
    -- Get full agent data by joining with agents table
    SELECT json_build_object(
      'user_id', u.id,
      'first_name', pi.first_name,
      'middle_name', pi.middle_name,
      'last_name', pi.last_name,
      'nickname', pi.nickname,
      'profile_picture', pi.profile_picture,
      'phone', pi.phone,
      'address', pi.address,
      'city', pi.city,
      'gender', pi.gender,
      'birthday', pi.birthday,
      'created_at', pi.created_at,
      'updated_at', pi.updated_at
    ) INTO agent_data
    FROM public.personal_info pi
    JOIN public.users u ON pi.user_id = u.id
    WHERE pi.user_id = COALESCE(NEW.user_id, OLD.user_id);

    -- Create payload based on trigger operation
    CASE TG_OP
        WHEN 'INSERT' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'INSERT',
                'record', agent_data,
                'timestamp', now()
            );
        WHEN 'UPDATE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'UPDATE',
                'record', agent_data,
                'old_record', row_to_json(OLD),
                'timestamp', now()
            );
        WHEN 'DELETE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'DELETE',
                'record', agent_data,
                'timestamp', now()
            );
    END CASE;
    
    -- Send notification
    PERFORM pg_notify('personal_info_changes', payload::text);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_ticket_change();

CREATE OR REPLACE FUNCTION public.notify_ticket_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    notification JSON;
BEGIN
    -- Only send notifications for meaningful changes, not timestamp updates
    IF TG_OP = 'UPDATE' THEN
        -- Check if any meaningful fields changed (excluding updated_at)
        IF (OLD.status IS DISTINCT FROM NEW.status) OR
           (OLD.position IS DISTINCT FROM NEW.position) OR
           (OLD.resolved_by IS DISTINCT FROM NEW.resolved_by) OR
           (OLD.resolved_at IS DISTINCT FROM NEW.resolved_at) OR
           (OLD.role_id IS DISTINCT FROM NEW.role_id) OR
           (OLD.concern IS DISTINCT FROM NEW.concern) OR
           (OLD.details IS DISTINCT FROM NEW.details) OR
           (OLD.category_id IS DISTINCT FROM NEW.category_id) OR
           (OLD.supporting_files IS DISTINCT FROM NEW.supporting_files) OR
           (OLD.file_count IS DISTINCT FROM NEW.file_count) THEN
            
            -- Create notification payload
            notification = json_build_object(
                'table', TG_TABLE_NAME,
                'action', TG_OP,
                'record', row_to_json(NEW),
                'old_record', row_to_json(OLD),
                'timestamp', now()
            );
            
            -- Send notification
            PERFORM pg_notify('ticket_changes', notification::text);
        END IF;
    ELSE
        -- For INSERT and DELETE, always send notification
        notification = json_build_object(
            'table', TG_TABLE_NAME,
            'action', TG_OP,
            'record', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE row_to_json(NEW) END,
            'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
            'timestamp', now()
        );
        
        -- Send notification
        PERFORM pg_notify('ticket_changes', notification::text);
    END IF;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.pgp_armor_headers(in text, out text, out text);

CREATE OR REPLACE FUNCTION public.pgp_armor_headers(text, OUT key text, OUT value text)
 RETURNS SETOF record
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_armor_headers$function$
;

-- DROP FUNCTION public.pgp_key_id(bytea);

CREATE OR REPLACE FUNCTION public.pgp_key_id(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_key_id_w$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt(text, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt(text, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt_bytea(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt(text, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt(text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt_bytea(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

-- DROP FUNCTION public.reset_daily_breaks();

CREATE OR REPLACE FUNCTION public.reset_daily_breaks()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
			DECLARE
				reset_count INTEGER := 0;
			BEGIN
				-- This function doesn't delete data, it just ensures that break usage
				-- is calculated based on today's date only
				
				-- Count how many agents would be affected (for logging purposes)
				SELECT COUNT(DISTINCT agent_user_id) 
				INTO reset_count
				FROM public.break_sessions 
				WHERE break_date = (NOW() AT TIME ZONE 'Asia/Manila')::date;
				
				-- The reset is implicit - break availability is checked by querying
				-- only today's break_sessions records
				
				RETURN reset_count;
			END;
			$function$
;

-- DROP FUNCTION public.should_reset_agent_breaks(int4);

CREATE OR REPLACE FUNCTION public.should_reset_agent_breaks(p_agent_user_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    last_reset_date DATE;
    current_local_date DATE;
BEGIN
    -- Get current date in Philippines timezone
    current_local_date := (NOW() AT TIME ZONE 'Asia/Manila')::date;
    
    -- Get the latest break_date for this agent
    SELECT MAX(break_date) INTO last_reset_date
    FROM break_sessions
    WHERE agent_user_id = p_agent_user_id;
    
    -- If no breaks exist or last break was before today, reset is needed
    RETURN (last_reset_date IS NULL OR last_reset_date < current_local_date);
END;
$function$
;

-- DROP FUNCTION public.trigger_break_availability_check();

CREATE OR REPLACE FUNCTION public.trigger_break_availability_check()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    PERFORM check_break_availability();
END;
$function$
;

-- DROP FUNCTION public.update_inventory_stock_on_clinic_log();

CREATE OR REPLACE FUNCTION public.update_inventory_stock_on_clinic_log()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update inventory stock when items are used
    UPDATE public.inventory_medical 
    SET stock = stock - NEW.quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.inventory_item_id;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_meetings_updated_at();

CREATE OR REPLACE FUNCTION public.update_meetings_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();  -- ✅ Use UTC (now() returns UTC)
    RETURN NEW;
END;
$function$
;-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

-- DROP TYPE public."break_type_enum";

CREATE TYPE public."break_type_enum" AS ENUM (
	'Morning',
	'Lunch',
	'Afternoon',
	'NightFirst',
	'NightMeal',
	'NightSecond');

-- DROP TYPE public."gender_enum";

CREATE TYPE public."gender_enum" AS ENUM (
	'Male',
	'Female',
	'Other',
	'Prefer not to say');

-- DROP TYPE public."item_type_medical";

CREATE TYPE public."item_type_medical" AS ENUM (
	'Medicine',
	'Supply');

-- DROP TYPE public."member_service_enum";

CREATE TYPE public."member_service_enum" AS ENUM (
	'One Agent',
	'Team',
	'Workforce');

-- DROP TYPE public."member_status_enum";

CREATE TYPE public."member_status_enum" AS ENUM (
	'Current Client',
	'Lost Client');

-- DROP TYPE public."ticket_status_enum";

CREATE TYPE public."ticket_status_enum" AS ENUM (
	'For Approval',
	'On Hold',
	'In Progress',
	'Approved',
	'Stuck',
	'Actioned',
	'Closed');

-- DROP TYPE public."user_type_enum";

CREATE TYPE public."user_type_enum" AS ENUM (
	'Agent',
	'Client',
	'Internal');

-- DROP SEQUENCE public.activity_data_id_seq;

CREATE SEQUENCE public.activity_data_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.break_sessions_id_seq;

CREATE SEQUENCE public.break_sessions_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.clinic_log_medicines_id_seq;

CREATE SEQUENCE public.clinic_log_medicines_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.clinic_log_supplies_id_seq;

CREATE SEQUENCE public.clinic_log_supplies_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.clinic_logs_id_seq;

CREATE SEQUENCE public.clinic_logs_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.departments_id_seq;

CREATE SEQUENCE public.departments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.floor_plan_members_id_seq;

CREATE SEQUENCE public.floor_plan_members_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.floor_plans_id_seq;

CREATE SEQUENCE public.floor_plans_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.internal_roles_id_seq;

CREATE SEQUENCE public.internal_roles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.inventory_medical_categories_id_seq;

CREATE SEQUENCE public.inventory_medical_categories_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.inventory_medical_id_seq;

CREATE SEQUENCE public.inventory_medical_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.inventory_medical_suppliers_id_seq;

CREATE SEQUENCE public.inventory_medical_suppliers_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.job_info_id_seq;

CREATE SEQUENCE public.job_info_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.meetings_id_seq;

CREATE SEQUENCE public.meetings_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.member_comments_id_seq;

CREATE SEQUENCE public.member_comments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.members_activity_log_id_seq;

CREATE SEQUENCE public.members_activity_log_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.members_id_seq;

CREATE SEQUENCE public.members_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.monthly_activity_summary_id_seq;

CREATE SEQUENCE public.monthly_activity_summary_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.notifications_id_seq;

CREATE SEQUENCE public.notifications_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.personal_info_id_seq;

CREATE SEQUENCE public.personal_info_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.productivity_scores_id_seq;

CREATE SEQUENCE public.productivity_scores_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.recruits_comments_id_seq;

CREATE SEQUENCE public.recruits_comments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.recruits_id_seq;

CREATE SEQUENCE public.recruits_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.roles_id_seq;

CREATE SEQUENCE public.roles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.stations_id_seq;

CREATE SEQUENCE public.stations_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.talent_pool_id_seq;

CREATE SEQUENCE public.talent_pool_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ticket_categories_id_seq;

CREATE SEQUENCE public.ticket_categories_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ticket_comments_id_seq;

CREATE SEQUENCE public.ticket_comments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ticket_id_seq;

CREATE SEQUENCE public.ticket_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.tickets_id_seq;

CREATE SEQUENCE public.tickets_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.users_id_seq;

CREATE SEQUENCE public.users_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.weekly_activity_summary_id_seq;

CREATE SEQUENCE public.weekly_activity_summary_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public.bpoc_recruits definition

-- Drop table

-- DROP TABLE public.bpoc_recruits;

CREATE TABLE public.bpoc_recruits ( id int4 DEFAULT nextval('recruits_id_seq'::regclass) NOT NULL, applicant_id uuid NOT NULL, resume_slug text NULL, status text NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, video_introduction_url text NULL, current_salary numeric NULL, expected_monthly_salary numeric NULL, shift text NULL, "position" numeric(10, 3) DEFAULT 0 NULL, job_ids _int4 DEFAULT '{}'::integer[] NOT NULL, bpoc_application_ids _uuid DEFAULT '{}'::uuid[] NOT NULL, interested_clients _int4 DEFAULT '{}'::integer[] NOT NULL, CONSTRAINT bpoc_recruits_applicant_id_unique UNIQUE (applicant_id), CONSTRAINT bpoc_recruits_pkey PRIMARY KEY (id));
CREATE INDEX idx_bpoc_recruits_status_position ON public.bpoc_recruits USING btree (status, "position");
CREATE INDEX idx_recruits_bpoc_app_ids_gin ON public.bpoc_recruits USING gin (bpoc_application_ids);
CREATE INDEX idx_recruits_interested_clients_gin ON public.bpoc_recruits USING gin (interested_clients);
CREATE INDEX idx_recruits_job_ids_gin ON public.bpoc_recruits USING gin (job_ids);
CREATE INDEX idx_status_position ON public.bpoc_recruits USING btree (status, "position");

-- Table Triggers

create trigger update_bpoc_recruits_updated_at before
update
    on
    public.bpoc_recruits for each row execute function update_updated_at_column();
create trigger trigger_applicant_changes after
insert
    or
delete
    or
update
    on
    public.bpoc_recruits for each row execute function notify_applicant_changes();
create trigger trigger_add_to_talent_pool_insert after
insert
    on
    public.bpoc_recruits for each row execute function add_to_talent_pool();
create trigger trigger_add_to_talent_pool_update after
update
    of status on
    public.bpoc_recruits for each row execute function add_to_talent_pool();


-- public.break_sessions definition

-- Drop table

-- DROP TABLE public.break_sessions;

CREATE TABLE public.break_sessions ( id serial4 NOT NULL, agent_user_id int4 NOT NULL, start_time timestamptz NOT NULL, end_time timestamptz NULL, break_date date NOT NULL, pause_time timestamptz NULL, resume_time timestamptz NULL, time_remaining_at_pause int4 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, break_type public."break_type_enum" NOT NULL, duration_minutes int4 NULL, pause_used bool DEFAULT false NULL, CONSTRAINT break_sessions_break_type_check CHECK ((break_type = ANY (ARRAY['Morning'::break_type_enum, 'Lunch'::break_type_enum, 'Afternoon'::break_type_enum, 'NightFirst'::break_type_enum, 'NightMeal'::break_type_enum, 'NightSecond'::break_type_enum]))), CONSTRAINT break_sessions_pkey PRIMARY KEY (id));
CREATE INDEX idx_break_sessions_agent_user_id ON public.break_sessions USING btree (agent_user_id);
CREATE INDEX idx_break_sessions_break_date ON public.break_sessions USING btree (break_date);
CREATE INDEX idx_break_sessions_break_type ON public.break_sessions USING btree (break_type);

-- Table Triggers

create trigger calculate_break_duration_trigger before
insert
    or
update
    on
    public.break_sessions for each row execute function calculate_break_duration();

COMMENT ON TRIGGER calculate_break_duration_trigger ON public.break_sessions IS 'Automatically calculates duration_minutes when end_time is set, handling paused breaks correctly';
create trigger update_break_sessions_updated_at before
update
    on
    public.break_sessions for each row execute function update_updated_at_column();
create trigger notify_break_sessions_changes after
insert
    or
delete
    or
update
    on
    public.break_sessions for each row execute function notify_break_sessions_changes();


-- public.floor_plans definition

-- Drop table

-- DROP TABLE public.floor_plans;

CREATE TABLE public.floor_plans ( id serial4 NOT NULL, "name" text NOT NULL, building text NULL, svg_url text NULL, svg_path text NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT floor_plans_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_floor_plans_updated_at before
update
    on
    public.floor_plans for each row execute function update_updated_at_column();


-- public.inventory_medical_categories definition

-- Drop table

-- DROP TABLE public.inventory_medical_categories;

CREATE TABLE public.inventory_medical_categories ( id serial4 NOT NULL, item_type public."item_type_medical" NOT NULL, "name" varchar(100) NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT inventory_medical_categories_item_type_name_key UNIQUE (item_type, name), CONSTRAINT inventory_medical_categories_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_inventory_medical_categories_updated_at before
update
    on
    public.inventory_medical_categories for each row execute function update_updated_at_column();


-- public.inventory_medical_suppliers definition

-- Drop table

-- DROP TABLE public.inventory_medical_suppliers;

CREATE TABLE public.inventory_medical_suppliers ( id serial4 NOT NULL, "name" varchar(255) NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT inventory_medical_suppliers_name_key UNIQUE (name), CONSTRAINT inventory_medical_suppliers_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_inventory_medical_suppliers_updated_at before
update
    on
    public.inventory_medical_suppliers for each row execute function update_updated_at_column();


-- public.meetings definition

-- Drop table

-- DROP TABLE public.meetings;

CREATE TABLE public.meetings ( id serial4 NOT NULL, agent_user_id int4 NOT NULL, title varchar(255) NOT NULL, description text NULL, start_time timestamptz DEFAULT now() NULL, end_time timestamptz DEFAULT now() NULL, duration_minutes int4 NOT NULL, meeting_type varchar(50) NOT NULL, status varchar(50) DEFAULT 'scheduled'::character varying NOT NULL, is_in_meeting bool DEFAULT false NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, actual_start_time timestamptz DEFAULT now() NULL, CONSTRAINT meetings_meeting_type_check CHECK (((meeting_type)::text = ANY (ARRAY[('video'::character varying)::text, ('audio'::character varying)::text, ('in-person'::character varying)::text]))), CONSTRAINT meetings_pkey PRIMARY KEY (id), CONSTRAINT meetings_status_check CHECK (((status)::text = ANY (ARRAY[('scheduled'::character varying)::text, ('in-progress'::character varying)::text, ('completed'::character varying)::text, ('cancelled'::character varying)::text]))));
CREATE INDEX idx_meetings_agent_user_id ON public.meetings USING btree (agent_user_id);
CREATE INDEX idx_meetings_created_at ON public.meetings USING btree (created_at);
CREATE INDEX idx_meetings_start_time ON public.meetings USING btree (start_time);
CREATE INDEX idx_meetings_status ON public.meetings USING btree (status);

-- Table Triggers

create trigger trigger_update_meetings_updated_at before
update
    on
    public.meetings for each row execute function update_meetings_updated_at();


-- public.roles definition

-- Drop table

-- DROP TABLE public.roles;

CREATE TABLE public.roles ( id serial4 NOT NULL, "name" text NOT NULL, description text NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT roles_name_key UNIQUE (name), CONSTRAINT roles_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_roles_updated_at before
update
    on
    public.roles for each row execute function update_updated_at_column();


-- public.ticket_categories definition

-- Drop table

-- DROP TABLE public.ticket_categories;

CREATE TABLE public.ticket_categories ( id serial4 NOT NULL, "name" varchar(100) NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT ticket_categories_name_key UNIQUE (name), CONSTRAINT ticket_categories_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_ticket_categories_updated_at before
update
    on
    public.ticket_categories for each row execute function update_updated_at_column();


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users ( id serial4 NOT NULL, email text NOT NULL, user_type public."user_type_enum" NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT users_email_key UNIQUE (email), CONSTRAINT users_pkey PRIMARY KEY (id));
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_user_type ON public.users USING btree (user_type);

-- Table Triggers

create trigger update_users_updated_at before
update
    on
    public.users for each row execute function update_updated_at_column();


-- public.activity_data definition

-- Drop table

-- DROP TABLE public.activity_data;

CREATE TABLE public.activity_data ( id serial4 NOT NULL, user_id int4 NOT NULL, is_currently_active bool DEFAULT false NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, today_active_seconds int4 DEFAULT 0 NULL, today_inactive_seconds int4 DEFAULT 0 NULL, last_session_start timestamptz NULL, today_date date DEFAULT CURRENT_DATE NOT NULL, CONSTRAINT activity_data_pkey PRIMARY KEY (id), CONSTRAINT activity_data_user_date_unique UNIQUE (user_id, today_date), CONSTRAINT activity_data_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_activity_data_today_date ON public.activity_data USING btree (today_date);
CREATE INDEX idx_activity_data_user_date ON public.activity_data USING btree (user_id, today_date);

-- Table Triggers

create trigger trg_productivity_score_on_time_change after
insert
    or
update
    on
    public.activity_data for each row execute function update_productivity_score_on_time_change();
create trigger trg_auto_aggregate_on_insert after
insert
    on
    public.activity_data for each row execute function auto_aggregate_all_on_activity_change();
create trigger trg_auto_aggregate_on_update after
update
    on
    public.activity_data for each row execute function auto_aggregate_all_on_activity_change();
create trigger update_activity_data_updated_at before
update
    on
    public.activity_data for each row execute function update_updated_at_column();
create trigger notify_activity_data_change after
insert
    or
update
    on
    public.activity_data for each row execute function notify_activity_data_change();


-- public.clinic_logs definition

-- Drop table

-- DROP TABLE public.clinic_logs;

CREATE TABLE public.clinic_logs ( id serial4 NOT NULL, patient_id int4 NOT NULL, additional_notes text NULL, issued_by varchar(255) NOT NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, patient_diagnose text NOT NULL, CONSTRAINT clinic_logs_pkey PRIMARY KEY (id), CONSTRAINT clinic_logs_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.users(id) ON DELETE CASCADE);


-- public.internal definition

-- Drop table

-- DROP TABLE public.internal;

CREATE TABLE public.internal ( user_id int4 NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT internal_pkey PRIMARY KEY (user_id), CONSTRAINT internal_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_internal_updated_at before
update
    on
    public.internal for each row execute function update_updated_at_column();


-- public.internal_roles definition

-- Drop table

-- DROP TABLE public.internal_roles;

CREATE TABLE public.internal_roles ( id serial4 NOT NULL, internal_user_id int4 NOT NULL, role_id int4 NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT internal_roles_pkey PRIMARY KEY (id), CONSTRAINT unique_internal_role_assignment UNIQUE (internal_user_id, role_id), CONSTRAINT internal_roles_internal_user_id_fkey FOREIGN KEY (internal_user_id) REFERENCES public.internal(user_id) ON DELETE CASCADE, CONSTRAINT internal_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_internal_roles_updated_at before
update
    on
    public.internal_roles for each row execute function update_updated_at_column();


-- public.inventory_medical definition

-- Drop table

-- DROP TABLE public.inventory_medical;

CREATE TABLE public.inventory_medical ( id serial4 NOT NULL, item_type public."item_type_medical" NOT NULL, "name" varchar(255) NOT NULL, description text NULL, category_id int4 NULL, stock int4 DEFAULT 0 NOT NULL, reorder_level int4 DEFAULT 10 NOT NULL, price numeric(10, 2) NULL, supplier_id int4 NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT inventory_medical_pkey PRIMARY KEY (id), CONSTRAINT inventory_medical_reorder_level_check CHECK ((reorder_level >= 0)), CONSTRAINT inventory_medical_stock_check CHECK ((stock >= 0)), CONSTRAINT inventory_medical_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.inventory_medical_categories(id) ON DELETE RESTRICT, CONSTRAINT inventory_medical_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.inventory_medical_suppliers(id) ON DELETE SET NULL);

-- Table Triggers

create trigger update_inventory_medical_updated_at before
update
    on
    public.inventory_medical for each row execute function update_updated_at_column();


-- public.members definition

-- Drop table

-- DROP TABLE public.members;

CREATE TABLE public.members ( id serial4 NOT NULL, company text NOT NULL, address text NULL, phone text NULL, logo text NULL, service public."member_service_enum" NULL, status public."member_status_enum" NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, badge_color text NULL, country text NULL, website _text NULL, company_id uuid NOT NULL, created_by int4 NULL, updated_by int4 NULL, shift text NULL, CONSTRAINT members_company_id_key UNIQUE (company_id), CONSTRAINT members_pkey PRIMARY KEY (id), CONSTRAINT members_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL, CONSTRAINT members_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL);
CREATE INDEX idx_members_company ON public.members USING btree (company);
CREATE INDEX idx_members_country ON public.members USING btree (country);
CREATE INDEX idx_members_listing ON public.members USING btree (status, country) INCLUDE (id, company, service, badge_color);
CREATE INDEX idx_members_status ON public.members USING btree (status);

-- Table Triggers

create trigger update_members_updated_at before
update
    on
    public.members for each row execute function update_updated_at_column();
create trigger trigger_member_changes after
insert
    or
delete
    or
update
    on
    public.members for each row execute function notify_member_changes();


-- public.members_activity_log definition

-- Drop table

-- DROP TABLE public.members_activity_log;

CREATE TABLE public.members_activity_log ( id serial4 NOT NULL, member_id int4 NOT NULL, field_name text NOT NULL, "action" text NOT NULL, old_value text NULL, new_value text NULL, user_id int4 NULL, created_at timestamptz DEFAULT now() NULL, CONSTRAINT members_activity_log_action_check CHECK ((action = ANY (ARRAY['created'::text, 'set'::text, 'updated'::text, 'removed'::text, 'selected'::text, 'deselected'::text]))), CONSTRAINT members_activity_log_pkey PRIMARY KEY (id), CONSTRAINT fk_members_activity_log_member FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE, CONSTRAINT fk_members_activity_log_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL);
CREATE INDEX idx_members_activity_log_action ON public.members_activity_log USING btree (action);
CREATE INDEX idx_members_activity_log_created_at ON public.members_activity_log USING btree (created_at);
CREATE INDEX idx_members_activity_log_member_id ON public.members_activity_log USING btree (member_id);
CREATE INDEX idx_members_activity_log_user_id ON public.members_activity_log USING btree (user_id);

-- Table Triggers

create trigger notify_member_activity_changes after
insert
    or
delete
    or
update
    on
    public.members_activity_log for each row execute function notify_member_activity_changes();


-- public.monthly_activity_summary definition

-- Drop table

-- DROP TABLE public.monthly_activity_summary;

CREATE TABLE public.monthly_activity_summary ( id serial4 NOT NULL, user_id int4 NOT NULL, month_start_date date NOT NULL, month_end_date date NOT NULL, total_active_seconds int4 DEFAULT 0 NULL, total_inactive_seconds int4 DEFAULT 0 NULL, total_days_active int4 DEFAULT 0 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT monthly_activity_summary_pkey PRIMARY KEY (id), CONSTRAINT monthly_activity_summary_user_id_month_start_date_key UNIQUE (user_id, month_start_date), CONSTRAINT monthly_activity_summary_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_monthly_activity_created_at ON public.monthly_activity_summary USING btree (created_at);
CREATE INDEX idx_monthly_activity_month_dates ON public.monthly_activity_summary USING btree (month_start_date, month_end_date);
CREATE INDEX idx_monthly_activity_user_id ON public.monthly_activity_summary USING btree (user_id);

-- Table Triggers

create trigger update_monthly_activity_updated_at before
update
    on
    public.monthly_activity_summary for each row execute function update_updated_at_column();


-- public.notifications definition

-- Drop table

-- DROP TABLE public.notifications;

CREATE TABLE public.notifications ( id serial4 NOT NULL, user_id int4 NOT NULL, category text NOT NULL, "type" text NOT NULL, title text NOT NULL, message text NOT NULL, payload jsonb NULL, is_read bool DEFAULT false NULL, created_at timestamptz DEFAULT now() NULL, CONSTRAINT notifications_pkey PRIMARY KEY (id), CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_notifications_user_created ON public.notifications USING btree (user_id, created_at DESC);

-- Table Triggers

create trigger trg_notify_notification after
insert
    on
    public.notifications for each row execute function notify_notification();


-- public.personal_info definition

-- Drop table

-- DROP TABLE public.personal_info;

CREATE TABLE public.personal_info ( id serial4 NOT NULL, user_id int4 NOT NULL, first_name text NOT NULL, middle_name text NULL, last_name text NOT NULL, nickname text NULL, profile_picture text NULL, phone text NULL, birthday date NULL, city text NULL, address text NULL, gender public."gender_enum" NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT personal_info_pkey PRIMARY KEY (id), CONSTRAINT personal_info_user_id_key UNIQUE (user_id), CONSTRAINT personal_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_personal_info_user_id ON public.personal_info USING btree (user_id);

-- Table Triggers

create trigger update_personal_info_updated_at before
update
    on
    public.personal_info for each row execute function update_updated_at_column();
create trigger notify_personal_info_changes after
insert
    or
delete
    or
update
    on
    public.personal_info for each row execute function notify_personal_info_changes();


-- public.productivity_scores definition

-- Drop table

-- DROP TABLE public.productivity_scores;

CREATE TABLE public.productivity_scores ( id serial4 NOT NULL, user_id int4 NOT NULL, month_year varchar(7) NOT NULL, productivity_score numeric(5, 2) NOT NULL, total_active_seconds int4 DEFAULT 0 NULL, total_inactive_seconds int4 DEFAULT 0 NULL, total_seconds int4 DEFAULT 0 NULL, active_percentage numeric(5, 2) DEFAULT 0.00 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT productivity_scores_pkey PRIMARY KEY (id), CONSTRAINT productivity_scores_user_id_month_year_key UNIQUE (user_id, month_year), CONSTRAINT productivity_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_productivity_scores_month_top ON public.productivity_scores USING btree (month_year, total_active_seconds DESC) INCLUDE (user_id, active_percentage, total_seconds, total_inactive_seconds, productivity_score);

-- Table Triggers

create trigger update_productivity_scores_updated_at before
update
    on
    public.productivity_scores for each row execute function update_updated_at_column();


-- public.stations definition

-- Drop table

-- DROP TABLE public.stations;

CREATE TABLE public.stations ( id serial4 NOT NULL, station_id varchar(50) NOT NULL, assigned_user_id int4 NULL, asset_id varchar(50) NULL, floor_plan_id int4 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT stations_pkey PRIMARY KEY (id), CONSTRAINT stations_station_id_key UNIQUE (station_id), CONSTRAINT unique_user_per_station UNIQUE (assigned_user_id), CONSTRAINT stations_assigned_user_id_fkey FOREIGN KEY (assigned_user_id) REFERENCES public.users(id) ON DELETE SET NULL, CONSTRAINT stations_floor_plan_id_fkey FOREIGN KEY (floor_plan_id) REFERENCES public.floor_plans(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_stations_updated_at before
update
    on
    public.stations for each row execute function update_updated_at_column();


-- public.talent_pool definition

-- Drop table

-- DROP TABLE public.talent_pool;

CREATE TABLE public.talent_pool ( id serial4 NOT NULL, applicant_id uuid NOT NULL, interested_clients _int4 NULL, last_contact_date timestamptz NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT talent_pool_pkey PRIMARY KEY (id), CONSTRAINT talent_pool_applicant_id_fkey FOREIGN KEY (applicant_id) REFERENCES public.bpoc_recruits(applicant_id));
CREATE INDEX idx_talent_pool_applicant_id ON public.talent_pool USING btree (applicant_id);
CREATE INDEX idx_talent_pool_interested_clients ON public.talent_pool USING gin (interested_clients);


-- public.tickets definition

-- Drop table

-- DROP TABLE public.tickets;

CREATE TABLE public.tickets ( id serial4 NOT NULL, ticket_id varchar(50) NOT NULL, user_id int4 NOT NULL, concern text NOT NULL, details text NULL, status public."ticket_status_enum" DEFAULT 'For Approval'::ticket_status_enum NOT NULL, resolved_by int4 NULL, resolved_at timestamptz DEFAULT now() NULL, created_at timestamptz DEFAULT now() NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL, "position" int4 DEFAULT 0 NOT NULL, category_id int4 NULL, supporting_files _text DEFAULT '{}'::text[] NULL, file_count int4 DEFAULT 0 NULL, role_id int4 NULL, clear bool DEFAULT false NOT NULL, CONSTRAINT check_file_count CHECK (((file_count = array_length(supporting_files, 1)) OR ((file_count = 0) AND (supporting_files = '{}'::text[])))), CONSTRAINT tickets_pkey PRIMARY KEY (id), CONSTRAINT tickets_ticket_id_key UNIQUE (ticket_id), CONSTRAINT tickets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.ticket_categories(id) ON DELETE SET NULL, CONSTRAINT tickets_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id) ON DELETE SET NULL, CONSTRAINT tickets_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL, CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_tickets_active ON public.tickets USING btree (status, "position") WHERE (status <> 'Closed'::ticket_status_enum);
CREATE INDEX idx_tickets_clear_status ON public.tickets USING btree (clear, status);
CREATE INDEX idx_tickets_closed_clear ON public.tickets USING btree (resolved_at, clear) WHERE (status = 'Closed'::ticket_status_enum);
CREATE INDEX idx_tickets_created_at ON public.tickets USING btree (created_at);
CREATE INDEX idx_tickets_resolved_at ON public.tickets USING btree (resolved_at);
CREATE INDEX idx_tickets_status ON public.tickets USING btree (status);
CREATE INDEX idx_tickets_status_clear ON public.tickets USING btree (status, clear);
CREATE INDEX idx_tickets_status_role ON public.tickets USING btree (status, role_id);
CREATE INDEX idx_tickets_user_id ON public.tickets USING btree (user_id);

-- Table Triggers

create trigger update_tickets_updated_at before
update
    on
    public.tickets for each row execute function update_updated_at_column();
create trigger notify_ticket_insert after
insert
    on
    public.tickets for each row execute function notify_ticket_change();
create trigger notify_ticket_update after
update
    on
    public.tickets for each row execute function notify_ticket_change();
create trigger notify_ticket_delete after
delete
    on
    public.tickets for each row execute function notify_ticket_change();
create trigger auto_generate_ticket_id before
insert
    on
    public.tickets for each row
    when (((new.ticket_id is null)
        or ((new.ticket_id)::text = ''::text))) execute function generate_ticket_id();


-- public.weekly_activity_summary definition

-- Drop table

-- DROP TABLE public.weekly_activity_summary;

CREATE TABLE public.weekly_activity_summary ( id serial4 NOT NULL, user_id int4 NOT NULL, week_start_date date NOT NULL, week_end_date date NOT NULL, total_active_seconds int4 DEFAULT 0 NULL, total_inactive_seconds int4 DEFAULT 0 NULL, total_days_active int4 DEFAULT 0 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT weekly_activity_summary_pkey PRIMARY KEY (id), CONSTRAINT weekly_activity_summary_user_id_week_start_date_key UNIQUE (user_id, week_start_date), CONSTRAINT weekly_activity_summary_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_weekly_activity_updated_at before
update
    on
    public.weekly_activity_summary for each row execute function update_updated_at_column();


-- public.clinic_log_medicines definition

-- Drop table

-- DROP TABLE public.clinic_log_medicines;

CREATE TABLE public.clinic_log_medicines ( id serial4 NOT NULL, clinic_log_id int4 NOT NULL, "name" varchar(255) NOT NULL, quantity int4 NOT NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, inventory_item_id int4 NULL, CONSTRAINT clinic_log_medicines_pkey PRIMARY KEY (id), CONSTRAINT clinic_log_medicines_quantity_check CHECK ((quantity > 0)), CONSTRAINT clinic_log_medicines_clinic_log_id_fkey FOREIGN KEY (clinic_log_id) REFERENCES public.clinic_logs(id) ON DELETE CASCADE, CONSTRAINT clinic_log_medicines_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_medical(id) ON DELETE RESTRICT);

-- Table Triggers

create trigger update_clinic_log_medicines_updated_at before
update
    on
    public.clinic_log_medicines for each row execute function update_updated_at_column();
create trigger update_inventory_on_medicine_usage after
insert
    on
    public.clinic_log_medicines for each row execute function update_inventory_stock_on_clinic_log();


-- public.clinic_log_supplies definition

-- Drop table

-- DROP TABLE public.clinic_log_supplies;

CREATE TABLE public.clinic_log_supplies ( id serial4 NOT NULL, clinic_log_id int4 NOT NULL, "name" varchar(255) NOT NULL, quantity int4 NOT NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, inventory_item_id int4 NULL, CONSTRAINT clinic_log_supplies_pkey PRIMARY KEY (id), CONSTRAINT clinic_log_supplies_quantity_check CHECK ((quantity > 0)), CONSTRAINT clinic_log_supplies_clinic_log_id_fkey FOREIGN KEY (clinic_log_id) REFERENCES public.clinic_logs(id) ON DELETE CASCADE, CONSTRAINT clinic_log_supplies_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_medical(id) ON DELETE RESTRICT);

-- Table Triggers

create trigger update_clinic_log_supplies_updated_at before
update
    on
    public.clinic_log_supplies for each row execute function update_updated_at_column();
create trigger update_inventory_on_supply_usage after
insert
    on
    public.clinic_log_supplies for each row execute function update_inventory_stock_on_clinic_log();


-- public.departments definition

-- Drop table

-- DROP TABLE public.departments;

CREATE TABLE public.departments ( id serial4 NOT NULL, "name" text NOT NULL, description text NULL, member_id int4 NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT departments_pkey PRIMARY KEY (id), CONSTRAINT unique_department_id_member UNIQUE (id, member_id), CONSTRAINT unique_department_per_member UNIQUE (name, member_id), CONSTRAINT departments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL);

-- Table Triggers

create trigger update_departments_updated_at before
update
    on
    public.departments for each row execute function update_updated_at_column();


-- public.floor_plan_members definition

-- Drop table

-- DROP TABLE public.floor_plan_members;

CREATE TABLE public.floor_plan_members ( id serial4 NOT NULL, floor_plan_id int4 NOT NULL, member_id int4 NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT floor_plan_members_floor_plan_id_member_id_key UNIQUE (floor_plan_id, member_id), CONSTRAINT floor_plan_members_pkey PRIMARY KEY (id), CONSTRAINT floor_plan_members_floor_plan_id_fkey FOREIGN KEY (floor_plan_id) REFERENCES public.floor_plans(id) ON DELETE CASCADE, CONSTRAINT floor_plan_members_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL);


-- public.member_comments definition

-- Drop table

-- DROP TABLE public.member_comments;

CREATE TABLE public.member_comments ( id serial4 NOT NULL, member_id int4 NOT NULL, user_id int4 NOT NULL, "comment" text NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT member_comments_pkey PRIMARY KEY (id), CONSTRAINT member_comments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE, CONSTRAINT member_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_member_comments_created_at ON public.member_comments USING btree (created_at);
CREATE INDEX idx_member_comments_member_id ON public.member_comments USING btree (member_id);
CREATE INDEX idx_member_comments_member_id_created_at ON public.member_comments USING btree (member_id, created_at DESC);
CREATE INDEX idx_member_comments_user_id ON public.member_comments USING btree (user_id);

-- Table Triggers

create trigger notify_member_comment_insert after
insert
    on
    public.member_comments for each row execute function notify_member_comment_changes();
create trigger notify_member_comment_update after
update
    on
    public.member_comments for each row execute function notify_member_comment_changes();
create trigger notify_member_comment_delete after
delete
    on
    public.member_comments for each row execute function notify_member_comment_changes();
create trigger update_member_comments_updated_at before
update
    on
    public.member_comments for each row execute function update_updated_at_column();


-- public.recruits_comments definition

-- Drop table

-- DROP TABLE public.recruits_comments;

CREATE TABLE public.recruits_comments ( id serial4 NOT NULL, "comment" text NOT NULL, created_by int4 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, comment_type varchar(50) DEFAULT 'general'::character varying NULL, talent_pool_id int4 NULL, CONSTRAINT recruits_comments_pkey PRIMARY KEY (id), CONSTRAINT recruits_comments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id), CONSTRAINT recruits_comments_talent_pool_id_fkey FOREIGN KEY (talent_pool_id) REFERENCES public.talent_pool(id) ON DELETE CASCADE);
CREATE INDEX idx_recruits_comments_created_by ON public.recruits_comments USING btree (created_by);
CREATE INDEX idx_recruits_comments_talent_pool_id ON public.recruits_comments USING btree (talent_pool_id);
CREATE INDEX idx_recruits_comments_type ON public.recruits_comments USING btree (comment_type);


-- public.ticket_comments definition

-- Drop table

-- DROP TABLE public.ticket_comments;

CREATE TABLE public.ticket_comments ( id serial4 NOT NULL, ticket_id int4 NOT NULL, user_id int4 NOT NULL, "comment" text NOT NULL, created_at timestamptz DEFAULT now() NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL, CONSTRAINT ticket_comments_pkey PRIMARY KEY (id), CONSTRAINT ticket_comments_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE, CONSTRAINT ticket_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);


-- public.agents definition

-- Drop table

-- DROP TABLE public.agents;

CREATE TABLE public.agents ( user_id int4 NOT NULL, member_id int4 NULL, department_id int4 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, exp_points int4 DEFAULT 0 NULL, CONSTRAINT agents_pkey PRIMARY KEY (user_id), CONSTRAINT agents_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL, CONSTRAINT agents_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL, CONSTRAINT agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_agents_department_member ON public.agents USING btree (department_id, member_id);
CREATE INDEX idx_agents_listing ON public.agents USING btree (department_id, member_id) INCLUDE (user_id, created_at);
CREATE INDEX idx_agents_member_department ON public.agents USING btree (member_id, department_id);
CREATE INDEX idx_agents_member_user ON public.agents USING btree (member_id, user_id);
CREATE INDEX idx_agents_user_department ON public.agents USING btree (user_id, department_id);

-- Table Triggers

create trigger trigger_agent_member_changes after
update
    on
    public.agents for each row execute function notify_agent_member_changes();
create trigger update_agents_updated_at before
update
    on
    public.agents for each row execute function update_updated_at_column();


-- public.clients definition

-- Drop table

-- DROP TABLE public.clients;

CREATE TABLE public.clients ( user_id int4 NOT NULL, member_id int4 NULL, department_id int4 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT clients_pkey PRIMARY KEY (user_id), CONSTRAINT clients_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL, CONSTRAINT clients_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL, CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
CREATE INDEX idx_clients_member_department ON public.clients USING btree (member_id, department_id);

-- Table Triggers

create trigger trigger_client_member_changes after
update
    on
    public.clients for each row execute function notify_client_member_changes();
create trigger update_clients_updated_at before
update
    on
    public.clients for each row execute function update_updated_at_column();
create trigger notify_client_changes_trigger after
insert
    or
delete
    or
update
    on
    public.clients for each row execute function notify_client_changes();


-- public.job_info definition

-- Drop table

-- DROP TABLE public.job_info;

CREATE TABLE public.job_info ( id serial4 NOT NULL, employee_id varchar(20) NOT NULL, agent_user_id int4 NULL, internal_user_id int4 NULL, job_title text NULL, shift_period text NULL, shift_schedule text NULL, shift_time text NULL, work_setup text NULL, employment_status text NULL, hire_type text NULL, staff_source text NULL, start_date date NULL, exit_date date NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, work_email text NULL, CONSTRAINT chk_job_info_employee_type CHECK ((((agent_user_id IS NOT NULL) AND (internal_user_id IS NULL)) OR ((agent_user_id IS NULL) AND (internal_user_id IS NOT NULL)))), CONSTRAINT job_info_employee_id_key UNIQUE (employee_id), CONSTRAINT job_info_pkey PRIMARY KEY (id), CONSTRAINT job_info_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.agents(user_id) ON DELETE CASCADE, CONSTRAINT job_info_internal_user_id_fkey FOREIGN KEY (internal_user_id) REFERENCES public.internal(user_id) ON DELETE CASCADE);
CREATE INDEX idx_job_info_agent_user ON public.job_info USING btree (agent_user_id);

-- Table Triggers

create trigger update_job_info_updated_at before
update
    on
    public.job_info for each row execute function update_updated_at_column();
create trigger notify_job_info_changes after
insert
    or
delete
    or
update
    on
    public.job_info for each row execute function notify_job_info_changes();



-- DROP FUNCTION public.add_to_talent_pool();

CREATE OR REPLACE FUNCTION public.add_to_talent_pool()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_talent_pool_id int4;
BEGIN
    IF NEW.status = 'passed' AND (OLD.status IS NULL OR OLD.status <> 'passed') THEN
        IF NOT EXISTS (SELECT 1 FROM public.talent_pool WHERE applicant_id = NEW.applicant_id) THEN
            -- Create talent pool row first
            INSERT INTO public.talent_pool (applicant_id, created_at, updated_at)
            VALUES (NEW.applicant_id, NOW(), NOW())
            RETURNING id INTO v_talent_pool_id;

            -- Create comment linked to that talent pool row
            INSERT INTO public.recruits_comments (
                comment, comment_type, created_by, created_at, updated_at, talent_pool_id
            ) VALUES (
                'Added to Talent Pool', 'activity', NULL, NOW(), NOW(), v_talent_pool_id
            );

            RAISE NOTICE 'Applicant % added to talent pool', NEW.applicant_id;
        ELSE
            RAISE NOTICE 'Applicant % already exists in talent pool', NEW.applicant_id;
        END IF;

    ELSIF OLD.status = 'passed' AND NEW.status <> 'passed' THEN
        DELETE FROM public.talent_pool WHERE applicant_id = NEW.applicant_id;
        RAISE NOTICE 'Applicant % removed from talent pool (status changed to: %)', NEW.applicant_id, NEW.status;
    END IF;

    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.aggregate_monthly_activity(date);

CREATE OR REPLACE FUNCTION public.aggregate_monthly_activity(target_date date DEFAULT NULL::date)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    month_start DATE;
    month_end DATE;
    user_record RECORD;
    monthly_record RECORD;
    total_active INTEGER;
    total_inactive INTEGER;
    days_active INTEGER;
BEGIN
    -- Get month dates
    month_start := get_month_start_date(target_date);
    month_end := get_month_end_date(target_date);
    
    -- Loop through all users
    FOR user_record IN 
        SELECT DISTINCT user_id FROM activity_data 
        WHERE today_date BETWEEN month_start AND month_end
    LOOP
        -- Calculate totals for this user in this month
        SELECT 
            COALESCE(SUM(today_active_seconds), 0) as total_active,
            COALESCE(SUM(today_inactive_seconds), 0) as total_inactive,
            COUNT(*) as days_active
        INTO total_active, total_inactive, days_active
        FROM activity_data 
        WHERE user_id = user_record.user_id 
        AND today_date BETWEEN month_start AND month_end;
        
        -- Check if monthly record exists
        SELECT * INTO monthly_record 
        FROM monthly_activity_summary 
        WHERE user_id = user_record.user_id AND month_start_date = month_start;
        
        IF FOUND THEN
            -- Update existing monthly record
            UPDATE monthly_activity_summary 
            SET 
                total_active_seconds = total_active,
                total_inactive_seconds = total_inactive,
                total_days_active = days_active,
                updated_at = NOW()
            WHERE user_id = user_record.user_id AND month_start_date = month_start;
        ELSE
            -- Create new monthly record
            INSERT INTO monthly_activity_summary (
                user_id, month_start_date, month_end_date,
                total_active_seconds, total_inactive_seconds, total_days_active
            ) VALUES (
                user_record.user_id, month_start, month_end,
                total_active, total_inactive, days_active
            );
        END IF;
    END LOOP;
END;
$function$
;

-- DROP FUNCTION public.aggregate_weekly_activity(date);

CREATE OR REPLACE FUNCTION public.aggregate_weekly_activity(target_date date DEFAULT NULL::date)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    week_start DATE;
    week_end DATE;
    user_record RECORD;
    weekly_record RECORD;
    total_active INTEGER;
    total_inactive INTEGER;
    days_active INTEGER;
BEGIN
    -- Get week dates
    week_start := get_week_start_date(target_date);
    week_end := get_week_end_date(target_date);
    
    -- Loop through all users
    FOR user_record IN 
        SELECT DISTINCT user_id FROM activity_data 
        WHERE today_date BETWEEN week_start AND week_end
    LOOP
        -- Calculate totals for this user in this week
        SELECT 
            COALESCE(SUM(today_active_seconds), 0) as total_active,
            COALESCE(SUM(today_inactive_seconds), 0) as total_inactive,
            COUNT(*) as days_active
        INTO total_active, total_inactive, days_active
        FROM activity_data 
        WHERE user_id = user_record.user_id 
        AND today_date BETWEEN week_start AND week_end;
        
        -- Check if weekly record exists
        SELECT * INTO weekly_record 
        FROM weekly_activity_summary 
        WHERE user_id = user_record.user_id AND week_start_date = week_start;
        
        IF FOUND THEN
            -- Update existing weekly record
            UPDATE weekly_activity_summary 
            SET 
                total_active_seconds = total_active,
                total_inactive_seconds = total_inactive,
                total_days_active = days_active,
                updated_at = NOW()
            WHERE user_id = user_record.user_id AND week_start_date = week_start;
        ELSE
            -- Create new weekly record
            INSERT INTO weekly_activity_summary (
                user_id, week_start_date, week_end_date,
                total_active_seconds, total_inactive_seconds, total_days_active
            ) VALUES (
                user_record.user_id, week_start, week_end,
                total_active, total_inactive, days_active
            );
        END IF;
    END LOOP;
END;
$function$
;

-- DROP FUNCTION public.armor(bytea, _text, _text);

CREATE OR REPLACE FUNCTION public.armor(bytea, text[], text[])
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

-- DROP FUNCTION public.armor(bytea);

CREATE OR REPLACE FUNCTION public.armor(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

-- DROP FUNCTION public.auto_aggregate_all_on_activity_change();

CREATE OR REPLACE FUNCTION public.auto_aggregate_all_on_activity_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    week_start DATE;
    month_start DATE;
BEGIN
    -- Only process if the change affects recent data
    IF NEW.today_date >= (NOW() AT TIME ZONE 'Asia/Manila')::date - INTERVAL '60 days' THEN
        -- Get the week and month start dates for the changed record
        SELECT get_week_start_date(NEW.today_date) INTO week_start;
        SELECT get_month_start_date(NEW.today_date) INTO month_start;
        
        -- Aggregate both weekly and monthly data
        PERFORM aggregate_weekly_activity(week_start);
        PERFORM aggregate_monthly_activity(month_start);
        
        -- Log the auto-aggregation (optional, for debugging)
        RAISE LOG 'Auto-aggregated weekly and monthly activity for date % (user_id: %, week: %, month: %)', 
                  NEW.today_date, NEW.user_id, week_start, month_start;
    END IF;
    
    RETURN NEW;
END;
$function$
;

COMMENT ON FUNCTION public.auto_aggregate_all_on_activity_change() IS 'Automatically aggregates weekly and monthly activity data whenever activity_data changes. 
This eliminates the need for frontend polling and ensures data is always up-to-date.';

-- DROP FUNCTION public.calculate_break_duration();

CREATE OR REPLACE FUNCTION public.calculate_break_duration()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- If end_time is being set and start_time exists, calculate duration
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        -- If break was paused, calculate based on pause state
        IF NEW.pause_time IS NOT NULL THEN
            -- If break was resumed, use normal pause calculation
            IF NEW.resume_time IS NOT NULL THEN
                -- Total duration = (pause_time - start_time) + (end_time - resume_time)
                NEW.duration_minutes = EXTRACT(EPOCH FROM (
                    (NEW.pause_time - NEW.start_time) +
                    (NEW.end_time - NEW.resume_time)
                )) / 60;
            ELSE
                -- Break was paused but never resumed (auto-ended)
                -- Use the time from start to pause as the actual break duration
                NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.pause_time - NEW.start_time)) / 60;
            END IF;
        ELSE
            -- Normal calculation for non-paused breaks
            NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
        END IF;
    END IF;
    RETURN NEW;
END;
$function$
;

COMMENT ON FUNCTION public.calculate_break_duration() IS 'Calculates break duration in minutes. For paused breaks that are auto-ended, uses time from start to pause as the actual break duration.';

-- DROP FUNCTION public.calculate_break_windows(int4);

CREATE OR REPLACE FUNCTION public.calculate_break_windows(p_user_id integer)
 RETURNS TABLE(break_type break_type_enum, start_time time without time zone, end_time time without time zone)
 LANGUAGE plpgsql
AS $function$
      DECLARE
          shift_info RECORD;
          shift_start_time TIME;
          shift_end_time TIME;
          is_night_shift BOOLEAN;
      BEGIN
          -- Get agent's actual shift information
          SELECT * INTO shift_info FROM get_agent_shift_info(p_user_id) LIMIT 1;
          
          IF NOT FOUND OR shift_info.shift_time IS NULL THEN
              RETURN; -- No shift configured
          END IF;
          
          -- Parse shift time (e.g., "7:00 AM - 4:00 PM" or "10:00 PM - 7:00 AM")
          shift_start_time := CASE 
              WHEN split_part(shift_info.shift_time, ' - ', 1) LIKE '%PM' AND 
                   NOT split_part(shift_info.shift_time, ' - ', 1) LIKE '12:%PM' THEN
                  (split_part(split_part(shift_info.shift_time, ' - ', 1), ' ', 1)::TIME + INTERVAL '12 hours')::TIME
              WHEN split_part(shift_info.shift_time, ' - ', 1) LIKE '12:%AM' THEN
                  replace(split_part(shift_info.shift_time, ' - ', 1), '12:', '00:')::TIME
              ELSE
                  split_part(split_part(shift_info.shift_time, ' - ', 1), ' ', 1)::TIME
          END;
          
          shift_end_time := CASE 
              WHEN split_part(shift_info.shift_time, ' - ', 2) LIKE '%PM' AND 
                   NOT split_part(shift_info.shift_time, ' - ', 2) LIKE '12:%PM' THEN
                  (split_part(split_part(shift_info.shift_time, ' - ', 2), ' ', 1)::TIME + INTERVAL '12 hours')::TIME
              WHEN split_part(shift_info.shift_time, ' - ', 2) LIKE '12:%PM' THEN
                  (split_part(split_part(shift_info.shift_time, ' - ', 2), ' ', 1)::TIME + INTERVAL '12 hours')::TIME
              ELSE
                  split_part(split_part(shift_info.shift_time, ' - ', 2), ' ', 1)::TIME
          END;
          
          -- Determine if it's a night shift (crosses midnight)
          is_night_shift := shift_start_time > shift_end_time;
          
          -- Return break windows based on shift start time
          -- Morning/First Night break: 2 hours after shift start
          RETURN QUERY SELECT 
              CASE 
                  WHEN shift_info.shift_period = 'Day Shift' THEN 'Morning'::break_type_enum
                  ELSE 'NightFirst'::break_type_enum
              END,
              shift_start_time + INTERVAL '2 hours',
              shift_start_time + INTERVAL '3 hours';
          
          -- Lunch/Night Meal break: 4 hours after shift start
          RETURN QUERY SELECT 
              CASE 
                  WHEN shift_info.shift_period = 'Day Shift' THEN 'Lunch'::break_type_enum
                  ELSE 'NightMeal'::break_type_enum
              END,
              shift_start_time + INTERVAL '4 hours',
              shift_start_time + INTERVAL '7 hours';
          
          -- Afternoon/Second Night break: 7 hours 45 minutes after shift start
          RETURN QUERY SELECT 
              CASE 
                  WHEN shift_info.shift_period = 'Day Shift' THEN 'Afternoon'::break_type_enum
                  ELSE 'NightSecond'::break_type_enum
              END,
              shift_start_time + INTERVAL '7 hours 45 minutes',
              shift_start_time + INTERVAL '8 hours 45 minutes';
      END;
      $function$
;

COMMENT ON FUNCTION public.calculate_break_windows(int4) IS 'Calculates break windows based on agent shift times (force cleaned)';

-- DROP FUNCTION public.can_agent_take_break(int4, break_type_enum);

CREATE OR REPLACE FUNCTION public.can_agent_take_break(p_agent_user_id integer, p_break_type break_type_enum)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
			DECLARE
				break_count INTEGER;
			BEGIN
				-- Check if agent has already used this break type today
				SELECT COUNT(*)
				INTO break_count
				FROM public.break_sessions
				WHERE agent_user_id = p_agent_user_id
				AND break_type = p_break_type
				AND break_date = (NOW() AT TIME ZONE 'Asia/Manila')::date
				AND end_time IS NOT NULL; -- Only count completed breaks
				
				-- Each break type can only be used once per day
				RETURN break_count = 0;
			END;
			$function$
;

-- DROP FUNCTION public.check_break_reminders();

CREATE OR REPLACE FUNCTION public.check_break_reminders()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
            DECLARE
                agent_record RECORD;
                notifications_sent INTEGER := 0;
                check_time TIMESTAMP;
            BEGIN
                check_time := NOW() AT TIME ZONE 'Asia/Manila';

                -- NOTE: Task notifications are now handled by a separate scheduler
                -- This function only handles break-related notifications

                -- Loop through all active agents
                FOR agent_record IN
                    SELECT DISTINCT u.id as user_id
                    FROM users u
                    INNER JOIN agents a ON u.id = a.user_id
                    WHERE u.user_type = 'Agent'
                LOOP
                    -- Check for breaks available soon (15 minutes before)
                    IF is_break_available_soon(agent_record.user_id, 'Morning', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'Morning');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_soon(agent_record.user_id, 'Lunch', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'Lunch');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_soon(agent_record.user_id, 'Afternoon', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'Afternoon');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for night shift breaks available soon
                    IF is_break_available_soon(agent_record.user_id, 'NightFirst', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'NightFirst');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_soon(agent_record.user_id, 'NightMeal', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'NightMeal');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_soon(agent_record.user_id, 'NightSecond', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_soon', 'NightSecond');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for breaks that are currently available/active (ONLY if notification not already sent)
                    IF is_break_available_now(agent_record.user_id, 'Morning', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'Morning', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'Morning');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_now(agent_record.user_id, 'Lunch', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'Lunch', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'Lunch');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_now(agent_record.user_id, 'Afternoon', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'Afternoon', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'Afternoon');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for night shift breaks currently available (ONLY if notification not already sent)
                    IF is_break_available_now(agent_record.user_id, 'NightFirst', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'NightFirst', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'NightFirst');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_now(agent_record.user_id, 'NightMeal', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'NightMeal', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'NightMeal');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_available_now(agent_record.user_id, 'NightSecond', check_time)
                       AND NOT is_break_available_now_notification_sent(agent_record.user_id, 'NightSecond', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'available_now', 'NightSecond');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for missed breaks (30 minutes after break becomes available)
                    -- This will send "You have not taken your [Break] yet!" notifications
                    IF is_break_missed(agent_record.user_id, 'Morning', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'Morning');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_missed(agent_record.user_id, 'Lunch', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'Lunch');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_missed(agent_record.user_id, 'Afternoon', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'Afternoon');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for night shift missed breaks
                    IF is_break_missed(agent_record.user_id, 'NightFirst', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'NightFirst');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_missed(agent_record.user_id, 'NightMeal', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'NightMeal');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_missed(agent_record.user_id, 'NightSecond', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'missed_break', 'NightSecond');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for break window ending soon (15 minutes before break window expires)
                    -- This prevents generic "Break ending soon" notifications
                    IF is_break_window_ending_soon(agent_record.user_id, 'Morning', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'Morning');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_window_ending_soon(agent_record.user_id, 'Lunch', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'Lunch');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_window_ending_soon(agent_record.user_id, 'Afternoon', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'Afternoon');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    -- Check for night shift break windows ending soon
                    IF is_break_window_ending_soon(agent_record.user_id, 'NightFirst', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'NightFirst');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_window_ending_soon(agent_record.user_id, 'NightMeal', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'NightMeal');
                        notifications_sent := notifications_sent + 1;
                    END IF;

                    IF is_break_window_ending_soon(agent_record.user_id, 'NightSecond', check_time) THEN
                        PERFORM create_break_reminder_notification(agent_record.user_id, 'ending_soon', 'NightSecond');
                        notifications_sent := notifications_sent + 1;
                    END IF;
                END LOOP;

                RETURN notifications_sent;
            END;
            $function$
;

-- DROP FUNCTION public.create_break_reminder_notification(int4, text, break_type_enum);

CREATE OR REPLACE FUNCTION public.create_break_reminder_notification(p_agent_user_id integer, p_notification_type text, p_break_type break_type_enum DEFAULT NULL::break_type_enum)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
            DECLARE
                notif_category TEXT := 'break';
                notif_type TEXT := 'info';
                title_text TEXT;
                message_text TEXT;
                payload_data JSONB;
                break_name TEXT;
                current_time_manila TIMESTAMP;
                last_notification_time TIMESTAMP;
                minutes_since_last_notification INTEGER;
                detected_break_type break_type_enum;
            BEGIN
                -- Get current Manila time for logic calculations
                current_time_manila := NOW() AT TIME ZONE 'Asia/Manila';

                -- For ending_soon, detect the current break type based on time and break windows
                IF p_notification_type = 'ending_soon' AND p_break_type IS NULL THEN
                    -- Find which break window is ending soon by checking all break windows
                    SELECT bw.break_type INTO detected_break_type
                    FROM calculate_break_windows(p_agent_user_id) bw
                    WHERE bw.end_time > (current_time_manila::TIME - INTERVAL '17 minutes')
                    AND bw.end_time <= (current_time_manila::TIME + INTERVAL '2 minutes')
                    ORDER BY bw.end_time ASC
                    LIMIT 1;
                    
                    -- If we found a break window ending soon, use it
                    IF detected_break_type IS NOT NULL THEN
                        p_break_type := detected_break_type;
                    END IF;
                END IF;

                -- Determine break name for display
                break_name := CASE p_break_type
                    WHEN 'Morning' THEN 'Morning break'
                    WHEN 'Lunch' THEN 'Lunch break'
                    WHEN 'Afternoon' THEN 'Afternoon break'
                    WHEN 'NightFirst' THEN 'First night break'
                    WHEN 'NightMeal' THEN 'Night meal break'
                    WHEN 'NightSecond' THEN 'Second night break'
                    ELSE 'Break'
                END;

                -- Set notification content based on type
                IF p_notification_type = 'available_soon' THEN
                    title_text := break_name || ' available soon';
                    message_text := 'Your ' || break_name || ' will be available in 15 minutes';
                    notif_type := 'info';
                    payload_data := jsonb_build_object(
                        'reminder_type', 'available_soon',
                        'break_type', p_break_type,
                        'action_url', '/status/breaks'
                    );
                ELSIF p_notification_type = 'available_now' THEN
                    title_text := break_name || ' is now available';
                    message_text := 'Your ' || break_name || ' is now available! You can take it now.';
                    notif_type := 'success';
                    payload_data := jsonb_build_object(
                        'reminder_type', 'available_now',
                        'break_type', p_break_type,
                        'action_url', '/status/breaks'
                    );
                ELSIF p_notification_type = 'ending_soon' THEN
                    title_text := break_name || ' ending soon';
                    -- FIXED: More accurate message since the actual window is 14-16 minutes
                    message_text := 'Your ' || break_name || ' will end soon';
                    notif_type := 'warning';
                    payload_data := jsonb_build_object(
                        'reminder_type', 'ending_soon',
                        'break_type', p_break_type,
                        'action_url', '/status/breaks'
                    );
                ELSIF p_notification_type = 'missed_break' THEN
                    title_text := 'You have not taken your ' || break_name || ' yet!';
                    message_text := 'Your ' || break_name || ' was available but you haven''t taken it yet. Please take your break soon.';
                    notif_type := 'warning';
                    payload_data := jsonb_build_object(
                        'reminder_type', 'missed_break',
                        'break_type', p_break_type,
                        'action_url', '/status/breaks'
                    );
                ELSE
                    RETURN; -- Invalid notification type
                END IF;

                -- FIXED: Enhanced duplicate prevention logic
                -- Check for similar notification in the last 60 minutes using UTC timestamps
                SELECT MAX(created_at) INTO last_notification_time
                FROM notifications
                WHERE user_id = p_agent_user_id
                AND category = notif_category
                AND title = title_text
                AND created_at > (NOW() - INTERVAL '60 minutes');

                -- If a recent notification exists, check if enough time has passed
                IF last_notification_time IS NOT NULL THEN
                    -- Calculate minutes since last notification
                    minutes_since_last_notification := EXTRACT(EPOCH FROM (NOW() - last_notification_time)) / 60;
                    
                    -- Different cooldown periods for different notification types
                    IF p_notification_type = 'available_soon' THEN
                        -- Available soon: Only send once per 15-minute window
                        IF minutes_since_last_notification < 15 THEN
                            RETURN; -- Too soon, don't send
                        END IF;
                    ELSIF p_notification_type = 'available_now' THEN
                        -- Available now: Only send once per break window
                        IF minutes_since_last_notification < 60 THEN
                            RETURN; -- Too soon, don't send
                        END IF;
                    ELSIF p_notification_type = 'ending_soon' THEN
                        -- Ending soon: Only send once per 15-minute window
                        IF minutes_since_last_notification < 15 THEN
                            RETURN; -- Too soon, don't send
                        END IF;
                    ELSIF p_notification_type = 'missed_break' THEN
                        -- Missed break: Only send once per 30-minute reminder cycle
                        IF minutes_since_last_notification < 30 THEN
                            RETURN; -- Too soon, don't send
                        END IF;
                    END IF;
                END IF;

                -- Insert the notification (database will use default UTC timestamp)
                INSERT INTO notifications (user_id, category, type, title, message, payload)
                VALUES (p_agent_user_id, notif_category, notif_type, title_text, message_text, payload_data);
            END;
            $function$
;

COMMENT ON FUNCTION public.create_break_reminder_notification(int4, text, break_type_enum) IS 'Fixed: Now properly detects break types for ending_soon notifications';

-- DROP FUNCTION public.create_break_status_notification();

CREATE OR REPLACE FUNCTION public.create_break_status_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  title_text text;
  message_text text;
  notif_type text := 'info';
BEGIN
  IF TG_OP = 'INSERT' THEN
    title_text := 'Break started';
    message_text := format('%s break started', NEW.break_type);
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.end_time IS NOT NULL AND (OLD.end_time IS NULL OR NEW.end_time <> OLD.end_time) THEN
      title_text := 'Break ended';
      message_text := format('%s break completed (%s min)', NEW.break_type, COALESCE(NEW.duration_minutes, 0));
      notif_type := 'success';
    ELSIF NEW.pause_time IS NOT NULL AND (OLD.pause_time IS DISTINCT FROM NEW.pause_time) THEN
      title_text := 'Break paused';
      message_text := format('%s break paused', NEW.break_type);
      notif_type := 'warning';
    ELSIF NEW.resume_time IS NOT NULL AND (OLD.resume_time IS DISTINCT FROM NEW.resume_time) THEN
      title_text := 'Break resumed';
      message_text := format('%s break resumed', NEW.break_type);
    ELSE
      RETURN NEW;
    END IF;
  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (user_id, category, type, title, message, payload)
  VALUES (
    NEW.agent_user_id,
    'break',
    notif_type,
    title_text,
    message_text,
    json_build_object('break_type', NEW.break_type, 'break_session_id', NEW.id, 'break_date', NEW.break_date, 'action_url', '/status/breaks')
  );
  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.crypt(text, text);

CREATE OR REPLACE FUNCTION public.crypt(text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_crypt$function$
;

-- DROP FUNCTION public.dearmor(text);

CREATE OR REPLACE FUNCTION public.dearmor(text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_dearmor$function$
;

-- DROP FUNCTION public.decrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.decrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt$function$
;

-- DROP FUNCTION public.decrypt_iv(bytea, bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.decrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt_iv$function$
;

-- DROP FUNCTION public.digest(text, text);

CREATE OR REPLACE FUNCTION public.digest(text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

-- DROP FUNCTION public.digest(bytea, text);

CREATE OR REPLACE FUNCTION public.digest(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

-- DROP FUNCTION public.encrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.encrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt$function$
;

-- DROP FUNCTION public.encrypt_iv(bytea, bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.encrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt_iv$function$
;

-- DROP FUNCTION public.gen_random_bytes(int4);

CREATE OR REPLACE FUNCTION public.gen_random_bytes(integer)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_random_bytes$function$
;

-- DROP FUNCTION public.gen_random_uuid();

CREATE OR REPLACE FUNCTION public.gen_random_uuid()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE
AS '$libdir/pgcrypto', $function$pg_random_uuid$function$
;

-- DROP FUNCTION public.gen_salt(text, int4);

CREATE OR REPLACE FUNCTION public.gen_salt(text, integer)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt_rounds$function$
;

-- DROP FUNCTION public.gen_salt(text);

CREATE OR REPLACE FUNCTION public.gen_salt(text)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt$function$
;

-- DROP FUNCTION public.generate_ticket_id();

CREATE OR REPLACE FUNCTION public.generate_ticket_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.ticket_id := 'TKT-' || LPAD(nextval('ticket_id_seq')::text, 6, '0');
  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.get_active_meeting(int4);

CREATE OR REPLACE FUNCTION public.get_active_meeting(p_user_id integer)
 RETURNS TABLE(id integer, title character varying, description text, start_time timestamp with time zone, end_time timestamp with time zone, duration_minutes integer, meeting_type character varying, status character varying, is_in_meeting boolean, actual_start_time timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.description,
        m.start_time,
        m.end_time,
        m.duration_minutes,
        m.meeting_type,
        m.status,
        m.is_in_meeting,
        m.actual_start_time
    FROM meetings m
    WHERE m.agent_user_id = p_user_id
    AND m.status = 'in-progress'
    ORDER BY m.created_at DESC
    LIMIT 1;
END;
$function$
;

-- DROP FUNCTION public.get_agent_daily_breaks(int4);

CREATE OR REPLACE FUNCTION public.get_agent_daily_breaks(p_agent_user_id integer)
 RETURNS TABLE(break_type break_type_enum, break_count integer, total_minutes integer, can_take_break boolean)
 LANGUAGE plpgsql
AS $function$
			BEGIN
				RETURN QUERY
				WITH break_types AS (
					SELECT unnest(enum_range(NULL::break_type_enum)) AS bt
				),
				today_breaks AS (
					SELECT 
						bs.break_type,
						COUNT(*) as break_count,
						COALESCE(SUM(bs.duration_minutes), 0) as total_minutes
					FROM public.break_sessions bs
					WHERE bs.agent_user_id = p_agent_user_id
					AND bs.break_date = (NOW() AT TIME ZONE 'Asia/Manila')::date
					AND bs.end_time IS NOT NULL
					GROUP BY bs.break_type
				)
				SELECT 
					bt.bt as break_type,
					COALESCE(tb.break_count, 0)::INTEGER as break_count,
					COALESCE(tb.total_minutes, 0)::INTEGER as total_minutes,
					(COALESCE(tb.break_count, 0) = 0) as can_take_break
				FROM break_types bt
				LEFT JOIN today_breaks tb ON bt.bt = tb.break_type
				ORDER BY bt.bt;
			END;
			$function$
;

-- DROP FUNCTION public.get_agent_shift_info(int4);

CREATE OR REPLACE FUNCTION public.get_agent_shift_info(p_agent_user_id integer)
 RETURNS TABLE(user_id integer, shift_time text, shift_period text, shift_schedule text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        u.id as user_id,
        ji.shift_time,  -- Remove COALESCE - return actual value or NULL
        ji.shift_period, -- Remove COALESCE - return actual value or NULL
        ji.shift_schedule -- Remove COALESCE - return actual value or NULL
    FROM users u
    LEFT JOIN agents a ON u.id = a.user_id
    LEFT JOIN job_info ji ON ji.agent_user_id = a.user_id
    WHERE u.id = p_agent_user_id;
END;
$function$
;

COMMENT ON FUNCTION public.get_agent_shift_info(int4) IS 'Gets agent shift information from job_info table with fallback defaults';

-- DROP FUNCTION public.get_local_break_date(text);

CREATE OR REPLACE FUNCTION public.get_local_break_date(p_timezone text DEFAULT 'Asia/Manila'::text)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE p_timezone)::DATE;
END;
$function$
;

-- DROP FUNCTION public.get_meeting_statistics(int4, int4);

CREATE OR REPLACE FUNCTION public.get_meeting_statistics(p_user_id integer, p_days integer DEFAULT 7)
 RETURNS TABLE(total_meetings integer, completed_meetings integer, cancelled_meetings integer, total_duration_minutes integer, avg_duration_minutes numeric, today_meetings integer, today_duration_minutes integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*)::INTEGER as total_count,
            COUNT(*) FILTER (WHERE status = 'completed')::INTEGER as completed_count,
            COUNT(*) FILTER (WHERE status = 'cancelled')::INTEGER as cancelled_count,
            COALESCE(SUM(duration_minutes), 0)::INTEGER as total_duration,
            COALESCE(AVG(duration_minutes), 0) as avg_duration,
            COUNT(*) FILTER (WHERE DATE(created_at) = now()::date)::INTEGER as today_count,
            COALESCE(SUM(duration_minutes) FILTER (WHERE DATE(created_at) = now()::date), 0)::INTEGER as today_duration
        FROM meetings
        WHERE agent_user_id = p_user_id
        AND created_at >= now()::date - INTERVAL '1 day' * p_days
    )
    SELECT 
        total_count,
        completed_count,
        cancelled_count,
        total_duration,
        avg_duration,
        today_count,
        today_duration
    FROM stats;
END;
$function$
;

-- DROP FUNCTION public.get_month_end_date(date);

CREATE OR REPLACE FUNCTION public.get_month_end_date(input_date date DEFAULT NULL::date)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
DECLARE
    target_date DATE;
    month_end DATE;
BEGIN
    -- Use provided date or current Philippines date
    IF input_date IS NULL THEN
        target_date := (NOW() AT TIME ZONE 'Asia/Manila')::date;
    ELSE
        target_date := input_date;
    END IF;
    
    -- Get last day of the month
    month_end := (DATE_TRUNC('month', target_date) + INTERVAL '1 month' - INTERVAL '1 day')::date;
    
    RETURN month_end;
END;
$function$
;

-- DROP FUNCTION public.get_month_start_date(date);

CREATE OR REPLACE FUNCTION public.get_month_start_date(input_date date DEFAULT NULL::date)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
DECLARE
    target_date DATE;
    month_start DATE;
BEGIN
    -- Use provided date or current Philippines date
    IF input_date IS NULL THEN
        target_date := (NOW() AT TIME ZONE 'Asia/Manila')::date;
    ELSE
        target_date := input_date;
    END IF;
    
    -- Get 1st day of the month
    month_start := DATE_TRUNC('month', target_date)::date;
    
    RETURN month_start;
END;
$function$
;

-- DROP FUNCTION public.get_month_year(date);

CREATE OR REPLACE FUNCTION public.get_month_year(input_date date DEFAULT NULL::date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    target_date DATE;
    month_year VARCHAR(7);
BEGIN
    -- Use provided date or current Philippines date
    IF input_date IS NULL THEN
        target_date := (NOW() AT TIME ZONE 'Asia/Manila')::date;
    ELSE
        target_date := input_date;
    END IF;
    
    -- Format as YYYY-MM
    month_year := TO_CHAR(target_date, 'YYYY-MM');
    
    RETURN month_year;
END;
$function$
;

-- DROP FUNCTION public.get_user_meetings(int4, int4);

CREATE OR REPLACE FUNCTION public.get_user_meetings(p_user_id integer, p_days integer DEFAULT 7)
 RETURNS TABLE(id integer, title character varying, description text, start_time timestamp with time zone, end_time timestamp with time zone, duration_minutes integer, meeting_type character varying, status character varying, is_in_meeting boolean, actual_start_time timestamp with time zone, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.description,
        m.start_time,
        m.end_time,
        m.duration_minutes,
        m.meeting_type,
        m.status,
        m.is_in_meeting,
        m.actual_start_time,
        m.created_at
    FROM meetings m
    WHERE m.agent_user_id = p_user_id
    AND m.created_at >= now()::date - INTERVAL '1 day' * p_days
    ORDER BY m.created_at DESC;
END;
$function$
;

-- DROP FUNCTION public.get_week_end_date(date);

CREATE OR REPLACE FUNCTION public.get_week_end_date(input_date date DEFAULT NULL::date)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Return Sunday of the week
    RETURN get_week_start_date(input_date) + 6;
END;
$function$
;

-- DROP FUNCTION public.get_week_start_date(date);

CREATE OR REPLACE FUNCTION public.get_week_start_date(input_date date DEFAULT NULL::date)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
DECLARE
    target_date DATE;
    week_start DATE;
BEGIN
    -- Use provided date or current Philippines date
    IF input_date IS NULL THEN
        target_date := (NOW() AT TIME ZONE 'Asia/Manila')::date;
    ELSE
        target_date := input_date;
    END IF;
    
    -- Get Monday of the week (week starts on Monday)
    week_start := target_date - (EXTRACT(DOW FROM target_date) - 1)::INTEGER;
    
    -- Adjust for Sunday (DOW = 0)
    IF EXTRACT(DOW FROM target_date) = 0 THEN
        week_start := target_date - 6;
    END IF;
    
    RETURN week_start;
END;
$function$
;

-- DROP FUNCTION public.hmac(text, text, text);

CREATE OR REPLACE FUNCTION public.hmac(text, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

-- DROP FUNCTION public.hmac(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.hmac(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

-- DROP FUNCTION public.is_break_available_now(int4, break_type_enum, timestamp);

CREATE OR REPLACE FUNCTION public.is_break_available_now(p_agent_user_id integer, p_break_type break_type_enum, p_current_time timestamp without time zone DEFAULT NULL::timestamp without time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
      DECLARE
          shift_info RECORD;
          current_time_manila TIMESTAMP;
          current_time_only TIME;
          break_start_time TIME;
          break_end_time TIME;
          break_already_taken BOOLEAN;
      BEGIN
          -- Get agent's actual shift information
          SELECT * INTO shift_info FROM get_agent_shift_info(p_agent_user_id) LIMIT 1;
          
          IF NOT FOUND OR shift_info.shift_time IS NULL THEN
              RETURN FALSE; -- No shift configured
          END IF;
          
          -- Get current Manila time
          IF p_current_time IS NULL THEN
              current_time_manila := CURRENT_TIMESTAMP + INTERVAL '8 hours';
          ELSE
              current_time_manila := p_current_time;
          END IF;
          
          current_time_only := current_time_manila::TIME;
          
          -- Check if break was already taken today
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = current_time_manila::DATE
              AND end_time IS NOT NULL
          ) INTO break_already_taken;
          
          IF break_already_taken THEN
              RETURN FALSE; -- Break already taken
          END IF;
          
          -- Get break window from calculate_break_windows
          SELECT start_time, end_time INTO break_start_time, break_end_time
          FROM calculate_break_windows(p_agent_user_id)
          WHERE break_type = p_break_type
          LIMIT 1;
          
          IF NOT FOUND THEN
              RETURN FALSE; -- No break window for this type
          END IF;
          
          -- Check if current time is within the break window
          RETURN current_time_only >= break_start_time AND current_time_only < break_end_time;
      END;
      $function$
;

-- DROP FUNCTION public.is_break_available_now_notification_sent(int4, break_type_enum, timestamp);

CREATE OR REPLACE FUNCTION public.is_break_available_now_notification_sent(p_agent_user_id integer, p_break_type break_type_enum, p_check_time timestamp without time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    break_start_time TIMESTAMP;
    break_end_time TIMESTAMP;
    notification_exists BOOLEAN;
BEGIN
    -- Get the break window for the current day
    SELECT 
        (CURRENT_DATE + (SPLIT_PART(ji.shift_time, ' - ', 1))::time) AT TIME ZONE 'Asia/Manila' INTO break_start_time
    FROM job_info ji 
    WHERE ji.agent_user_id = p_agent_user_id;
    
    IF break_start_time IS NULL THEN
        RETURN FALSE; -- No shift configured
    END IF;
    
    -- Calculate break start time based on break type
    CASE p_break_type
        WHEN 'Lunch' THEN
            break_start_time := break_start_time + INTERVAL '4 hours'; -- 4 hours after shift start
            break_end_time := break_start_time + INTERVAL '1 hour'; -- 1 hour break
        WHEN 'Morning' THEN
            break_start_time := break_start_time + INTERVAL '2 hours'; -- 2 hours after shift start
            break_end_time := break_start_time + INTERVAL '15 minutes'; -- 15 minute break
        WHEN 'Afternoon' THEN
            break_start_time := break_start_time + INTERVAL '6 hours'; -- 6 hours after shift start
            break_end_time := break_start_time + INTERVAL '15 minutes'; -- 15 minute break
        ELSE
            RETURN FALSE; -- Unknown break type
    END CASE;
    
    -- Check if "available_now" notification was already sent for this break period today
    -- We check for notifications sent today, not just within the current break window
    SELECT EXISTS(
        SELECT 1 FROM notifications 
        WHERE user_id = p_agent_user_id 
        AND category = 'break'
        AND payload->>'reminder_type' = 'available_now'
        AND payload->>'break_type' = p_break_type::text
        AND DATE(created_at AT TIME ZONE 'Asia/Manila') = CURRENT_DATE
    ) INTO notification_exists;
    
    RETURN notification_exists;
END;
$function$
;

COMMENT ON FUNCTION public.is_break_available_now_notification_sent(int4, break_type_enum, timestamp) IS 'Checks if "available_now" notification was already sent for current break period';

-- DROP FUNCTION public.is_break_available_soon(int4, break_type_enum, timestamp);

CREATE OR REPLACE FUNCTION public.is_break_available_soon(p_agent_user_id integer, p_break_type break_type_enum, p_current_time timestamp without time zone DEFAULT NULL::timestamp without time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
      DECLARE
          shift_info RECORD;
          current_time_manila TIMESTAMP;
          current_time_only TIME;
          break_start_time TIME;
          minutes_until_break INTEGER;
          break_already_taken BOOLEAN;
      BEGIN
          -- Get agent's actual shift information
          SELECT * INTO shift_info FROM get_agent_shift_info(p_agent_user_id) LIMIT 1;
          
          IF NOT FOUND OR shift_info.shift_time IS NULL THEN
              RETURN FALSE; -- No shift configured
          END IF;
          
          -- Get current Manila time
          IF p_current_time IS NULL THEN
              current_time_manila := CURRENT_TIMESTAMP + INTERVAL '8 hours';
          ELSE
              current_time_manila := p_current_time;
          END IF;
          
          current_time_only := current_time_manila::TIME;
          
          -- Check if break was already taken today
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = current_time_manila::DATE
              AND end_time IS NOT NULL
          ) INTO break_already_taken;
          
          IF break_already_taken THEN
              RETURN FALSE; -- Break already taken
          END IF;
          
          -- Get break start time from calculate_break_windows
          SELECT start_time INTO break_start_time
          FROM calculate_break_windows(p_agent_user_id)
          WHERE break_type = p_break_type
          LIMIT 1;
          
          IF NOT FOUND THEN
              RETURN FALSE; -- No break window for this type
          END IF;
          
          -- Calculate minutes until break starts
          minutes_until_break := EXTRACT(EPOCH FROM (break_start_time - current_time_only)) / 60;
          
          -- Handle day rollover for night shifts
          IF minutes_until_break < -720 THEN -- More than 12 hours in the past
              minutes_until_break := minutes_until_break + 1440; -- Add 24 hours
          END IF;
          
          -- Return true if break starts within the next 15 minutes
          RETURN minutes_until_break > 0 AND minutes_until_break <= 15;
      END;
      $function$
;

-- DROP FUNCTION public.is_break_missed(int4, break_type_enum, timestamp);

CREATE OR REPLACE FUNCTION public.is_break_missed(p_agent_user_id integer, p_break_type break_type_enum, p_current_time timestamp without time zone DEFAULT NULL::timestamp without time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
      DECLARE
          shift_info RECORD;
          current_time_manila TIMESTAMP;
          current_time_only TIME;
          break_start_time TIME;
          break_end_time TIME;
          minutes_since_break_start INTEGER;
          break_already_taken BOOLEAN;
          break_currently_active BOOLEAN;  -- NEW: Check for currently active breaks
          current_date_manila DATE;
          last_notification_time TIMESTAMP;
          minutes_since_last_notification INTEGER;
      BEGIN
          -- Get agent's actual shift information
          SELECT * INTO shift_info FROM get_agent_shift_info(p_agent_user_id) LIMIT 1;
          
          IF NOT FOUND OR shift_info.shift_time IS NULL THEN
              RETURN FALSE; -- No shift configured
          END IF;
          
          -- Get current Manila time
          IF p_current_time IS NULL THEN
              current_time_manila := CURRENT_TIMESTAMP + INTERVAL '8 hours';
          ELSE
              current_time_manila := p_current_time;
          END IF;
          
          current_time_only := current_time_manila::TIME;
          current_date_manila := current_time_manila::DATE;
          
          -- NEW: Check if break is currently active (being used right now)
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = current_date_manila
              AND end_time IS NULL  -- Currently active break
          ) INTO break_currently_active;
          
          IF break_currently_active THEN
              RETURN FALSE; -- Break is currently active, don't send reminder
          END IF;
          
          -- Check if break was already taken today
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = current_date_manila
              AND end_time IS NOT NULL
          ) INTO break_already_taken;
          
          IF break_already_taken THEN
              RETURN FALSE; -- Break already taken
          END IF;
          
          -- Get break window from calculate_break_windows
          SELECT start_time, end_time INTO break_start_time, break_end_time
          FROM calculate_break_windows(p_agent_user_id)
          WHERE break_type = p_break_type
          LIMIT 1;
          
          IF NOT FOUND THEN
              RETURN FALSE; -- No break window for this type
          END IF;
          
          -- Check if we're within the break window
          IF current_time_only < break_start_time OR current_time_only >= break_end_time THEN
              RETURN FALSE; -- Outside break window
          END IF;
          
          -- Calculate minutes since break start
          minutes_since_break_start := EXTRACT(EPOCH FROM (current_time_only - break_start_time)) / 60;
          
          -- Check if it's been at least 30 minutes since break start
          IF minutes_since_break_start < 30 THEN
              RETURN FALSE; -- Too early to send reminder
          END IF;
          
          -- Check if we're too close to break end (within last 15 minutes)
          IF EXTRACT(EPOCH FROM (break_end_time - current_time_only)) / 60 < 15 THEN
              RETURN FALSE; -- Too close to break end
          END IF;
          
          -- Check if we've sent a notification in the last 25 minutes (prevent spam)
          SELECT MAX(created_at) INTO last_notification_time
          FROM notifications 
          WHERE user_id = p_agent_user_id 
          AND category = 'break' 
          AND payload->>'break_type' = p_break_type::TEXT
          AND payload->>'reminder_type' = 'missed_break'
          AND created_at > current_time_manila - INTERVAL '1 hour';
          
          IF last_notification_time IS NOT NULL THEN
              minutes_since_last_notification := EXTRACT(EPOCH FROM (current_time_manila - last_notification_time)) / 60;
              IF minutes_since_last_notification < 25 THEN
                  RETURN FALSE; -- Too soon since last notification
              END IF;
          END IF;
          
          -- Send reminder every 30 minutes during the break window
          -- This ensures reminders at :00 and :30 of each hour
          RETURN (minutes_since_break_start % 30) < 5;
      END;
      $function$
;

COMMENT ON FUNCTION public.is_break_missed(int4, break_type_enum, timestamp) IS 'FIXED: Now excludes currently active breaks from missed break notifications. Users will not receive "you have not taken" notifications while they are currently on break.';

-- DROP FUNCTION public.is_break_window_ending_soon(int4, break_type_enum, timestamptz);

CREATE OR REPLACE FUNCTION public.is_break_window_ending_soon(p_agent_user_id integer, p_break_type break_type_enum, p_check_time timestamp with time zone DEFAULT now())
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
      DECLARE
          shift_info RECORD;
          break_windows RECORD;
          current_time_only TIME;
          break_end_time TIME;
          minutes_until_expiry INTEGER;
          break_already_taken BOOLEAN;
          break_currently_active BOOLEAN;  -- NEW: Check for currently active breaks
      BEGIN
          -- Get agent shift information
          SELECT * INTO shift_info FROM get_agent_shift_info(p_agent_user_id) LIMIT 1;
          
          IF NOT FOUND OR shift_info.shift_time IS NULL THEN
              RETURN FALSE;
          END IF;
          
          -- NEW: Check if break is currently active (being used right now)
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = (p_check_time AT TIME ZONE 'Asia/Manila')::DATE
              AND end_time IS NULL  -- Currently active break
          ) INTO break_currently_active;
          
          IF break_currently_active THEN
              RETURN FALSE; -- Break is currently active, don't send ending soon notification
          END IF;
          
          -- Check if break was already taken today
          SELECT EXISTS(
              SELECT 1 FROM break_sessions
              WHERE agent_user_id = p_agent_user_id
              AND break_type = p_break_type
              AND break_date = (p_check_time AT TIME ZONE 'Asia/Manila')::DATE
              AND end_time IS NOT NULL
          ) INTO break_already_taken;
          
          IF break_already_taken THEN
              RETURN FALSE; -- Break already taken, no need for ending soon notification
          END IF;
          
          -- Get break windows using user_id
          SELECT * INTO break_windows FROM calculate_break_windows(p_agent_user_id)
          WHERE break_type = p_break_type LIMIT 1;
          
          IF NOT FOUND THEN
              RETURN FALSE;
          END IF;
          
          -- SIMPLE APPROACH: Extract time part directly from input timestamp
          -- Treat the input as local time (Manila time)
          current_time_only := p_check_time::TIME;
          break_end_time := break_windows.end_time;
          
          -- Calculate minutes until break window expires
          IF current_time_only > break_end_time THEN
              -- Current time is after break end time, so it's already ended
              minutes_until_expiry := 0;
          ELSE
              -- Calculate minutes until end
              minutes_until_expiry := EXTRACT(EPOCH FROM (break_end_time - current_time_only)) / 60;
          END IF;
          
          -- Return true if break window is ending in 15 minutes (with 1-minute tolerance)
          -- This means between 14-16 minutes before the end (narrower, more precise window)
          RETURN (minutes_until_expiry >= 14 AND minutes_until_expiry <= 16);
      END;
      $function$
;

COMMENT ON FUNCTION public.is_break_window_ending_soon(int4, break_type_enum, timestamptz) IS 'FIXED: Now excludes currently active breaks from break window ending soon notifications. Users will not receive "break ending soon" notifications while they are currently on break.';

-- DROP FUNCTION public.is_user_in_meeting(int4);

CREATE OR REPLACE FUNCTION public.is_user_in_meeting(p_user_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    meeting_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO meeting_count
    FROM meetings
    WHERE agent_user_id = p_user_id
    AND is_in_meeting = TRUE
    AND status = 'in-progress';
    
    RETURN meeting_count > 0;
END;
$function$
;

-- DROP FUNCTION public.notify_activity_data_change();

CREATE OR REPLACE FUNCTION public.notify_activity_data_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    notification_data JSONB;
BEGIN
    -- Build notification payload
    notification_data := jsonb_build_object(
        'user_id', NEW.user_id,
        'action', TG_OP,
        'table', 'activity_data',
        'data', jsonb_build_object(
            'id', NEW.id,
            'user_id', NEW.user_id,
            'is_currently_active', NEW.is_currently_active,
            'today_active_seconds', NEW.today_active_seconds,
            'today_inactive_seconds', NEW.today_inactive_seconds,
            'today_date', NEW.today_date,
            'last_session_start', NEW.last_session_start,
            'created_at', NEW.created_at,
            'updated_at', NEW.updated_at
        )
    );
    
    -- Send notification to the activity_data_change channel
    PERFORM pg_notify('activity_data_change', notification_data::text);
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.notify_agent_member_changes();

CREATE OR REPLACE FUNCTION public.notify_agent_member_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  old_company_id INTEGER;
  new_company_id INTEGER;
  old_employee_count INTEGER;
  new_employee_count INTEGER;
  agent_data JSON;
BEGIN
  -- Only send notification if member_id changed (assignment change)
  IF TG_OP = 'UPDATE' AND (OLD.member_id IS DISTINCT FROM NEW.member_id) THEN
    -- Get old and new company IDs
    old_company_id := OLD.member_id;
    new_company_id := NEW.member_id;
    
    -- Get full agent data by joining with correct tables
    SELECT json_build_object(
      'user_id', u.id,
      'first_name', pi.first_name,        -- ✅ From personal_info
      'last_name', pi.last_name,          -- ✅ From personal_info
      'profile_picture', pi.profile_picture, -- ✅ From personal_info
      'employee_id', ji.employee_id,      -- ✅ From job_info
      'job_title', ji.job_title,          -- ✅ From job_info
      'member_id', a.member_id
    ) INTO agent_data
    FROM public.agents a
    JOIN public.users u ON a.user_id = u.id
    JOIN public.personal_info pi ON a.user_id = pi.user_id  -- ✅ JOIN personal_info
    LEFT JOIN public.job_info ji ON a.user_id = ji.agent_user_id  -- ✅ LEFT JOIN job_info
    WHERE a.user_id = NEW.user_id;
    
    -- Calculate employee counts for old and new companies
    IF old_company_id IS NOT NULL THEN
      SELECT COUNT(*) INTO old_employee_count 
      FROM public.agents 
      WHERE member_id = old_company_id;
    ELSE
      old_employee_count := NULL;
    END IF;
    
    IF new_company_id IS NOT NULL THEN
      SELECT COUNT(*) INTO new_employee_count 
      FROM public.agents 
      WHERE member_id = new_company_id;
    ELSE
      new_employee_count := NULL;
    END IF;
    
    PERFORM pg_notify(
      'agent_assignment_changes',
      json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'record', COALESCE(agent_data, row_to_json(NEW)),
        'old_record', row_to_json(OLD),
        'count_updates', json_build_object(
          'old_company_id', old_company_id,
          'old_employee_count', old_employee_count,
          'new_company_id', new_company_id,
          'new_employee_count', new_employee_count
        ),
        'timestamp', now()
      )::text
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_applicant_changes();

CREATE OR REPLACE FUNCTION public.notify_applicant_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    payload JSON;
BEGIN
    -- Create payload based on trigger operation
    CASE TG_OP
        WHEN 'INSERT' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'INSERT',
                'record', row_to_json(NEW),
                'timestamp', now()
            );
        WHEN 'UPDATE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'UPDATE',
                'record', row_to_json(NEW),
                'old_record', row_to_json(OLD),
                'timestamp', now()
            );
        WHEN 'DELETE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'DELETE',
                'record', row_to_json(OLD),
                'timestamp', now()
            );
    END CASE;
    
    -- Send notification
    PERFORM pg_notify('applicant_changes', payload::text);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_break_sessions_changes();

CREATE OR REPLACE FUNCTION public.notify_break_sessions_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    payload JSON;
    break_data JSON;
    old_break_data JSON;
BEGIN
    -- Create payload based on trigger operation
    CASE TG_OP
        WHEN 'INSERT' THEN
            -- Get break session with joined agent data
            SELECT json_build_object(
                'id', bs.id,
                'agent_user_id', bs.agent_user_id,
                'break_type', bs.break_type,
                'start_time', bs.start_time,
                'end_time', bs.end_time,
                'duration_minutes', bs.duration_minutes,
                'created_at', bs.created_at,
                'pause_time', bs.pause_time,
                'resume_time', bs.resume_time,
                'pause_used', bs.pause_used,
                'time_remaining_at_pause', bs.time_remaining_at_pause,
                'break_date', bs.break_date,
                'updated_at', bs.updated_at,
                'first_name', pi.first_name,
                'last_name', pi.last_name,
                'profile_picture', pi.profile_picture,
                'email', u.email,
                'department_name', d.name
            ) INTO break_data
            FROM break_sessions bs
            LEFT JOIN personal_info pi ON bs.agent_user_id = pi.user_id
            LEFT JOIN users u ON bs.agent_user_id = u.id
            LEFT JOIN agents a ON bs.agent_user_id = a.user_id
            LEFT JOIN departments d ON a.department_id = d.id
            WHERE bs.id = NEW.id;
            
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'INSERT',
                'record', break_data,
                'timestamp', now()
            );
        WHEN 'UPDATE' THEN
            -- Get updated break session with joined agent data
            SELECT json_build_object(
                'id', bs.id,
                'agent_user_id', bs.agent_user_id,
                'break_type', bs.break_type,
                'start_time', bs.start_time,
                'end_time', bs.end_time,
                'duration_minutes', bs.duration_minutes,
                'created_at', bs.created_at,
                'pause_time', bs.pause_time,
                'resume_time', bs.resume_time,
                'pause_used', bs.pause_used,
                'time_remaining_at_pause', bs.time_remaining_at_pause,
                'break_date', bs.break_date,
                'updated_at', bs.updated_at,
                'first_name', pi.first_name,
                'last_name', pi.last_name,
                'profile_picture', pi.profile_picture,
                'email', u.email,
                'department_name', d.name
            ) INTO break_data
            FROM break_sessions bs
            LEFT JOIN personal_info pi ON bs.agent_user_id = pi.user_id
            LEFT JOIN users u ON bs.agent_user_id = u.id
            LEFT JOIN agents a ON bs.agent_user_id = a.user_id
            LEFT JOIN departments d ON a.department_id = d.id
            WHERE bs.id = NEW.id;
            
            -- Get old break session with joined agent data
            SELECT json_build_object(
                'id', bs.id,
                'agent_user_id', bs.agent_user_id,
                'break_type', bs.break_type,
                'start_time', bs.start_time,
                'end_time', bs.end_time,
                'duration_minutes', bs.duration_minutes,
                'created_at', bs.created_at,
                'pause_time', bs.pause_time,
                'resume_time', bs.resume_time,
                'pause_used', bs.pause_used,
                'time_remaining_at_pause', bs.time_remaining_at_pause,
                'break_date', bs.break_date,
                'updated_at', bs.updated_at,
                'first_name', pi.first_name,
                'last_name', pi.last_name,
                'profile_picture', pi.profile_picture,
                'email', u.email,
                'department_name', d.name
            ) INTO old_break_data
            FROM break_sessions bs
            LEFT JOIN personal_info pi ON bs.agent_user_id = pi.user_id
            LEFT JOIN users u ON bs.agent_user_id = u.id
            LEFT JOIN agents a ON bs.agent_user_id = a.user_id
            LEFT JOIN departments d ON a.department_id = d.id
            WHERE bs.id = OLD.id;
            
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'UPDATE',
                'record', break_data,
                'old_record', old_break_data,
                'timestamp', now()
            );
        WHEN 'DELETE' THEN
            -- For DELETE, we can't join since the record is gone, so use OLD data
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'DELETE',
                'record', row_to_json(OLD),
                'timestamp', now()
            );
    END CASE;
    
    -- Send notification
    PERFORM pg_notify('break_sessions_changes', payload::text);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_client_changes();

CREATE OR REPLACE FUNCTION public.notify_client_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    payload JSON;
    client_data JSON;
BEGIN
    -- Get full client data by joining with users and personal_info tables
    SELECT json_build_object(
      'user_id', u.id,
      'email', u.email,
      'user_type', u.user_type,
      'first_name', pi.first_name,
      'last_name', pi.last_name,
      'profile_picture', pi.profile_picture,
      'phone', pi.phone,
      'member_id', c.member_id,
      'department_id', c.department_id,
      'created_at', c.created_at,
      'updated_at', c.updated_at
    ) INTO client_data
    FROM public.clients c
    JOIN public.users u ON c.user_id = u.id
    LEFT JOIN public.personal_info pi ON c.user_id = pi.user_id
    WHERE c.user_id = COALESCE(NEW.user_id, OLD.user_id);

    -- Create payload based on trigger operation
    CASE TG_OP
        WHEN 'INSERT' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'INSERT',
                'record', client_data,
                'timestamp', now()
            );
        WHEN 'UPDATE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'UPDATE',
                'record', client_data,
                'old_record', row_to_json(OLD),
                'timestamp', now()
            );
        WHEN 'DELETE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'DELETE',
                'record', client_data,
                'timestamp', now()
            );
    END CASE;
    
    -- Send notification
    PERFORM pg_notify('client_changes', payload::text);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_client_member_changes();

CREATE OR REPLACE FUNCTION public.notify_client_member_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  old_company_id INTEGER;
  new_company_id INTEGER;
  old_client_count INTEGER;
  new_client_count INTEGER;
  client_data JSON;
BEGIN
  -- Only send notification if member_id changed (assignment change)
  IF TG_OP = 'UPDATE' AND (OLD.member_id IS DISTINCT FROM NEW.member_id) THEN
    -- Get old and new company IDs
    old_company_id := OLD.member_id;
    new_company_id := NEW.member_id;
    
    -- Get full client data by joining with correct tables
    SELECT json_build_object(
      'user_id', u.id,
      'first_name', pi.first_name,        -- ✅ From personal_info
      'last_name', pi.last_name,          -- ✅ From personal_info
      'profile_picture', pi.profile_picture, -- ✅ From personal_info
      'member_id', c.member_id
    ) INTO client_data
    FROM public.clients c
    JOIN public.users u ON c.user_id = u.id
    JOIN public.personal_info pi ON c.user_id = pi.user_id  -- ✅ JOIN personal_info
    WHERE c.user_id = NEW.user_id;
    
    -- Calculate client counts for old and new companies
    IF old_company_id IS NOT NULL THEN
      SELECT COUNT(*) INTO old_client_count 
      FROM public.clients 
      WHERE member_id = old_company_id;
    ELSE
      old_client_count := NULL;
    END IF;
    
    IF new_company_id IS NOT NULL THEN
      SELECT COUNT(*) INTO new_client_count 
      FROM public.clients 
      WHERE member_id = new_company_id;
    ELSE
      new_client_count := NULL;
    END IF;
    
    PERFORM pg_notify(
      'client_assignment_changes',
      json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'record', COALESCE(client_data, row_to_json(NEW)),
        'old_record', row_to_json(OLD),
        'count_updates', json_build_object(
          'old_company_id', old_company_id,
          'old_client_count', old_client_count,
          'new_company_id', new_company_id,
          'new_client_count', new_client_count
        ),
        'timestamp', now()
      )::text
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_job_info_changes();

CREATE OR REPLACE FUNCTION public.notify_job_info_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    payload JSON;
    user_data JSON;
    user_id_val INTEGER;
    user_type_val TEXT;
BEGIN
    -- Determine if this is an agent or internal user and get the user_id
    IF NEW.agent_user_id IS NOT NULL THEN
        user_id_val := NEW.agent_user_id;
        user_type_val := 'Agent';
    ELSIF NEW.internal_user_id IS NOT NULL THEN
        user_id_val := NEW.internal_user_id;
        user_type_val := 'Internal';
    ELSE
        -- Handle DELETE case where NEW might be NULL
        IF OLD.agent_user_id IS NOT NULL THEN
            user_id_val := OLD.agent_user_id;
            user_type_val := 'Agent';
        ELSIF OLD.internal_user_id IS NOT NULL THEN
            user_id_val := OLD.internal_user_id;
            user_type_val := 'Internal';
        ELSE
            -- Fallback, shouldn't happen but just in case
            RETURN COALESCE(NEW, OLD);
        END IF;
    END IF;

    -- Get full user data by joining with the appropriate table
    IF user_type_val = 'Agent' THEN
        -- For agents, join with agents table
        SELECT json_build_object(
          'user_id', a.user_id,
          'user_type', 'Agent',
          'employee_id', ji.employee_id,
          'job_title', ji.job_title,
          'shift_period', ji.shift_period,
          'shift_schedule', ji.shift_schedule,
          'shift_time', ji.shift_time,
          'work_setup', ji.work_setup,
          'employment_status', ji.employment_status,
          'hire_type', ji.hire_type,
          'staff_source', ji.staff_source,
          'start_date', ji.start_date,
          'exit_date', ji.exit_date,
          'work_email', ji.work_email,
          'created_at', ji.created_at,
          'updated_at', ji.updated_at
        ) INTO user_data
        FROM public.job_info ji
        JOIN public.agents a ON ji.agent_user_id = a.user_id
        WHERE ji.agent_user_id = user_id_val;
    ELSE
        -- For internal users, join with internal table
        SELECT json_build_object(
          'user_id', i.user_id,
          'user_type', 'Internal',
          'employee_id', ji.employee_id,
          'job_title', ji.job_title,
          'shift_period', ji.shift_period,
          'shift_schedule', ji.shift_schedule,
          'shift_time', ji.shift_time,
          'work_setup', ji.work_setup,
          'employment_status', ji.employment_status,
          'hire_type', ji.hire_type,
          'staff_source', ji.staff_source,
          'start_date', ji.start_date,
          'exit_date', ji.exit_date,
          'work_email', ji.work_email,
          'created_at', ji.created_at,
          'updated_at', ji.updated_at
        ) INTO user_data
        FROM public.job_info ji
        JOIN public.internal i ON ji.internal_user_id = i.user_id
        WHERE ji.internal_user_id = user_id_val;
    END IF;

    -- Create payload based on trigger operation
    CASE TG_OP
        WHEN 'INSERT' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'INSERT',
                'record', user_data,
                'timestamp', now()
            );
        WHEN 'UPDATE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'UPDATE',
                'record', user_data,
                'old_record', row_to_json(OLD),
                'timestamp', now()
            );
        WHEN 'DELETE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'DELETE',
                'record', user_data,
                'timestamp', now()
            );
    END CASE;
    
    -- Send notification
    PERFORM pg_notify('job_info_changes', payload::text);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_member_activity_changes();

CREATE OR REPLACE FUNCTION public.notify_member_activity_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Send notification when activity logs change
  PERFORM pg_notify(
    'member_activity_changes',
    json_build_object(
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record', CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW) END,
      'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
      'timestamp', now()
    )::text
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_member_changes();

CREATE OR REPLACE FUNCTION public.notify_member_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM pg_notify(
      'member_changes',
      json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'record', row_to_json(NEW),
        'timestamp', now()
      )::text
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM pg_notify(
      'member_changes',
      json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'record', row_to_json(NEW),
        'old_record', row_to_json(OLD),
        'timestamp', now()
      )::text
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM pg_notify(
      'member_changes',
      json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'old_record', row_to_json(OLD),
        'timestamp', now()
      )::text
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_member_comment_changes();

CREATE OR REPLACE FUNCTION public.notify_member_comment_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Send notification when comments change
  PERFORM pg_notify(
    'member_comment_changes',
    json_build_object(
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record', CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW) END,
      'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
      'timestamp', now()
    )::text
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_monthly_activity_change();

CREATE OR REPLACE FUNCTION public.notify_monthly_activity_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Send notification with user_id and action type
    PERFORM pg_notify(
        'monthly_activity_change',
        json_build_object(
            'user_id', NEW.user_id,
            'action', CASE 
                WHEN TG_OP = 'INSERT' THEN 'inserted'
                WHEN TG_OP = 'UPDATE' THEN 'updated'
                WHEN TG_OP = 'DELETE' THEN 'deleted'
            END,
            'month_start_date', COALESCE(NEW.month_start_date, OLD.month_start_date),
            'month_end_date', COALESCE(NEW.month_end_date, OLD.month_end_date),
            'total_active_seconds', COALESCE(NEW.total_active_seconds, OLD.total_active_seconds),
            'total_inactive_seconds', COALESCE(NEW.total_inactive_seconds, OLD.total_inactive_seconds),
            'total_days_active', COALESCE(NEW.total_days_active, OLD.total_days_active),
            'timestamp', NOW()
        )::text
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

COMMENT ON FUNCTION public.notify_monthly_activity_change() IS 'Sends NOTIFY events when monthly activity data changes, enabling real-time frontend updates.';

-- DROP FUNCTION public.notify_notification();

CREATE OR REPLACE FUNCTION public.notify_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  PERFORM pg_notify(
    'notifications',
    json_build_object(
      'id', NEW.id,
      'user_id', NEW.user_id,
      'category', NEW.category,
      'type', NEW.type,
      'title', NEW.title,
      'message', NEW.message,
      'payload', COALESCE(NEW.payload, '{}'::jsonb),
      'created_at', NEW.created_at
    )::text
  );
  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.notify_personal_info_changes();

CREATE OR REPLACE FUNCTION public.notify_personal_info_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    payload JSON;
    agent_data JSON;
BEGIN
    -- Get full agent data by joining with agents table
    SELECT json_build_object(
      'user_id', u.id,
      'first_name', pi.first_name,
      'middle_name', pi.middle_name,
      'last_name', pi.last_name,
      'nickname', pi.nickname,
      'profile_picture', pi.profile_picture,
      'phone', pi.phone,
      'address', pi.address,
      'city', pi.city,
      'gender', pi.gender,
      'birthday', pi.birthday,
      'created_at', pi.created_at,
      'updated_at', pi.updated_at
    ) INTO agent_data
    FROM public.personal_info pi
    JOIN public.users u ON pi.user_id = u.id
    WHERE pi.user_id = COALESCE(NEW.user_id, OLD.user_id);

    -- Create payload based on trigger operation
    CASE TG_OP
        WHEN 'INSERT' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'INSERT',
                'record', agent_data,
                'timestamp', now()
            );
        WHEN 'UPDATE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'UPDATE',
                'record', agent_data,
                'old_record', row_to_json(OLD),
                'timestamp', now()
            );
        WHEN 'DELETE' THEN
            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', 'DELETE',
                'record', agent_data,
                'timestamp', now()
            );
    END CASE;
    
    -- Send notification
    PERFORM pg_notify('personal_info_changes', payload::text);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

-- DROP FUNCTION public.notify_ticket_change();

CREATE OR REPLACE FUNCTION public.notify_ticket_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    notification JSON;
BEGIN
    -- Only send notifications for meaningful changes, not timestamp updates
    IF TG_OP = 'UPDATE' THEN
        -- Check if any meaningful fields changed (excluding updated_at)
        IF (OLD.status IS DISTINCT FROM NEW.status) OR
           (OLD.position IS DISTINCT FROM NEW.position) OR
           (OLD.resolved_by IS DISTINCT FROM NEW.resolved_by) OR
           (OLD.resolved_at IS DISTINCT FROM NEW.resolved_at) OR
           (OLD.role_id IS DISTINCT FROM NEW.role_id) OR
           (OLD.concern IS DISTINCT FROM NEW.concern) OR
           (OLD.details IS DISTINCT FROM NEW.details) OR
           (OLD.category_id IS DISTINCT FROM NEW.category_id) OR
           (OLD.supporting_files IS DISTINCT FROM NEW.supporting_files) OR
           (OLD.file_count IS DISTINCT FROM NEW.file_count) OR
           (OLD.clear IS DISTINCT FROM NEW.clear) THEN
            
            -- Create notification payload
            notification = json_build_object(
                'table', TG_TABLE_NAME,
                'action', TG_OP,
                'record', row_to_json(NEW),
                'old_record', row_to_json(OLD),
                'timestamp', now()
            );
            
            -- Send notification
            PERFORM pg_notify('ticket_changes', notification::text);
        END IF;
    ELSE
        -- For INSERT and DELETE, always send notification
        notification = json_build_object(
            'table', TG_TABLE_NAME,
            'action', TG_OP,
            'record', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE row_to_json(NEW) END,
            'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
            'timestamp', now()
        );
        
        -- Send notification
        PERFORM pg_notify('ticket_changes', notification::text);
    END IF;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.pgp_armor_headers(in text, out text, out text);

CREATE OR REPLACE FUNCTION public.pgp_armor_headers(text, OUT key text, OUT value text)
 RETURNS SETOF record
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_armor_headers$function$
;

-- DROP FUNCTION public.pgp_key_id(bytea);

CREATE OR REPLACE FUNCTION public.pgp_key_id(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_key_id_w$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt(text, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt(text, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt_bytea(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt(text, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt(text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt_bytea(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

-- DROP FUNCTION public.reset_daily_breaks();

CREATE OR REPLACE FUNCTION public.reset_daily_breaks()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
			DECLARE
				reset_count INTEGER := 0;
			BEGIN
				-- This function doesn't delete data, it just ensures that break usage
				-- is calculated based on today's date only
				
				-- Count how many agents would be affected (for logging purposes)
				SELECT COUNT(DISTINCT agent_user_id) 
				INTO reset_count
				FROM public.break_sessions 
				WHERE break_date = (NOW() AT TIME ZONE 'Asia/Manila')::date;
				
				-- The reset is implicit - break availability is checked by querying
				-- only today's break_sessions records
				
				RETURN reset_count;
			END;
			$function$
;

-- DROP FUNCTION public.should_reset_agent_breaks(int4);

CREATE OR REPLACE FUNCTION public.should_reset_agent_breaks(p_agent_user_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    last_reset_date DATE;
    current_local_date DATE;
BEGIN
    -- Get current date in Philippines timezone
    current_local_date := (NOW() AT TIME ZONE 'Asia/Manila')::date;
    
    -- Get the latest break_date for this agent
    SELECT MAX(break_date) INTO last_reset_date
    FROM break_sessions
    WHERE agent_user_id = p_agent_user_id;
    
    -- If no breaks exist or last break was before today, reset is needed
    RETURN (last_reset_date IS NULL OR last_reset_date < current_local_date);
END;
$function$
;

-- DROP FUNCTION public.trigger_break_availability_check();

CREATE OR REPLACE FUNCTION public.trigger_break_availability_check()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    PERFORM check_break_availability();
END;
$function$
;

-- DROP FUNCTION public.update_inventory_stock_on_clinic_log();

CREATE OR REPLACE FUNCTION public.update_inventory_stock_on_clinic_log()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update inventory stock when items are used
    UPDATE public.inventory_medical 
    SET stock = stock - NEW.quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.inventory_item_id;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_meetings_updated_at();

CREATE OR REPLACE FUNCTION public.update_meetings_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_productivity_score_on_time_change();

CREATE OR REPLACE FUNCTION public.update_productivity_score_on_time_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    affected_month_year VARCHAR(7);
    time_changed BOOLEAN;
    old_score DECIMAL(5,2);
    new_score DECIMAL(5,2);
BEGIN
    -- Only proceed if this is an UPDATE operation with time tracking changes
    IF TG_OP = 'UPDATE' THEN
        -- Check if time tracking values actually changed significantly (more than 1 second)
        time_changed := (
            ABS(COALESCE(NEW.today_active_seconds, 0) - COALESCE(OLD.today_active_seconds, 0)) > 1 OR
            ABS(COALESCE(NEW.today_inactive_seconds, 0) - COALESCE(OLD.today_inactive_seconds, 0)) > 1
        );
        
        -- Only update if there was a meaningful time change
        IF NOT time_changed THEN
            RETURN NEW;
        END IF;
    END IF;
    
    -- Get the month_year for the changed record
    SELECT get_month_year(NEW.today_date) INTO affected_month_year;
    
    -- Only update productivity scores for recent months (within 3 months)
    -- Convert month_year string to date for proper comparison
    IF affected_month_year >= to_char((NOW() AT TIME ZONE 'Asia/Manila')::date - INTERVAL '3 months', 'YYYY-MM') THEN
        -- Get the old productivity score before updating
        SELECT COALESCE(productivity_score, 0) INTO old_score
        FROM productivity_scores 
        WHERE user_id = NEW.user_id AND month_year = affected_month_year;
        
        -- Actually calculate and update the productivity score
        -- Use a separate transaction to avoid blocking the main operation
        BEGIN
            PERFORM calculate_monthly_productivity_score(NEW.user_id, affected_month_year);
            
            -- Get the new productivity score after updating
            SELECT COALESCE(productivity_score, 0) INTO new_score
            FROM productivity_scores 
            WHERE user_id = NEW.user_id AND month_year = affected_month_year;
            
            -- Log the successful calculation
            RAISE LOG 'Productivity score calculated and updated for month % (user_id: %): % -> %', 
                      affected_month_year, NEW.user_id, old_score, new_score;
            
            -- Emit real-time update via WebSocket if score changed
            IF old_score != new_score THEN
                -- Use pg_notify to signal that a productivity score was updated
                -- The socket server will listen for this notification and emit updates
                PERFORM pg_notify(
                    'productivity_score_updated',
                    json_build_object(
                        'user_id', NEW.user_id,
                        'month_year', affected_month_year,
                        'old_score', old_score,
                        'new_score', new_score,
                        'timestamp', NOW()
                    )::text
                );
                
                RAISE LOG 'Real-time productivity update notification sent for user %: % -> %', 
                          NEW.user_id, old_score, new_score;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            -- Log the error but don't fail the main operation
            RAISE LOG 'Error calculating productivity score for month % (user_id: %): %', 
                      affected_month_year, NEW.user_id, SQLERRM;
        END;
    END IF;
    
    RETURN NEW;
END;
$function$
;

COMMENT ON FUNCTION public.update_productivity_score_on_time_change() IS 'Calculates productivity scores and emits real-time WebSocket updates when activity_data time tracking values change significantly.';

-- DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();  -- ✅ Use UTC (now() returns UTC)
    RETURN NEW;
END;
$function$
;