"""Database models for AI Career Hub."""

from .user import User, UserRole
from .profile import Profile
from .skill import Skill, UserSkill, SkillCategory, ProficiencyLevel
from .experience import Experience
from .education import Education
from .project import Project
from .certification import Certification
from .language import Language, LanguageProficiency
from .target_career import TargetCareer, RemotePreference
from .resume import Resume
from .cover_letter import CoverLetter
from .job import Job, EmploymentType, RemoteType
from .job_match import JobMatch, JobMatchStatus
from .interview import (
    InterviewSession, InterviewQuestion, InterviewAnswer,
    InterviewType, Difficulty, SessionStatus
)
from .learning_path import (
    LearningPath, LearningMilestone, LearningResource,
    LearningLevel, ResourceType
)
from .notification import Notification, NotificationType
from .subscription import Subscription, SubscriptionPlan, SubscriptionStatus
from .audit_log import AuditLog

__all__ = [
    # User & Profile
    "User", "UserRole",
    "Profile",
    
    # Skills
    "Skill", "UserSkill", "SkillCategory", "ProficiencyLevel",
    
    # Experience & Education
    "Experience",
    "Education",
    "Project",
    "Certification",
    "Language", "LanguageProficiency",
    "TargetCareer", "RemotePreference",
    
    # Resume & Cover Letter
    "Resume",
    "CoverLetter",
    
    # Jobs
    "Job", "EmploymentType", "RemoteType",
    "JobMatch", "JobMatchStatus",
    
    # Interviews
    "InterviewSession", "InterviewQuestion", "InterviewAnswer",
    "InterviewType", "Difficulty", "SessionStatus",
    
    # Learning
    "LearningPath", "LearningMilestone", "LearningResource",
    "LearningLevel", "ResourceType",
    
    # System
    "Notification", "NotificationType",
    "Subscription", "SubscriptionPlan", "SubscriptionStatus",
    "AuditLog",
]
