// ===== Orionix Mock Data: Assignments, Submissions, Notifications, Progress =====
import { Assignment, Submission, Notification, CourseProgress } from '@/types';

export const mockAssignments: Assignment[] = [
          { id: 'as1', courseId: 'c1', courseName: 'Fundamentos de Programación con Python', title: 'Ejercicios de variables y tipos', description: 'Resuelve los 10 ejercicios del documento adjunto sobre variables, tipos de datos y operaciones básicas.', deadline: '2026-02-28T23:59:00Z', status: 'assigned', maxScore: 100, createdAt: '2026-02-01T10:00:00Z' },
          { id: 'as2', courseId: 'c1', courseName: 'Fundamentos de Programación con Python', title: 'Proyecto: Calculadora CLI', description: 'Crea una calculadora de línea de comandos que soporte las 4 operaciones básicas, manejo de errores y un menú interactivo.', deadline: '2026-03-15T23:59:00Z', status: 'in_progress', maxScore: 100, createdAt: '2026-02-10T10:00:00Z' },
          { id: 'as3', courseId: 'c2', courseName: 'Inteligencia Artificial', title: 'Análisis de dataset Iris', description: 'Aplica regresión logística al dataset Iris y reporta métricas de precisión, recall y F1-score.', deadline: '2026-03-01T23:59:00Z', status: 'submitted', maxScore: 100, createdAt: '2026-02-05T09:00:00Z' },
          { id: 'as4', courseId: 'c2', courseName: 'Inteligencia Artificial', title: 'Quiz: Fundamentos de ML', description: 'Quiz teórico sobre los conceptos básicos de Machine Learning.', deadline: '2026-02-20T23:59:00Z', status: 'graded', maxScore: 50, createdAt: '2026-02-01T09:00:00Z' },
          { id: 'as5', courseId: 'c4', courseName: 'Desarrollo Web Full Stack con Next.js', title: 'Portafolio personal', description: 'Construye un portafolio personal usando Next.js con al menos 3 páginas y diseño responsive.', deadline: '2026-04-01T23:59:00Z', status: 'assigned', maxScore: 100, createdAt: '2026-03-01T10:00:00Z' },
];

export const mockSubmissions: Submission[] = [
          { id: 's1', assignmentId: 'as3', studentId: 'u4', studentName: 'Ana Lucía Torres', submittedAt: '2026-02-28T22:30:00Z', fileName: 'analisis_iris.ipynb', comment: 'Adjunto notebook con el análisis completo.', status: 'submitted' },
          { id: 's2', assignmentId: 'as4', studentId: 'u4', studentName: 'Ana Lucía Torres', submittedAt: '2026-02-19T15:00:00Z', status: 'graded', score: 45, feedback: 'Excelente comprensión de los conceptos. Solo faltó profundizar en overfitting.' },
          { id: 's3', assignmentId: 'as4', studentId: 'u5', studentName: 'Daniel Herrera', submittedAt: '2026-02-20T10:00:00Z', status: 'graded', score: 38, feedback: 'Buenos fundamentos pero revisa la diferencia entre supervisado y no supervisado.' },
          { id: 's4', assignmentId: 'as3', studentId: 'u5', studentName: 'Daniel Herrera', submittedAt: '2026-03-01T01:00:00Z', fileName: 'iris_analysis.py', comment: 'Script de Python con el análisis.', status: 'submitted' },
          { id: 's5', assignmentId: 'as2', studentId: 'u4', studentName: 'Ana Lucía Torres', submittedAt: '', fileName: '', comment: '', status: 'in_progress' },
];

export const mockNotifications: Notification[] = [
          { id: 'n1', userId: 'u4', title: 'Nueva tarea asignada', message: 'Se ha publicado "Ejercicios de variables y tipos" en Fundamentos de Python.', type: 'assignment', isRead: false, createdAt: '2026-02-22T10:00:00Z', link: '/app/student/assignments' },
          { id: 'n2', userId: 'u4', title: 'Calificación disponible', message: 'Tu quiz "Fundamentos de ML" ha sido calificado: 45/50.', type: 'grade', isRead: false, createdAt: '2026-02-21T14:00:00Z', link: '/app/student/assignments' },
          { id: 'n3', userId: 'u4', title: 'Nuevo anuncio', message: 'La Dra. Elena Ríos publicó un anuncio en Fundamentos de Python.', type: 'info', isRead: true, createdAt: '2026-02-20T09:00:00Z' },
          { id: 'n4', userId: 'u4', title: 'Inscripción exitosa', message: 'Te has inscrito exitosamente en "Desarrollo Web Full Stack con Next.js".', type: 'success', isRead: true, createdAt: '2026-02-18T16:00:00Z' },
          { id: 'n5', userId: 'u2', title: 'Nueva entrega recibida', message: 'Ana Lucía Torres entregó "Análisis de dataset Iris".', type: 'assignment', isRead: false, createdAt: '2026-02-28T22:30:00Z' },
          { id: 'n6', userId: 'u2', title: 'Curso aprobado', message: 'Tu curso "Ciencia de Datos con R y Python" ha sido aprobado y publicado.', type: 'success', isRead: true, createdAt: '2026-02-10T11:00:00Z' },
          { id: 'n7', userId: 'u1', title: 'Nuevo docente pendiente', message: 'Prof. Laura Castillo ha solicitado unirse como docente.', type: 'warning', isRead: false, createdAt: '2026-02-22T08:00:00Z' },
          { id: 'n8', userId: 'u1', title: 'Curso pendiente de revisión', message: '"Ciberseguridad: Protege el Mundo Digital" necesita aprobación.', type: 'course', isRead: false, createdAt: '2026-02-20T10:00:00Z' },
];

export const mockProgress: CourseProgress[] = [
          { studentId: 'u4', courseId: 'c1', courseName: 'Fundamentos de Programación con Python', completedUnits: 4, totalUnits: 13, percentage: 31, lastAccessed: '2026-02-22T08:00:00Z' },
          { studentId: 'u4', courseId: 'c2', courseName: 'Inteligencia Artificial', completedUnits: 2, totalUnits: 5, percentage: 40, lastAccessed: '2026-02-21T15:00:00Z' },
          { studentId: 'u4', courseId: 'c4', courseName: 'Desarrollo Web Full Stack con Next.js', completedUnits: 0, totalUnits: 2, percentage: 0, lastAccessed: '2026-02-18T16:00:00Z' },
          { studentId: 'u5', courseId: 'c1', courseName: 'Fundamentos de Programación con Python', completedUnits: 8, totalUnits: 13, percentage: 62, lastAccessed: '2026-02-22T09:00:00Z' },
          { studentId: 'u5', courseId: 'c2', courseName: 'Inteligencia Artificial', completedUnits: 3, totalUnits: 5, percentage: 60, lastAccessed: '2026-02-22T07:00:00Z' },
];

export const getNotificationsByUser = (userId: string) => mockNotifications.filter(n => n.userId === userId);
export const getProgressByStudent = () => mockProgress;
export const getAssignmentsByCourse = (courseId: string) => mockAssignments.filter(a => a.courseId === courseId);
export const getSubmissionsByAssignment = (assignmentId: string) => mockSubmissions.filter(s => s.assignmentId === assignmentId);
