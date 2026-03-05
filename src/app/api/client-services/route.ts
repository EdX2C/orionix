import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RequestBody = {
  op: string;
  payload?: Record<string, unknown>;
};

const toArray = (value?: string | null): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
};

const toIso = (value?: Date | string | null): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.toISOString();
};

const mapUser = (user: {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
  isApproved: boolean;
  isActive: boolean;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar ?? undefined,
  bio: user.bio ?? undefined,
  createdAt: user.createdAt.toISOString(),
  isApproved: user.isApproved,
  isActive: user.isActive,
});

const mapCourse = (course: {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string | null;
  teacherId: string;
  teacherName: string;
  category: string;
  tags: string | null;
  learningOutcomes: string | null;
  capacity: number;
  enrolled: number;
  status: string;
  rating: number | null;
  level: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
}) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  shortDescription: course.shortDescription,
  thumbnail: course.thumbnail ?? undefined,
  teacherId: course.teacherId,
  teacherName: course.teacherName,
  category: course.category,
  tags: toArray(course.tags),
  learningOutcomes: toArray(course.learningOutcomes),
  capacity: course.capacity,
  enrolled: course.enrolled,
  status: course.status,
  rating: course.rating ?? undefined,
  level: course.level,
  startDate: toIso(course.startDate),
  endDate: toIso(course.endDate),
  createdAt: course.createdAt.toISOString(),
});

