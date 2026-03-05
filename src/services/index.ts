// ===== Orionix Services: Real data via API + Prisma =====
import { User, Course, Module, Assignment, Submission, Notification, CourseProgress, PlatformStats, Enrollment } from '@/types';
import { sessionService } from '@/services/sessionService';

async function apiCall<T>(op: string, payload?: Record<string, unknown>): Promise<T> {
  const response = await fetch('/api/client-services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ op, payload }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error || `Error ${response.status} en ${op}`);
  }

  const json = (await response.json()) as { data: T };
  return json.data;
}

function parseStoredUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as User;
    if (!parsed?.id || !parsed?.email || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const authService = {
  async login(email: string, _password: string): Promise<User | null> {
    const user = await apiCall<User | null>('auth.login', { email });
    if (user) {
      localStorage.setItem('orionix_user', JSON.stringify(user));
      sessionService.createSession(user.id, user.name, user.role);
    }
    return user;
  },

  async register(name: string, email: string, _password: string, role: 'student' | 'teacher'): Promise<User> {
    const user = await apiCall<User>('auth.register', { name, email, role });
    localStorage.setItem('orionix_user', JSON.stringify(user));
    sessionService.createSession(user.id, user.name, user.role);
    return user;
  },

  async logout(): Promise<void> {
    sessionService.destroyCurrentSession();
    localStorage.removeItem('orionix_user');
  },

  getCurrentUser(): User | null {
    const stored = parseStoredUser(localStorage.getItem('orionix_user'));
    if (!stored) {
      localStorage.removeItem('orionix_user');
    }
    return stored;
  },
};

export const courseService = {
  async list(filters?: { category?: string; level?: string; search?: string }): Promise<Course[]> {
    return apiCall<Course[]>('course.list', filters || {});
  },

  async getById(id: string): Promise<Course | undefined> {
    const course = await apiCall<Course | null>('course.getById', { id });
    return course ?? undefined;
  },

  async enroll(courseId: string, studentId: string, studentName: string): Promise<{ success: boolean; error?: string }> {
    return apiCall<{ success: boolean; error?: string }>('course.enroll', { courseId, studentId, studentName });
  },

  async create(data: Partial<Course>): Promise<Course> {
    return apiCall<Course>('course.create', data as Record<string, unknown>);
  },

  async update(id: string, data: Partial<Course>): Promise<Course> {
    return apiCall<Course>('course.update', { id, data: data as Record<string, unknown> });
  },

  async publish(id: string): Promise<Course> {
    return apiCall<Course>('course.publish', { id });
  },

  async getModules(courseId: string): Promise<Module[]> {
    return apiCall<Module[]>('course.modules', { courseId });
  },
};

export const enrollmentService = {
  async listByStudent(studentId: string): Promise<Enrollment[]> {
    return apiCall<Enrollment[]>('enrollment.byStudent', { studentId });
  },

  async listByCourse(courseId: string): Promise<Enrollment[]> {
    return apiCall<Enrollment[]>('enrollment.byCourse', { courseId });
  },

  async isEnrolled(studentId: string, courseId: string): Promise<boolean> {
    const enrollments = await apiCall<Enrollment[]>('enrollment.byStudent', { studentId });
    return enrollments.some((e) => e.courseId === courseId && e.status === 'active');
  },
};

export const assignmentService = {
  async list(courseId?: string): Promise<Assignment[]> {
    return apiCall<Assignment[]>('assignment.list', { courseId });
  },

  async create(data: Partial<Assignment>): Promise<Assignment> {
    return apiCall<Assignment>('assignment.create', data as Record<string, unknown>);
  },

  async submit(
    assignmentId: string,
    studentId: string,
    studentName: string,
    file?: string,
    comment?: string,
  ): Promise<{ success: boolean; submission?: Submission; error?: string }> {
    return apiCall<{ success: boolean; submission?: Submission; error?: string }>('assignment.submit', {
      assignmentId,
      studentId,
      studentName,
      file,
      comment,
    });
  },

  async grade(submissionId: string, score: number, feedback: string): Promise<{ success: boolean; submission?: Submission; error?: string }> {
    return apiCall<{ success: boolean; submission?: Submission; error?: string }>('assignment.grade', { submissionId, score, feedback });
  },

  async getSubmissions(assignmentId: string): Promise<Submission[]> {
    return apiCall<Submission[]>('assignment.submissions', { assignmentId });
  },
};

export const notificationService = {
  async list(userId: string): Promise<Notification[]> {
    return apiCall<Notification[]>('notification.list', { userId });
  },

  async markRead(notificationId: string): Promise<void> {
    await apiCall<boolean>('notification.markRead', { notificationId });
  },
};

export const reportService = {
  async getStats(): Promise<PlatformStats> {
    return apiCall<PlatformStats>('report.stats');
  },

  async getProgress(studentId?: string): Promise<CourseProgress[]> {
    return apiCall<CourseProgress[]>('report.progress', { studentId });
  },
};
