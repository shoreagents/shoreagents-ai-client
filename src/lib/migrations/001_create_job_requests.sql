-- Job Requests schema
-- Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_arrangement_enum') THEN
    CREATE TYPE work_arrangement_enum AS ENUM ('onsite', 'remote', 'hybrid');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_level_enum') THEN
    CREATE TYPE experience_level_enum AS ENUM ('entry-level', 'mid-level', 'senior-level');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status_enum') THEN
    CREATE TYPE job_status_enum AS ENUM ('active', 'inactive', 'closed');
  END IF;
END $$;

-- Table
CREATE TABLE IF NOT EXISTS job_requests (
  id               serial PRIMARY KEY,
  job_id           text UNIQUE NOT NULL,
  company_id       uuid REFERENCES members(company_id) ON DELETE SET NULL,
  job_title        text NOT NULL,
  location         text NOT NULL,
  work_arrangement work_arrangement_enum NULL,
  salary_min       integer NULL CHECK (salary_min IS NULL OR salary_min >= 0),
  salary_max       integer NULL CHECK (salary_max IS NULL OR salary_max >= 0),
  job_description  text NOT NULL,
  requirements     text[] DEFAULT '{}',
  responsibilities text[] DEFAULT '{}',
  benefits         text[] DEFAULT '{}',
  skills           text[] DEFAULT '{}',
  experience_level experience_level_enum NULL,
  application_deadline date NULL,
  industry         text NULL,
  department       text NULL,
  work_type        text NOT NULL DEFAULT 'full-time',
  currency         text NOT NULL DEFAULT 'PHP',
  salary_type      text NOT NULL DEFAULT 'monthly',
  status           job_status_enum NOT NULL DEFAULT 'active',
  views            integer NOT NULL DEFAULT 0,
  applicants       integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT NOW(),
  updated_at       timestamptz NOT NULL DEFAULT NOW()
);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'tr_job_requests_set_updated_at'
  ) THEN
    CREATE TRIGGER tr_job_requests_set_updated_at
    BEFORE UPDATE ON job_requests
    FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
  END IF;
END $$;
