-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

-- DROP TYPE public."break_type_enum";

CREATE TYPE public."break_type_enum" AS ENUM (
	'Morning',
	'Lunch',
	'Afternoon');

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
-- DROP SEQUENCE public.members_id_seq;

CREATE SEQUENCE public.members_id_seq
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
	NO CYCLE;-- public.floor_plans definition

-- Drop table

-- DROP TABLE public.floor_plans;

CREATE TABLE public.floor_plans ( id serial4 NOT NULL, "name" text NOT NULL, building text NULL, svg_url text NULL, svg_path text NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT floor_plans_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_floor_plans_updated_at before
update
    on
    public.floor_plans for each row execute function update_updated_at_column();


-- public.inventory_medical_categories definition

-- Drop table

-- DROP TABLE public.inventory_medical_categories;

CREATE TABLE public.inventory_medical_categories ( id serial4 NOT NULL, item_type public."item_type_medical" NOT NULL, "name" varchar(100) NOT NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT inventory_medical_categories_item_type_name_key UNIQUE (item_type, name), CONSTRAINT inventory_medical_categories_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_inventory_medical_categories_updated_at before
update
    on
    public.inventory_medical_categories for each row execute function update_updated_at_column();


-- public.inventory_medical_suppliers definition

-- Drop table

-- DROP TABLE public.inventory_medical_suppliers;

CREATE TABLE public.inventory_medical_suppliers ( id serial4 NOT NULL, "name" varchar(255) NOT NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT inventory_medical_suppliers_name_key UNIQUE (name), CONSTRAINT inventory_medical_suppliers_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_inventory_medical_suppliers_updated_at before
update
    on
    public.inventory_medical_suppliers for each row execute function update_updated_at_column();


-- public.members definition

-- Drop table

-- DROP TABLE public.members;

CREATE TABLE public.members ( id serial4 NOT NULL, company text NOT NULL, address text NULL, phone text NULL, logo text NULL, service text NULL, status public."member_status_enum" NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, badge_color text NULL, country text NULL, website _text NULL, CONSTRAINT members_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_members_updated_at before
update
    on
    public.members for each row execute function update_updated_at_column();


-- public.roles definition

-- Drop table

-- DROP TABLE public.roles;

CREATE TABLE public.roles ( id serial4 NOT NULL, "name" text NOT NULL, description text NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT roles_name_key UNIQUE (name), CONSTRAINT roles_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_roles_updated_at before
update
    on
    public.roles for each row execute function update_updated_at_column();


-- public.ticket_categories definition

-- Drop table

-- DROP TABLE public.ticket_categories;

CREATE TABLE public.ticket_categories ( id serial4 NOT NULL, "name" varchar(100) NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT ticket_categories_name_key UNIQUE (name), CONSTRAINT ticket_categories_pkey PRIMARY KEY (id));

-- Table Triggers

create trigger update_ticket_categories_updated_at before
update
    on
    public.ticket_categories for each row execute function update_updated_at_column();


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users ( id serial4 NOT NULL, email text NOT NULL, user_type public."user_type_enum" NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT users_email_key UNIQUE (email), CONSTRAINT users_pkey PRIMARY KEY (id));

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


-- public.departments definition

-- Drop table

-- DROP TABLE public.departments;

CREATE TABLE public.departments ( id serial4 NOT NULL, "name" text NOT NULL, description text NULL, member_id int4 NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT departments_pkey PRIMARY KEY (id), CONSTRAINT unique_department_id_member UNIQUE (id, member_id), CONSTRAINT unique_department_per_member UNIQUE (name, member_id), CONSTRAINT departments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_departments_updated_at before
update
    on
    public.departments for each row execute function update_updated_at_column();


-- public.floor_plan_members definition

-- Drop table

-- DROP TABLE public.floor_plan_members;

CREATE TABLE public.floor_plan_members ( id serial4 NOT NULL, floor_plan_id int4 NOT NULL, member_id int4 NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT floor_plan_members_floor_plan_id_member_id_key UNIQUE (floor_plan_id, member_id), CONSTRAINT floor_plan_members_pkey PRIMARY KEY (id), CONSTRAINT floor_plan_members_floor_plan_id_fkey FOREIGN KEY (floor_plan_id) REFERENCES public.floor_plans(id) ON DELETE CASCADE, CONSTRAINT floor_plan_members_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE);


-- public.internal definition

-- Drop table

-- DROP TABLE public.internal;

CREATE TABLE public.internal ( user_id int4 NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT internal_pkey PRIMARY KEY (user_id), CONSTRAINT internal_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_internal_updated_at before
update
    on
    public.internal for each row execute function update_updated_at_column();


-- public.internal_roles definition

-- Drop table

-- DROP TABLE public.internal_roles;

CREATE TABLE public.internal_roles ( id serial4 NOT NULL, internal_user_id int4 NOT NULL, role_id int4 NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT internal_roles_pkey PRIMARY KEY (id), CONSTRAINT unique_internal_role_assignment UNIQUE (internal_user_id, role_id), CONSTRAINT internal_roles_internal_user_id_fkey FOREIGN KEY (internal_user_id) REFERENCES public.internal(user_id) ON DELETE CASCADE, CONSTRAINT internal_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE);

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


-- public.personal_info definition

-- Drop table

-- DROP TABLE public.personal_info;

CREATE TABLE public.personal_info ( id serial4 NOT NULL, user_id int4 NOT NULL, first_name text NOT NULL, middle_name text NULL, last_name text NOT NULL, nickname text NULL, profile_picture text NULL, phone text NULL, birthday date NULL, city text NULL, address text NULL, gender public."gender_enum" NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT personal_info_pkey PRIMARY KEY (id), CONSTRAINT personal_info_user_id_key UNIQUE (user_id), CONSTRAINT personal_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_personal_info_updated_at before
update
    on
    public.personal_info for each row execute function update_updated_at_column();


-- public.productivity_scores definition

-- Drop table

-- DROP TABLE public.productivity_scores;

CREATE TABLE public.productivity_scores ( id serial4 NOT NULL, user_id int4 NOT NULL, month_year varchar(7) NOT NULL, productivity_score numeric(5, 2) NOT NULL, total_active_seconds int4 DEFAULT 0 NULL, total_inactive_seconds int4 DEFAULT 0 NULL, total_seconds int4 DEFAULT 0 NULL, active_percentage numeric(5, 2) DEFAULT 0.00 NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz DEFAULT now() NULL, CONSTRAINT productivity_scores_pkey PRIMARY KEY (id), CONSTRAINT productivity_scores_user_id_month_year_key UNIQUE (user_id, month_year), CONSTRAINT productivity_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_productivity_scores_updated_at before
update
    on
    public.productivity_scores for each row execute function update_updated_at_column();


-- public.stations definition

-- Drop table

-- DROP TABLE public.stations;

CREATE TABLE public.stations ( id serial4 NOT NULL, station_id varchar(50) NOT NULL, assigned_user_id int4 NULL, asset_id varchar(50) NULL, floor_plan_id int4 NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT stations_pkey PRIMARY KEY (id), CONSTRAINT stations_station_id_key UNIQUE (station_id), CONSTRAINT unique_user_per_station UNIQUE (assigned_user_id), CONSTRAINT stations_assigned_user_id_fkey FOREIGN KEY (assigned_user_id) REFERENCES public.users(id) ON DELETE SET NULL, CONSTRAINT stations_floor_plan_id_fkey FOREIGN KEY (floor_plan_id) REFERENCES public.floor_plans(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_stations_updated_at before
update
    on
    public.stations for each row execute function update_updated_at_column();


-- public.tickets definition

-- Drop table

-- DROP TABLE public.tickets;

CREATE TABLE public.tickets ( id serial4 NOT NULL, ticket_id varchar(50) NOT NULL, user_id int4 NOT NULL, concern text NOT NULL, details text NULL, status public."ticket_status_enum" DEFAULT 'For Approval'::ticket_status_enum NOT NULL, resolved_by int4 NULL, resolved_at timestamptz NULL, created_at timestamp DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL, updated_at timestamp DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL, "position" int4 DEFAULT 0 NOT NULL, category_id int4 NULL, supporting_files _text DEFAULT '{}'::text[] NULL, file_count int4 DEFAULT 0 NULL, role_id int4 NULL, CONSTRAINT check_file_count CHECK (((file_count = array_length(supporting_files, 1)) OR ((file_count = 0) AND (supporting_files = '{}'::text[])))), CONSTRAINT tickets_pkey PRIMARY KEY (id), CONSTRAINT tickets_ticket_id_key UNIQUE (ticket_id), CONSTRAINT tickets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.ticket_categories(id) ON DELETE SET NULL, CONSTRAINT tickets_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL, CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

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


-- public.agents definition

-- Drop table

-- DROP TABLE public.agents;

CREATE TABLE public.agents ( user_id int4 NOT NULL, exp_points int4 DEFAULT 0 NULL, member_id int4 NULL, department_id int4 NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT agents_pkey PRIMARY KEY (user_id), CONSTRAINT agents_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL, CONSTRAINT agents_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE, CONSTRAINT agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_agents_updated_at before
update
    on
    public.agents for each row execute function update_updated_at_column();


-- public.break_sessions definition

-- Drop table

-- DROP TABLE public.break_sessions;

CREATE TABLE public.break_sessions ( id serial4 NOT NULL, agent_user_id int4 NOT NULL, break_type public."break_type_enum" NOT NULL, start_time timestamp DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NULL, end_time timestamp NULL, duration_minutes int4 NULL, created_at timestamp DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NULL, pause_time timestamp NULL, resume_time timestamp NULL, pause_used bool DEFAULT false NULL, time_remaining_at_pause int4 NULL, break_date date DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text)::date NOT NULL, CONSTRAINT break_sessions_pkey PRIMARY KEY (id), CONSTRAINT chk_pause_resume_order CHECK (((pause_time IS NULL) OR (resume_time IS NULL) OR (pause_time < resume_time))), CONSTRAINT break_sessions_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.agents(user_id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_break_sessions_updated_at before
update
    on
    public.break_sessions for each row execute function update_updated_at_column();


-- public.clients definition

-- Drop table

-- DROP TABLE public.clients;

CREATE TABLE public.clients ( user_id int4 NOT NULL, member_id int4 NOT NULL, department_id int4 NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT clients_pkey PRIMARY KEY (user_id), CONSTRAINT clients_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL, CONSTRAINT clients_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE, CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_clients_updated_at before
update
    on
    public.clients for each row execute function update_updated_at_column();


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


-- public.job_info definition

-- Drop table

-- DROP TABLE public.job_info;

CREATE TABLE public.job_info ( id serial4 NOT NULL, employee_id varchar(20) NOT NULL, agent_user_id int4 NULL, internal_user_id int4 NULL, job_title text NULL, shift_period text NULL, shift_schedule text NULL, shift_time text NULL, work_setup text NULL, employment_status text NULL, hire_type text NULL, staff_source text NULL, start_date date NULL, exit_date date NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, work_email text NULL, CONSTRAINT chk_job_info_employee_type CHECK ((((agent_user_id IS NOT NULL) AND (internal_user_id IS NULL)) OR ((agent_user_id IS NULL) AND (internal_user_id IS NOT NULL)))), CONSTRAINT job_info_employee_id_key UNIQUE (employee_id), CONSTRAINT job_info_pkey PRIMARY KEY (id), CONSTRAINT job_info_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.agents(user_id) ON DELETE CASCADE, CONSTRAINT job_info_internal_user_id_fkey FOREIGN KEY (internal_user_id) REFERENCES public.internal(user_id) ON DELETE CASCADE);

-- Table Triggers

create trigger update_job_info_updated_at before
update
    on
    public.job_info for each row execute function update_updated_at_column();


-- public.ticket_comments definition

-- Drop table

-- DROP TABLE public.ticket_comments;

CREATE TABLE public.ticket_comments ( id serial4 NOT NULL, ticket_id int4 NOT NULL, user_id int4 NOT NULL, "comment" text NOT NULL, created_at timestamp DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL, updated_at timestamp DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL, CONSTRAINT ticket_comments_pkey PRIMARY KEY (id), CONSTRAINT ticket_comments_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE, CONSTRAINT ticket_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);



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

-- DROP FUNCTION public.notify_ticket_change();

CREATE OR REPLACE FUNCTION public.notify_ticket_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    notification JSON;
BEGIN
    -- Create notification payload
    notification = json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'record', row_to_json(NEW),
        'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
        'timestamp', now()
    );
    
    -- Send notification
    PERFORM pg_notify('ticket_changes', notification::text);
    
    RETURN NEW;
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

-- DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila');
    RETURN NEW;
END;
$function$
;