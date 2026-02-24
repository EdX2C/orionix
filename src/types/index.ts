// ===== Orionix Type Definitions =====

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: string;
  isApproved?: boolean;
  isActive?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail?: string;
  teacherId: string;
  teacherName: string;
  category: string;
  tags: string[];
  capacity: number;
  enrolled: number;
  status: 'draft' | 'pending' | 'published' | 'archived';
  startDate: string;
  endDate: string;
  createdAt: string;
  rating?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  learningOutcomes?: string[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  units: Unit[];
  lessons?: { title: string; duration?: string }[];
}

export interface Unit {
  id: string;
  moduleId: string;
  title: string;
  type: 'lesson' | 'quiz' | 'activity' | 'video' | 'document';
  duration?: string;
  isCompleted?: boolean;
}

export interface Material {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  size?: string;
  uploadedAt: string;
}

export type AssignmentStatus = 'assigned' | 'in_progress' | 'submitted' | 'graded';

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  deadline: string;
  status: AssignmentStatus;
  maxScore: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl?: string;
  fileName?: string;
  comment?: string;
  score?: number;
  feedback?: string;
  status: AssignmentStatus;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'assignment' | 'course' | 'grade';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface CourseProgress {
  studentId: string;
  courseId: string;
  courseName: string;
  completedUnits: number;
  totalUnits: number;
  percentage: number;
  lastAccessed: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
  recentActivity: ActivityItem[];
  studentCount?: number;
  teacherCount?: number;
  adminCount?: number;
  activityRate?: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'enrollment' | 'submission' | 'course_created' | 'grade';
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
}

// ── Security & Session Management ──

export interface Session {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  device: string;
  browser: string;
  ip: string;
  location: string;
  createdAt: string;
  lastActive: string;
  status: 'active' | 'revoked' | 'expired';
}

// ── Enrollment Model ──

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'dropped';
}
