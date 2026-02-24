// ===== Orionix Services: Simulated API Layer =====
// Audit-reviewed: business validations, enrollment checks, safe localStorage, session integration.

import { User, Course, Module, Assignment, Submission, Notification, CourseProgress, PlatformStats, Enrollment } from '@/types';
import { mockUsers } from '@/data/users';
import { mockCourses } from '@/data/courses';
import { mockModules } from '@/data/modules';
import { mockAssignments, mockSubmissions, mockNotifications, mockProgress } from '@/data/assignments';
import { mockEnrollments } from '@/data/enrollments';
import { sessionService } from '@/services/sessionService';

const delay = (ms?: number) => new Promise(res => setTimeout(res, ms ?? (300 + Math.random() * 500)));

// ── Safe localStorage helpers ──
function safeGetUser(): User | null {
          if (typeof window === 'undefined') return null;
          try {
                    const data = localStorage.getItem('orionix_user');
                    if (!data) return null;
                    const parsed = JSON.parse(data);
                    // Schema validation: must have id, email, role
                    if (typeof parsed.id !== 'string' || typeof parsed.email !== 'string' || !['student', 'teacher', 'admin'].includes(parsed.role)) {
                              console.warn('[Orionix] Corrupt user data in localStorage, clearing.');
                              localStorage.removeItem('orionix_user');
                              return null;
                    }
                    return parsed as User;
          } catch {
                    console.warn('[Orionix] Failed to parse user from localStorage, clearing.');
                    localStorage.removeItem('orionix_user');
                    return null;
          }
}

// ── In-memory enrollment store (mutable for runtime) ──
const _enrollments: Enrollment[] = [...mockEnrollments];

// ── Auth Service ──
export const authService = {
          async login(email: string, _password: string): Promise<User | null> {
                    await delay(600);
                    const user = mockUsers.find(u => u.email === email);
                    if (user) {
                              localStorage.setItem('orionix_user', JSON.stringify(user));
                              // Create session
                              sessionService.createSession(user.id, user.name, user.role);
                              return user;
                    }
                    return null;
          },
          async register(name: string, email: string, _password: string, role: 'student' | 'teacher'): Promise<User> {
                    await delay(800);
                    const newUser: User = { id: `u${Date.now()}`, name, email, role, createdAt: new Date().toISOString(), isApproved: role === 'student', isActive: true };
                    localStorage.setItem('orionix_user', JSON.stringify(newUser));
                    sessionService.createSession(newUser.id, newUser.name, newUser.role);
                    return newUser;
          },
          async logout(): Promise<void> {
                    await delay(200);
                    sessionService.destroyCurrentSession();
                    localStorage.removeItem('orionix_user');
          },
          getCurrentUser(): User | null {
                    return safeGetUser();
          },
};

// ── Course Service ──
export const courseService = {
          async list(filters?: { category?: string; level?: string; search?: string }): Promise<Course[]> {
                    await delay();
                    let courses = [...mockCourses];
                    if (filters?.category) courses = courses.filter(c => c.category === filters.category);
                    if (filters?.level) courses = courses.filter(c => c.level === filters.level);
                    if (filters?.search) {
                              const q = filters.search.toLowerCase();
                              courses = courses.filter(c => c.title.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q)));
                    }
                    return courses;
          },
          async getById(id: string): Promise<Course | undefined> {
                    await delay();
                    return mockCourses.find(c => c.id === id);
          },
          async enroll(courseId: string, studentId: string, studentName: string): Promise<{ success: boolean; error?: string }> {
                    await delay(500);
                    const course = mockCourses.find(c => c.id === courseId);

                    // Validation: course must exist
                    if (!course) return { success: false, error: 'El curso no existe.' };

                    // Validation: course must be published
                    if (course.status !== 'published') return { success: false, error: 'Solo se puede inscribir en cursos publicados.' };

                    // Validation: capacity not exceeded
                    if (course.enrolled >= course.capacity) return { success: false, error: 'El curso ha alcanzado su cupo máximo.' };

                    // Validation: not already enrolled
                    const existing = _enrollments.find(e => e.studentId === studentId && e.courseId === courseId && e.status === 'active');
                    if (existing) return { success: false, error: 'Ya estás inscrito en este curso.' };

                    // Create enrollment
                    const enrollment: Enrollment = {
                              id: `enr-${Date.now()}`,
                              studentId,
                              studentName,
                              courseId,
                              courseName: course.title,
                              enrolledAt: new Date().toISOString(),
                              status: 'active',
                    };
                    _enrollments.push(enrollment);
                    course.enrolled++;

                    return { success: true };
          },
          async create(data: Partial<Course>): Promise<Course> {
                    await delay(800);
                    const newCourse: Course = {
                              id: `c${Date.now()}`, title: data.title || '', description: data.description || '', shortDescription: data.shortDescription || '',
                              teacherId: data.teacherId || '', teacherName: data.teacherName || '', category: data.category || '', tags: data.tags || [],
                              capacity: data.capacity || 30, enrolled: 0, status: 'draft', startDate: data.startDate || '', endDate: data.endDate || '',
                              createdAt: new Date().toISOString(), level: data.level || 'beginner',
                    };
                    return newCourse;
          },
          async update(id: string, data: Partial<Course>): Promise<Course> {
                    await delay(500);
                    const course = mockCourses.find(c => c.id === id);
                    return { ...course!, ...data };
          },
          async publish(id: string): Promise<Course> {
                    await delay(500);
                    const course = mockCourses.find(c => c.id === id);
                    return { ...course!, status: 'published' };
          },
          async getModules(courseId: string): Promise<Module[]> {
                    await delay();
                    return mockModules.filter(m => m.courseId === courseId);
          },
};

