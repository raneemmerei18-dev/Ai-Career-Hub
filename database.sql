-- ============================================================================
-- AI CAREER HUB - DATABASE SCHEMA (MySQL/MariaDB)
-- ============================================================================
-- Database: ai_career_hub
-- Description: Complete database schema for AI Career Hub platform
-- Version: 1.0.0
-- Created: 2026-05-08
-- ============================================================================

-- Create database
CREATE DATABASE IF NOT EXISTS ai_career_hub;
USE ai_career_hub;

-- Set charset for proper Unicode support
ALTER DATABASE ai_career_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: users
-- Description: User accounts and authentication
-- ============================================================================
CREATE TABLE users (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email address',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Hashed password (bcrypt)',
    first_name VARCHAR(100) NOT NULL COMMENT 'First name',
    last_name VARCHAR(100) NOT NULL COMMENT 'Last name',
    avatar_url VARCHAR(500) COMMENT 'Profile picture URL',
    role ENUM('user', 'admin') DEFAULT 'user' NOT NULL COMMENT 'User role',
    
    -- Status flags
    is_active BOOLEAN DEFAULT TRUE NOT NULL COMMENT 'Account active status',
    is_verified BOOLEAN DEFAULT FALSE NOT NULL COMMENT 'Email verified',
    onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL COMMENT 'Onboarding wizard completed',
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'Account creation date',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT 'Last update',
    last_login_at DATETIME COMMENT 'Last login timestamp',
    deleted_at DATETIME COMMENT 'Soft delete timestamp (NULL = active)',
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='User accounts and authentication';

-- ============================================================================
-- TABLE: profiles
-- Description: Extended user profile information
-- ============================================================================
CREATE TABLE profiles (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    user_id VARCHAR(36) NOT NULL UNIQUE COMMENT 'FK to users',
    
    -- Professional info
    headline VARCHAR(255) COMMENT 'Professional headline/title',
    summary TEXT COMMENT 'Professional summary',
    
    -- Contact info
    location VARCHAR(255) COMMENT 'Current location',
    phone VARCHAR(50) COMMENT 'Phone number',
    
    -- Social/portfolio links
    linkedin_url VARCHAR(500) COMMENT 'LinkedIn profile URL',
    github_url VARCHAR(500) COMMENT 'GitHub profile URL',
    portfolio_url VARCHAR(500) COMMENT 'Portfolio website URL',
    twitter_url VARCHAR(500) COMMENT 'Twitter profile URL',
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_profiles_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Extended user profile information';

-- ============================================================================
-- TABLE: skills
-- Description: Master skill catalog
-- ============================================================================
CREATE TABLE skills (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Skill name',
    category ENUM('technical', 'soft', 'language', 'tool', 'framework', 'database', 'cloud', 'other') NOT NULL COMMENT 'Skill category',
    description TEXT COMMENT 'Skill description',
    popularity_score INT DEFAULT 0 NOT NULL COMMENT 'Trending/popularity score',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Indexes
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_popularity (popularity_score)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Master catalog of all available skills';

-- ============================================================================
-- TABLE: user_skills
-- Description: User proficiency in skills
-- ============================================================================
CREATE TABLE user_skills (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    profile_id VARCHAR(36) NOT NULL COMMENT 'FK to profiles',
    skill_id VARCHAR(36) NOT NULL COMMENT 'FK to skills',
    
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') NOT NULL COMMENT 'Proficiency level',
    years_of_experience DECIMAL(3,1) DEFAULT 0 COMMENT 'Years of experience',
    endorsements INT DEFAULT 0 COMMENT 'Number of endorsements',
    is_primary BOOLEAN DEFAULT FALSE COMMENT 'Primary/featured skill',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_user_skills_profile_id 
        FOREIGN KEY (profile_id) 
        REFERENCES profiles(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_user_skills_skill_id 
        FOREIGN KEY (skill_id) 
        REFERENCES skills(id) 
        ON DELETE CASCADE,
    
    -- Indexes & Constraints
    UNIQUE INDEX idx_profile_skill (profile_id, skill_id),
    INDEX idx_skill_id (skill_id),
    INDEX idx_proficiency (proficiency_level)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='User skill proficiency and endorsements';

-- ============================================================================
-- TABLE: experiences
-- Description: Work experience history
-- ============================================================================
CREATE TABLE experiences (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    profile_id VARCHAR(36) NOT NULL COMMENT 'FK to profiles',
    
    company_name VARCHAR(255) NOT NULL COMMENT 'Company name',
    job_title VARCHAR(255) NOT NULL COMMENT 'Job title/position',
    location VARCHAR(255) COMMENT 'Work location',
    industry VARCHAR(100) COMMENT 'Industry',
    employment_type ENUM('full-time', 'part-time', 'contract', 'freelance', 'internship') COMMENT 'Employment type',
    
    start_date DATE NOT NULL COMMENT 'Start date',
    end_date DATE COMMENT 'End date (NULL = current)',
    is_current BOOLEAN DEFAULT FALSE COMMENT 'Currently working',
    
    description TEXT COMMENT 'Job description and achievements',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_experiences_profile_id 
        FOREIGN KEY (profile_id) 
        REFERENCES profiles(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_profile_id (profile_id),
    INDEX idx_start_date (start_date)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Work experience history';

-- ============================================================================
-- TABLE: education
-- Description: Educational background
-- ============================================================================
CREATE TABLE education (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    profile_id VARCHAR(36) NOT NULL COMMENT 'FK to profiles',
    
    school_name VARCHAR(255) NOT NULL COMMENT 'School/University name',
    degree VARCHAR(100) NOT NULL COMMENT 'Degree type (e.g., Bachelor, Master)',
    field_of_study VARCHAR(255) NOT NULL COMMENT 'Major/Field of study',
    
    start_date DATE NOT NULL COMMENT 'Start date',
    end_date DATE COMMENT 'End date',
    grade DECIMAL(3,2) COMMENT 'GPA or grade',
    
    description TEXT COMMENT 'Additional details',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_education_profile_id 
        FOREIGN KEY (profile_id) 
        REFERENCES profiles(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_profile_id (profile_id),
    INDEX idx_start_date (start_date)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Educational background';

-- ============================================================================
-- TABLE: certifications
-- Description: Professional certifications
-- ============================================================================
CREATE TABLE certifications (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    profile_id VARCHAR(36) NOT NULL COMMENT 'FK to profiles',
    
    name VARCHAR(255) NOT NULL COMMENT 'Certification name',
    issuer VARCHAR(255) NOT NULL COMMENT 'Issuing organization',
    issue_date DATE NOT NULL COMMENT 'Issue date',
    expiration_date DATE COMMENT 'Expiration date',
    credential_id VARCHAR(255) COMMENT 'Certification ID/Number',
    credential_url VARCHAR(500) COMMENT 'URL to credential',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_certifications_profile_id 
        FOREIGN KEY (profile_id) 
        REFERENCES profiles(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_profile_id (profile_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Professional certifications';

-- ============================================================================
-- TABLE: languages
-- Description: Languages spoken
-- ============================================================================
CREATE TABLE languages (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    profile_id VARCHAR(36) NOT NULL COMMENT 'FK to profiles',
    
    language_name VARCHAR(100) NOT NULL COMMENT 'Language name',
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'fluent', 'native') NOT NULL COMMENT 'Proficiency level',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_languages_profile_id 
        FOREIGN KEY (profile_id) 
        REFERENCES profiles(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_profile_id (profile_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Languages spoken by users';

-- ============================================================================
-- TABLE: projects
-- Description: User projects and portfolio items
-- ============================================================================
CREATE TABLE projects (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    profile_id VARCHAR(36) NOT NULL COMMENT 'FK to profiles',
    
    title VARCHAR(255) NOT NULL COMMENT 'Project title',
    description TEXT COMMENT 'Project description',
    technologies JSON COMMENT 'Technologies used (JSON array)',
    
    start_date DATE NOT NULL COMMENT 'Start date',
    end_date DATE COMMENT 'End date',
    
    url VARCHAR(500) COMMENT 'Project URL/demo link',
    repository_url VARCHAR(500) COMMENT 'Code repository URL',
    
    image_url VARCHAR(500) COMMENT 'Project image/thumbnail URL',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_projects_profile_id 
        FOREIGN KEY (profile_id) 
        REFERENCES profiles(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_profile_id (profile_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='User projects and portfolio items';

-- ============================================================================
-- TABLE: resumes
-- Description: Resume documents
-- ============================================================================
CREATE TABLE resumes (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    user_id VARCHAR(36) NOT NULL COMMENT 'FK to users',
    
    name VARCHAR(200) NOT NULL COMMENT 'Resume name/title',
    template_id VARCHAR(100) DEFAULT 'modern' NOT NULL COMMENT 'Template ID',
    
    content JSON DEFAULT ('{}') NOT NULL COMMENT 'Resume content (structured JSON)',
    
    ats_score FLOAT COMMENT 'ATS compatibility score',
    ats_analysis JSON COMMENT 'ATS analysis results',
    
    version INT DEFAULT 1 NOT NULL COMMENT 'Version number',
    parent_version_id VARCHAR(36) COMMENT 'Parent version ID for history',
    
    is_active BOOLEAN DEFAULT TRUE NOT NULL COMMENT 'Active resume flag',
    is_public BOOLEAN DEFAULT FALSE NOT NULL COMMENT 'Public visibility',
    public_url VARCHAR(500) COMMENT 'Public share URL',
    
    pdf_url VARCHAR(500) COMMENT 'Exported PDF URL',
    docx_url VARCHAR(500) COMMENT 'Exported DOCX URL',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_resumes_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Resume documents and versions';

-- ============================================================================
-- TABLE: cover_letters
-- Description: Cover letters
-- ============================================================================
CREATE TABLE cover_letters (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    user_id VARCHAR(36) NOT NULL COMMENT 'FK to users',
    
    title VARCHAR(255) NOT NULL COMMENT 'Cover letter title',
    template_id VARCHAR(100) DEFAULT 'professional' NOT NULL COMMENT 'Template ID',
    
    content TEXT NOT NULL COMMENT 'Cover letter content',
    
    is_public BOOLEAN DEFAULT FALSE NOT NULL COMMENT 'Public visibility',
    public_url VARCHAR(500) COMMENT 'Public share URL',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_cover_letters_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Cover letters';

-- ============================================================================
-- TABLE: target_careers
-- Description: Career goals and targets
-- ============================================================================
CREATE TABLE target_careers (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    profile_id VARCHAR(36) NOT NULL UNIQUE COMMENT 'FK to profiles (one per user)',
    
    target_job_title VARCHAR(255) NOT NULL COMMENT 'Target job title',
    industry VARCHAR(100) COMMENT 'Target industry',
    company_type VARCHAR(100) COMMENT 'Preferred company type',
    
    description TEXT COMMENT 'Career goal description',
    
    skills_to_develop JSON COMMENT 'Skills to develop (JSON array)',
    
    target_salary_min INT COMMENT 'Target minimum salary',
    target_salary_max INT COMMENT 'Target maximum salary',
    
    timeline_months INT COMMENT 'Target achievement timeline (months)',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_target_careers_profile_id 
        FOREIGN KEY (profile_id) 
        REFERENCES profiles(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_profile_id (profile_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Career goals and targets';

-- ============================================================================
-- TABLE: jobs
-- Description: Job listings (from job boards or manual entry)
-- ============================================================================
CREATE TABLE jobs (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    
    title VARCHAR(255) NOT NULL COMMENT 'Job title',
    company_name VARCHAR(255) NOT NULL COMMENT 'Company name',
    description TEXT COMMENT 'Job description',
    
    location VARCHAR(255) COMMENT 'Job location',
    work_type ENUM('on-site', 'remote', 'hybrid') COMMENT 'Work arrangement',
    
    salary_min INT COMMENT 'Minimum salary',
    salary_max INT COMMENT 'Maximum salary',
    salary_currency VARCHAR(3) DEFAULT 'USD' COMMENT 'Currency code',
    
    required_skills JSON COMMENT 'Required skills (JSON array)',
    preferred_skills JSON COMMENT 'Preferred skills (JSON array)',
    
    job_source VARCHAR(100) COMMENT 'Source (e.g., LinkedIn, Indeed, Adzuna)',
    external_id VARCHAR(255) COMMENT 'External job ID',
    external_url VARCHAR(500) COMMENT 'External job posting URL',
    
    posted_at DATETIME COMMENT 'Job posting date',
    expires_at DATETIME COMMENT 'Job expiration date',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Indexes
    INDEX idx_title (title),
    INDEX idx_company_name (company_name),
    INDEX idx_location (location),
    INDEX idx_posted_at (posted_at),
    INDEX idx_expires_at (expires_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Job listings';

-- ============================================================================
-- TABLE: job_matches
-- Description: AI-matched job recommendations
-- ============================================================================
CREATE TABLE job_matches (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    user_id VARCHAR(36) NOT NULL COMMENT 'FK to users',
    job_id VARCHAR(36) NOT NULL COMMENT 'FK to jobs',
    
    match_score FLOAT NOT NULL COMMENT 'Match score (0-100)',
    match_reason TEXT COMMENT 'Why this job matched',
    
    status ENUM('viewed', 'saved', 'applied', 'rejected') DEFAULT 'viewed' COMMENT 'User action status',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_job_matches_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_job_matches_job_id 
        FOREIGN KEY (job_id) 
        REFERENCES jobs(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    UNIQUE INDEX idx_user_job (user_id, job_id),
    INDEX idx_match_score (match_score),
    INDEX idx_status (status)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='AI-matched job recommendations';

-- ============================================================================
-- TABLE: interview_sessions
-- Description: AI interview practice sessions
-- ============================================================================
CREATE TABLE interview_sessions (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    user_id VARCHAR(36) NOT NULL COMMENT 'FK to users',
    
    job_id VARCHAR(36) COMMENT 'FK to jobs (for job-specific interviews)',
    job_title VARCHAR(255) COMMENT 'Interview job title',
    company_name VARCHAR(255) COMMENT 'Interview company name',
    
    interview_type ENUM('technical', 'behavioral', 'general') DEFAULT 'general' COMMENT 'Interview type',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'intermediate' COMMENT 'Difficulty level',
    
    total_questions INT DEFAULT 0 COMMENT 'Total number of questions',
    questions_answered INT DEFAULT 0 COMMENT 'Number of questions answered',
    
    overall_score FLOAT COMMENT 'Overall performance score',
    ai_feedback TEXT COMMENT 'AI feedback on performance',
    
    status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress' COMMENT 'Session status',
    
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ended_at DATETIME COMMENT 'Session end time',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_interview_sessions_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_interview_sessions_job_id 
        FOREIGN KEY (job_id) 
        REFERENCES jobs(id) 
        ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='AI interview practice sessions';

-- ============================================================================
-- TABLE: interview_answers
-- Description: Answers to interview questions
-- ============================================================================
CREATE TABLE interview_answers (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    interview_session_id VARCHAR(36) NOT NULL COMMENT 'FK to interview_sessions',
    
    question_number INT NOT NULL COMMENT 'Question number',
    question_text TEXT NOT NULL COMMENT 'The interview question',
    
    user_answer TEXT NOT NULL COMMENT 'User response',
    
    ai_evaluation TEXT COMMENT 'AI evaluation of the answer',
    score FLOAT COMMENT 'Score for this answer (0-100)',
    strengths JSON COMMENT 'Answer strengths (JSON array)',
    improvements JSON COMMENT 'Areas for improvement (JSON array)',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_interview_answers_session_id 
        FOREIGN KEY (interview_session_id) 
        REFERENCES interview_sessions(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_session_id (interview_session_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Interview question answers and evaluations';

-- ============================================================================
-- TABLE: learning_paths
-- Description: Personalized learning recommendations
-- ============================================================================
CREATE TABLE learning_paths (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    user_id VARCHAR(36) NOT NULL COMMENT 'FK to users',
    
    title VARCHAR(255) NOT NULL COMMENT 'Learning path title',
    description TEXT COMMENT 'Path description',
    
    target_skill VARCHAR(255) COMMENT 'Target skill to develop',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') COMMENT 'Difficulty level',
    
    estimated_duration_hours INT COMMENT 'Estimated hours to complete',
    
    resources JSON COMMENT 'Learning resources (JSON array)',
    
    progress_percentage INT DEFAULT 0 COMMENT 'Completion percentage',
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started' COMMENT 'Status',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    completed_at DATETIME COMMENT 'Completion date',
    
    -- Foreign keys
    CONSTRAINT fk_learning_paths_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Personalized learning paths';

-- ============================================================================
-- TABLE: notifications
-- Description: User notifications
-- ============================================================================
CREATE TABLE notifications (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    user_id VARCHAR(36) NOT NULL COMMENT 'FK to users',
    
    type VARCHAR(100) NOT NULL COMMENT 'Notification type',
    title VARCHAR(255) NOT NULL COMMENT 'Notification title',
    message TEXT NOT NULL COMMENT 'Notification message',
    
    related_entity_type VARCHAR(100) COMMENT 'Entity type (job, skill, etc)',
    related_entity_id VARCHAR(36) COMMENT 'Entity ID',
    
    is_read BOOLEAN DEFAULT FALSE NOT NULL COMMENT 'Read status',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    read_at DATETIME COMMENT 'Read timestamp',
    
    -- Foreign keys
    CONSTRAINT fk_notifications_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='User notifications';

-- ============================================================================
-- TABLE: subscriptions
-- Description: User subscription and premium features
-- ============================================================================
CREATE TABLE subscriptions (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    user_id VARCHAR(36) NOT NULL UNIQUE COMMENT 'FK to users (one per user)',
    
    plan_name VARCHAR(100) NOT NULL COMMENT 'Subscription plan name',
    plan_tier ENUM('free', 'pro', 'enterprise') DEFAULT 'free' NOT NULL COMMENT 'Plan tier',
    
    is_active BOOLEAN DEFAULT TRUE NOT NULL COMMENT 'Active status',
    
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'Subscription start',
    end_date DATETIME COMMENT 'Subscription end date',
    
    auto_renew BOOLEAN DEFAULT TRUE COMMENT 'Auto-renewal flag',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_subscriptions_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_plan_tier (plan_tier),
    INDEX idx_is_active (is_active)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='User subscription and premium status';

-- ============================================================================
-- TABLE: audit_logs
-- Description: Activity audit trail for compliance
-- ============================================================================
CREATE TABLE audit_logs (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT 'UUID',
    user_id VARCHAR(36) COMMENT 'FK to users',
    
    action VARCHAR(255) NOT NULL COMMENT 'Action performed',
    entity_type VARCHAR(100) NOT NULL COMMENT 'Entity type (user, resume, etc)',
    entity_id VARCHAR(36) COMMENT 'Entity ID',
    
    details JSON COMMENT 'Additional details',
    
    ip_address VARCHAR(45) COMMENT 'IP address (IPv4/IPv6)',
    user_agent VARCHAR(500) COMMENT 'Browser user agent',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign keys (optional, for referenced users)
    CONSTRAINT fk_audit_logs_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_entity_type (entity_type),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='Activity audit trail';

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Sample users
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, is_verified, onboarding_completed) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', '$2b$12$XK7yrBz2u3Zy5uQ3jZ5Z2.8K8c5Y5e5Z1Z5Z2Z3Z4Z5Z6Z7Z8Z9Z', 'John', 'Doe', 'user', TRUE, TRUE, TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', '$2b$12$XK7yrBz2u3Zy5uQ3jZ5Z2.8K8c5Y5e5Z1Z5Z2Z3Z4Z5Z6Z7Z8Z9Z', 'Jane', 'Smith', 'user', TRUE, TRUE, TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'admin@aicareerhub.com', '$2b$12$XK7yrBz2u3Zy5uQ3jZ5Z2.8K8c5Y5e5Z1Z5Z2Z3Z4Z5Z6Z7Z8Z9Z', 'Admin', 'User', 'admin', TRUE, TRUE, TRUE);

-- Sample profiles
INSERT INTO profiles (id, user_id, headline, summary, location, linkedin_url, github_url) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Full Stack Developer', 'Experienced developer with 5+ years in web development', 'San Francisco, CA', 'https://linkedin.com/in/johndoe', 'https://github.com/johndoe'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Product Manager', 'Tech-savvy product manager focused on AI/ML', 'New York, NY', 'https://linkedin.com/in/janesmith', NULL);

-- Sample skills
INSERT INTO skills (id, name, category, popularity_score) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Python', 'technical', 100),
('750e8400-e29b-41d4-a716-446655440002', 'JavaScript', 'technical', 95),
('750e8400-e29b-41d4-a716-446655440003', 'React', 'framework', 90),
('750e8400-e29b-41d4-a716-446655440004', 'Leadership', 'soft', 85),
('750e8400-e29b-41d4-a716-446655440005', 'Communication', 'soft', 80);

-- Sample user skills
INSERT INTO user_skills (id, profile_id, skill_id, proficiency_level, years_of_experience, endorsements, is_primary) VALUES
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'expert', 5.0, 10, TRUE),
('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'advanced', 4.5, 8, FALSE),
('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004', 'expert', 7.0, 15, TRUE);

-- Sample experiences
INSERT INTO experiences (id, profile_id, company_name, job_title, location, start_date, end_date, is_current, description) VALUES
('950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Tech Company Inc', 'Senior Developer', 'San Francisco, CA', '2021-01-01', NULL, TRUE, 'Leading full-stack development team'),
('950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'StartUp XYZ', 'Junior Developer', 'San Jose, CA', '2018-06-01', '2020-12-31', FALSE, 'Worked on backend systems');

-- Sample education
INSERT INTO education (id, profile_id, school_name, degree, field_of_study, start_date, end_date, grade) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'UC Berkeley', 'Bachelor', 'Computer Science', '2014-09-01', '2018-05-31', 3.8),
('a50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'Stanford University', 'Master', 'Business Administration', '2016-09-01', '2018-05-31', 3.9);

-- Sample subscriptions
INSERT INTO subscriptions (id, user_id, plan_name, plan_tier, is_active) VALUES
('b50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Pro Plan', 'pro', TRUE),
('b50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Pro Plan', 'pro', TRUE),
('b50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Enterprise Plan', 'enterprise', TRUE);

-- ============================================================================
-- VIEWS (Optional - for common queries)
-- ============================================================================

-- User profile summary view
CREATE OR REPLACE VIEW user_profiles_summary AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    p.headline,
    p.location,
    COUNT(DISTINCT us.id) as skill_count,
    COUNT(DISTINCT e.id) as experience_count,
    u.is_active,
    u.created_at
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN user_skills us ON p.id = us.profile_id
LEFT JOIN experiences e ON p.id = e.profile_id
GROUP BY u.id, u.email, u.first_name, u.last_name, p.headline, p.location, u.is_active, u.created_at;

-- Job match overview
CREATE OR REPLACE VIEW job_match_overview AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(DISTINCT jm.job_id) as total_matches,
    AVG(jm.match_score) as avg_match_score,
    SUM(CASE WHEN jm.status = 'applied' THEN 1 ELSE 0 END) as applied_count,
    SUM(CASE WHEN jm.status = 'saved' THEN 1 ELSE 0 END) as saved_count
FROM users u
LEFT JOIN job_matches jm ON u.id = jm.user_id
GROUP BY u.id, u.email;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Performance indexes for common queries
CREATE INDEX idx_job_matches_user_status ON job_matches(user_id, status);
CREATE INDEX idx_interview_sessions_user_status ON interview_sessions(user_id, status);
CREATE INDEX idx_learning_paths_user_status ON learning_paths(user_id, status);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);

-- ============================================================================
-- END OF DATABASE SCHEMA
-- ============================================================================
-- Total Tables: 19
-- Total Indexes: 40+
-- Total Views: 2
-- Character Set: UTF8MB4 (Full Unicode support)
-- ============================================================================