export async function POST(request: NextRequest) {
  try {
    const { op, payload = {} } = (await request.json()) as RequestBody;

    switch (op) {
      case 'auth.login': {
        const email = String(payload.email ?? '').trim();
        if (!email) return NextResponse.json({ data: null });
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return NextResponse.json({ data: null });
        return NextResponse.json({ data: mapUser(user) });
      }

      case 'auth.register': {
        const name = String(payload.name ?? '').trim();
        const email = String(payload.email ?? '').trim();
        const role = String(payload.role ?? 'student').trim();
        if (!name || !email) {
          return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 });
        }
        const user = await prisma.user.create({
          data: {
            name,
            email,
            role,
            isApproved: role === 'student',
            isActive: true,
          },
        });
        return NextResponse.json({ data: mapUser(user) });
      }

      case 'course.list': {
        const category = String(payload.category ?? '');
        const level = String(payload.level ?? '');
        const search = String(payload.search ?? '').trim();
        const courses = await prisma.course.findMany({
          where: {
            ...(category ? { category } : {}),
            ...(level ? { level } : {}),
            ...(search
              ? {
                  OR: [
                    { title: { contains: search } },
                    { description: { contains: search } },
                    { tags: { contains: search } },
                  ],
                }
              : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ data: courses.map(mapCourse) });
      }

      case 'course.getById': {
        const id = String(payload.id ?? '');
        const course = await prisma.course.findUnique({ where: { id } });
        return NextResponse.json({ data: course ? mapCourse(course) : null });
      }

      case 'course.enroll': {
        const courseId = String(payload.courseId ?? '');
        const studentId = String(payload.studentId ?? '');
        const studentName = String(payload.studentName ?? '');

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) return NextResponse.json({ data: { success: false, error: 'El curso no existe.' } });
        if (course.status !== 'published') {
          return NextResponse.json({ data: { success: false, error: 'Solo se puede inscribir en cursos publicados.' } });
        }
        if (course.enrolled >= course.capacity) {
          return NextResponse.json({ data: { success: false, error: 'El curso ha alcanzado su cupo maximo.' } });
        }

        const exists = await prisma.enrollment.findFirst({
          where: { courseId, studentId, status: 'active' },
          select: { id: true },
        });
        if (exists) return NextResponse.json({ data: { success: false, error: 'Ya estas inscrito en este curso.' } });

        await prisma.$transaction([
          prisma.enrollment.create({
            data: { courseId, studentId, status: 'active' },
          }),
          prisma.course.update({
            where: { id: courseId },
            data: { enrolled: { increment: 1 } },
          }),
        ]);

        return NextResponse.json({ data: { success: true, studentName } });
      }

      case 'course.create': {
        const data = payload as Record<string, unknown>;
        const course = await prisma.course.create({
          data: {
            title: String(data.title ?? ''),
            description: String(data.description ?? ''),
            shortDescription: String(data.shortDescription ?? ''),
            thumbnail: (data.thumbnail as string | undefined) ?? null,
            teacherId: String(data.teacherId ?? ''),
            teacherName: String(data.teacherName ?? ''),
            category: String(data.category ?? 'General'),
            tags: Array.isArray(data.tags) ? (data.tags as string[]).join(',') : null,
            learningOutcomes: Array.isArray(data.learningOutcomes) ? (data.learningOutcomes as string[]).join(',') : null,
            capacity: Number(data.capacity ?? 30),
            enrolled: Number(data.enrolled ?? 0),
            status: String(data.status ?? 'draft'),
            rating: typeof data.rating === 'number' ? data.rating : null,
            level: String(data.level ?? 'beginner'),
            startDate: data.startDate ? new Date(String(data.startDate)) : null,
            endDate: data.endDate ? new Date(String(data.endDate)) : null,
          },
        });
        return NextResponse.json({ data: mapCourse(course) });
      }

      case 'course.update': {
        const id = String(payload.id ?? '');
        const data = (payload.data ?? {}) as Record<string, unknown>;
        const updated = await prisma.course.update({
          where: { id },
          data: {
            ...(data.title !== undefined ? { title: String(data.title) } : {}),
            ...(data.description !== undefined ? { description: String(data.description) } : {}),
            ...(data.shortDescription !== undefined ? { shortDescription: String(data.shortDescription) } : {}),
            ...(data.thumbnail !== undefined ? { thumbnail: String(data.thumbnail) } : {}),
            ...(data.category !== undefined ? { category: String(data.category) } : {}),
            ...(data.tags !== undefined ? { tags: Array.isArray(data.tags) ? (data.tags as string[]).join(',') : null } : {}),
            ...(data.learningOutcomes !== undefined
              ? { learningOutcomes: Array.isArray(data.learningOutcomes) ? (data.learningOutcomes as string[]).join(',') : null }
              : {}),
            ...(data.capacity !== undefined ? { capacity: Number(data.capacity) } : {}),
            ...(data.status !== undefined ? { status: String(data.status) } : {}),
            ...(data.level !== undefined ? { level: String(data.level) } : {}),
            ...(data.startDate !== undefined ? { startDate: data.startDate ? new Date(String(data.startDate)) : null } : {}),
            ...(data.endDate !== undefined ? { endDate: data.endDate ? new Date(String(data.endDate)) : null } : {}),
          },
        });
        return NextResponse.json({ data: mapCourse(updated) });
      }

      case 'course.publish': {
        const id = String(payload.id ?? '');
        const updated = await prisma.course.update({ where: { id }, data: { status: 'published' } });
        return NextResponse.json({ data: mapCourse(updated) });
      }

      case 'course.modules': {
        const courseId = String(payload.courseId ?? '');
        const modules = await prisma.module.findMany({
          where: { courseId },
          include: { units: { orderBy: { title: 'asc' } } },
          orderBy: { order: 'asc' },
        });
        const data = modules.map((m) => ({
          id: m.id,
          courseId: m.courseId,
          title: m.title,
          description: m.description ?? '',
          order: m.order,
          units: m.units.map((u) => ({
            id: u.id,
            moduleId: u.moduleId,
            title: u.title,
            type: u.type,
            duration: u.duration,
            isCompleted: u.isCompleted,
          })),
        }));
        return NextResponse.json({ data });
      }

      case 'enrollment.byStudent': {
        const studentId = String(payload.studentId ?? '');
        const enrollments = await prisma.enrollment.findMany({
          where: { studentId, status: 'active' },
          include: { student: true, course: true },
          orderBy: { enrolledAt: 'desc' },
        });
        const data = enrollments.map((e) => ({
          id: e.id,
          studentId: e.studentId,
          studentName: e.student.name,
          courseId: e.courseId,
          courseName: e.course.title,
          enrolledAt: e.enrolledAt.toISOString(),
          status: e.status,
        }));
        return NextResponse.json({ data });
      }

      case 'enrollment.byCourse': {
        const courseId = String(payload.courseId ?? '');
        const enrollments = await prisma.enrollment.findMany({
          where: { courseId, status: 'active' },
          include: { student: true, course: true },
          orderBy: { enrolledAt: 'desc' },
        });
        const data = enrollments.map((e) => ({
          id: e.id,
          studentId: e.studentId,
          studentName: e.student.name,
          courseId: e.courseId,
          courseName: e.course.title,
          enrolledAt: e.enrolledAt.toISOString(),
          status: e.status,
        }));
        return NextResponse.json({ data });
      }

      case 'assignment.list': {
        const courseId = String(payload.courseId ?? '');
        const assignments = await prisma.assignment.findMany({
          where: courseId ? { courseId } : undefined,
          include: { course: true },
          orderBy: { createdAt: 'desc' },
        });
        const data = assignments.map((a) => ({
          id: a.id,
          courseId: a.courseId,
          courseName: a.course.title,
          title: a.title,
          description: a.description,
          deadline: a.deadline.toISOString(),
          status: a.status,
          maxScore: a.maxScore,
          createdAt: a.createdAt.toISOString(),
        }));
        return NextResponse.json({ data });
      }

      case 'assignment.create': {
        const data = payload as Record<string, unknown>;
        const created = await prisma.assignment.create({
          data: {
            courseId: String(data.courseId ?? ''),
            title: String(data.title ?? ''),
            description: String(data.description ?? ''),
            deadline: new Date(String(data.deadline ?? new Date().toISOString())),
            maxScore: Number(data.maxScore ?? 100),
            status: String(data.status ?? 'assigned'),
          },
          include: { course: true },
        });
        return NextResponse.json({
          data: {
            id: created.id,
            courseId: created.courseId,
            courseName: created.course.title,
            title: created.title,
            description: created.description,
            deadline: created.deadline.toISOString(),
            status: created.status,
            maxScore: created.maxScore,
            createdAt: created.createdAt.toISOString(),
          },
        });
      }

      case 'assignment.submit': {
        const assignmentId = String(payload.assignmentId ?? '');
        const studentId = String(payload.studentId ?? '');
        const studentName = String(payload.studentName ?? '');
        const file = payload.file ? String(payload.file) : undefined;
        const comment = payload.comment ? String(payload.comment) : undefined;

        const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
        if (!assignment) return NextResponse.json({ data: { success: false, error: 'Tarea no encontrada.' } });

        const enrollment = await prisma.enrollment.findFirst({ where: { courseId: assignment.courseId, studentId, status: 'active' } });
        if (!enrollment) {
          return NextResponse.json({ data: { success: false, error: 'Debes estar inscrito en el curso para entregar esta tarea.' } });
        }

        if (assignment.deadline < new Date()) {
          return NextResponse.json({ data: { success: false, error: 'La fecha limite ya paso.' } });
        }

        const created = await prisma.submission.create({
          data: {
            assignmentId,
            studentId,
            studentName,
            submittedAt: new Date(),
            fileName: file,
            comment,
            status: 'submitted',
          },
        });

        return NextResponse.json({
          data: {
            success: true,
            submission: {
              id: created.id,
              assignmentId: created.assignmentId,
              studentId: created.studentId,
              studentName: created.studentName,
              submittedAt: toIso(created.submittedAt),
              fileName: created.fileName ?? undefined,
              comment: created.comment ?? undefined,
              status: created.status,
            },
          },
        });
      }

      case 'assignment.grade': {
        const submissionId = String(payload.submissionId ?? '');
        const score = Number(payload.score ?? 0);
        const feedback = String(payload.feedback ?? '');
        const updated = await prisma.submission.update({
          where: { id: submissionId },
          data: { score, feedback, status: 'graded' },
        });
        return NextResponse.json({
          data: {
            success: true,
            submission: {
              id: updated.id,
              assignmentId: updated.assignmentId,
              studentId: updated.studentId,
              studentName: updated.studentName,
              submittedAt: toIso(updated.submittedAt),
              fileName: updated.fileName ?? undefined,
              comment: updated.comment ?? undefined,
              score: updated.score ?? undefined,
              feedback: updated.feedback ?? undefined,
              status: updated.status,
            },
          },
        });
      }

      case 'assignment.submissions': {
        const assignmentId = String(payload.assignmentId ?? '');
        const submissions = await prisma.submission.findMany({
          where: { assignmentId },
          orderBy: { submittedAt: 'desc' },
        });
        const data = submissions.map((s) => ({
          id: s.id,
          assignmentId: s.assignmentId,
          studentId: s.studentId,
          studentName: s.studentName,
          submittedAt: toIso(s.submittedAt),
          fileName: s.fileName ?? undefined,
          comment: s.comment ?? undefined,
          score: s.score ?? undefined,
          feedback: s.feedback ?? undefined,
          status: s.status,
        }));
        return NextResponse.json({ data });
      }

      case 'notification.list': {
        const userId = String(payload.userId ?? '');
        const submissions = await prisma.submission.findMany({
          where: { studentId: userId, status: 'graded' },
          include: { assignment: true },
          orderBy: { submittedAt: 'desc' },
          take: 20,
        });

        const dueAssignments = await prisma.assignment.findMany({
          where: {
            course: {
              enrollments: {
                some: { studentId: userId, status: 'active' },
              },
            },
          },
          orderBy: { deadline: 'asc' },
          take: 20,
        });

        const gradedNotifications = submissions.map((s) => ({
          id: `grade-${s.id}`,
          userId,
          title: 'Tu entrega fue calificada',
          message: `${s.assignment.title}: ${s.score ?? 0} puntos`,
          type: 'grade',
          isRead: false,
          createdAt: toIso(s.submittedAt),
          link: `/app/student/assignments`,
        }));

        const dueNotifications = dueAssignments
          .filter((a) => a.deadline > new Date())
          .map((a) => ({
            id: `due-${a.id}`,
            userId,
            title: 'Tarea pendiente',
            message: `${a.title} vence el ${a.deadline.toLocaleDateString('es-DO')}`,
            type: 'assignment',
            isRead: false,
            createdAt: a.createdAt.toISOString(),
            link: '/app/student/assignments',
          }));

        const all = [...gradedNotifications, ...dueNotifications]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 30);

        return NextResponse.json({ data: all });
      }

      case 'notification.markRead': {
        return NextResponse.json({ data: true });
      }

      case 'report.stats': {
        const [
          totalUsers,
          totalStudents,
          totalTeachers,
          totalCourses,
          activeCourses,
          totalEnrollments,
          latestEnrollments,
          latestSubmissions,
          latestCourses,
        ] = await Promise.all([
          prisma.user.count(),
          prisma.user.count({ where: { role: 'student' } }),
          prisma.user.count({ where: { role: 'teacher' } }),
          prisma.course.count(),
          prisma.course.count({ where: { status: 'published' } }),
          prisma.enrollment.count({ where: { status: 'active' } }),
          prisma.enrollment.findMany({ include: { student: true, course: true }, orderBy: { enrolledAt: 'desc' }, take: 5 }),
          prisma.submission.findMany({ include: { student: true, assignment: true }, orderBy: { submittedAt: 'desc' }, take: 5 }),
          prisma.course.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        ]);

        const recentActivity = [
          ...latestEnrollments.map((e) => ({
            id: `enroll-${e.id}`,
            action: `Se inscribio en \"${e.course.title}\"`,
            user: e.student.name,
            timestamp: e.enrolledAt.toISOString(),
            type: 'enrollment',
          })),
          ...latestSubmissions.map((s) => ({
            id: `sub-${s.id}`,
            action: `Entrego \"${s.assignment.title}\"`,
            user: s.student.name,
            timestamp: toIso(s.submittedAt),
            type: 'submission',
          })),
          ...latestCourses.map((c) => ({
            id: `course-${c.id}`,
            action: `Creo el curso \"${c.title}\"`,
            user: c.teacherName,
            timestamp: c.createdAt.toISOString(),
            type: 'course_created',
          })),
        ]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10);

        return NextResponse.json({
          data: {
            totalUsers,
            totalStudents,
            totalTeachers,
            totalCourses,
            activeCourses,
            totalEnrollments,
            recentActivity,
          },
        });
      }

      case 'report.progress': {
        const studentId = String(payload.studentId ?? '');
        const enrollments = await prisma.enrollment.findMany({
          where: studentId ? { studentId } : undefined,
          include: {
            course: {
              include: {
                modules: { include: { units: true } },
              },
            },
          },
          orderBy: { enrolledAt: 'desc' },
        });

        const data = enrollments.map((e) => {
          const totalUnits = e.course.modules.reduce((acc, m) => acc + m.units.length, 0);
          const percentage = Math.max(0, Math.min(100, e.progress));
          const completedUnits = totalUnits > 0 ? Math.round((totalUnits * percentage) / 100) : 0;
          return {
            studentId: e.studentId,
            courseId: e.courseId,
            courseName: e.course.title,
            completedUnits,
            totalUnits,
            percentage,
            lastAccessed: e.enrolledAt.toISOString(),
          };
        });

        return NextResponse.json({ data });
      }

      default:
        return NextResponse.json({ error: `Operacion no soportada: ${op}` }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