// ── Enrollment Service ──
export const enrollmentService = {
          async listByStudent(studentId: string): Promise<Enrollment[]> {
                    await delay();
                    return _enrollments.filter(e => e.studentId === studentId && e.status === 'active');
          },
          async listByCourse(courseId: string): Promise<Enrollment[]> {
                    await delay();
                    return _enrollments.filter(e => e.courseId === courseId && e.status === 'active');
          },
          isEnrolled(studentId: string, courseId: string): boolean {
                    return _enrollments.some(e => e.studentId === studentId && e.courseId === courseId && e.status === 'active');
          },
};

// ── Assignment Service ──
export const assignmentService = {
          async list(courseId?: string): Promise<Assignment[]> {
                    await delay();
                    if (courseId) return mockAssignments.filter(a => a.courseId === courseId);
                    return [...mockAssignments];
          },
          async create(data: Partial<Assignment>): Promise<Assignment> {
                    await delay(600);
                    return { id: `as${Date.now()}`, courseId: data.courseId || '', courseName: data.courseName || '', title: data.title || '', description: data.description || '', deadline: data.deadline || '', status: 'assigned', maxScore: data.maxScore || 100, createdAt: new Date().toISOString() };
          },
          async submit(assignmentId: string, studentId: string, studentName: string, file?: string, comment?: string): Promise<{ success: boolean; submission?: Submission; error?: string }> {
                    await delay(700);
                    const assignment = mockAssignments.find(a => a.id === assignmentId);
                    if (!assignment) return { success: false, error: 'Tarea no encontrada.' };

                    // Validation: student must be enrolled in the course
                    if (!enrollmentService.isEnrolled(studentId, assignment.courseId)) {
                              return { success: false, error: 'Debes estar inscrito en el curso para entregar esta tarea.' };
                    }

                    // Validation: deadline not passed
                    if (new Date(assignment.deadline) < new Date()) {
                              return { success: false, error: 'La fecha límite ya pasó.' };
                    }

                    const submission: Submission = {
                              id: `s${Date.now()}`, assignmentId, studentId, studentName,
                              submittedAt: new Date().toISOString(), fileName: file, comment, status: 'submitted',
                    };
                    return { success: true, submission };
          },
          async grade(submissionId: string, score: number, feedback: string): Promise<{ success: boolean; submission?: Submission; error?: string }> {
                    await delay(500);
                    const sub = mockSubmissions.find(s => s.id === submissionId);
                    if (!sub) return { success: false, error: 'Entrega no encontrada.' };
                    if (sub.status === 'graded') return { success: false, error: 'Esta entrega ya fue calificada.' };
                    return { success: true, submission: { ...sub, score, feedback, status: 'graded' } };
          },
          async getSubmissions(assignmentId: string): Promise<Submission[]> {
                    await delay();
                    return mockSubmissions.filter(s => s.assignmentId === assignmentId);
          },
};

// ── Notification Service ──
export const notificationService = {
          async list(userId: string): Promise<Notification[]> {
                    await delay();
                    return mockNotifications.filter(n => n.userId === userId);
          },
          async markRead(notificationId: string): Promise<void> {
                    await delay(200);
                    const n = mockNotifications.find(no => no.id === notificationId);
                    if (n) n.isRead = true;
          },
};

// ── Report Service ──
export const reportService = {
          async getStats(): Promise<PlatformStats> {
                    await delay(500);
                    return {
                              totalUsers: mockUsers.length,
                              totalStudents: mockUsers.filter(u => u.role === 'student').length,
                              totalTeachers: mockUsers.filter(u => u.role === 'teacher').length,
                              totalCourses: mockCourses.length,
                              activeCourses: mockCourses.filter(c => c.status === 'published').length,
                              totalEnrollments: _enrollments.filter(e => e.status === 'active').length,
                              recentActivity: [
                                        { id: 'act1', action: 'Se inscribió en "Desarrollo Web Full Stack"', user: 'Ana Lucía Torres', timestamp: '2026-02-22T10:30:00Z', type: 'enrollment' },
                                        { id: 'act2', action: 'Entregó "Análisis de dataset Iris"', user: 'Daniel Herrera', timestamp: '2026-02-22T09:15:00Z', type: 'submission' },
                                        { id: 'act3', action: 'Creó el curso "Ciberseguridad"', user: 'Prof. Marco Gutiérrez', timestamp: '2026-02-21T16:00:00Z', type: 'course_created' },
                                        { id: 'act4', action: 'Calificó "Quiz: Fundamentos de ML"', user: 'Prof. Marco Gutiérrez', timestamp: '2026-02-21T14:00:00Z', type: 'grade' },
                              ],
                    };
          },
          async getProgress(studentId?: string): Promise<CourseProgress[]> {
                    await delay();
                    if (studentId) return mockProgress.filter(p => p.studentId === studentId);
                    return [...mockProgress];
          },
};
