import { ActivityItem } from '@/components/ui/ActivityFeed';

const now = new Date();
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000).toISOString();

export const mockActivities: ActivityItem[] = [
          { id: 'act-1', type: 'submission', title: 'Tarea entregada', description: 'entregó "Proyecto Final de Python"', userName: 'Laura Martínez', userRole: 'student', timestamp: h(0.3) },
          { id: 'act-2', type: 'grade', title: 'Calificación registrada', description: 'calificó la tarea "API REST con Node.js" — 95/100', userName: 'Dr. Roberto Sánchez', userRole: 'teacher', timestamp: h(1.2) },
          { id: 'act-3', type: 'enrollment', title: 'Nueva inscripción', description: 'se inscribió en "Fundamentos de Python"', userName: 'Camila Herrera', userRole: 'student', timestamp: h(2.5) },
          { id: 'act-4', type: 'course_published', title: 'Curso publicado', description: 'publicó el curso "Machine Learning Avanzado"', userName: 'Dra. Ana Ruiz', userRole: 'teacher', timestamp: h(4) },
          { id: 'act-5', type: 'announcement', title: 'Nuevo anuncio', description: 'publicó un anuncio en "Diseño UX/UI Profesional"', userName: 'Prof. Carlos Mendoza', userRole: 'teacher', timestamp: h(5) },
          { id: 'act-6', type: 'achievement', title: 'Logro desbloqueado', description: 'obtuvo el badge "Estudiante Activo" 🏅', userName: 'María Fernanda López', userRole: 'student', timestamp: h(8) },
          { id: 'act-7', type: 'submission', title: 'Tarea entregada', description: 'entregó "Diseño de Interfaces Responsive"', userName: 'Andrés Gómez', userRole: 'student', timestamp: h(12) },
          { id: 'act-8', type: 'new_user', title: 'Nuevo usuario', description: 'se registró en la plataforma', userName: 'Diego Vargas', userRole: 'student', timestamp: h(18) },
          { id: 'act-9', type: 'module_added', title: 'Módulo agregado', description: 'agregó el módulo "Redes Neuronales" a Machine Learning', userName: 'Dra. Ana Ruiz', userRole: 'teacher', timestamp: h(24) },
          { id: 'act-10', type: 'grade', title: 'Calificación registrada', description: 'calificó 3 tareas en "Fundamentos de Python"', userName: 'Dr. Roberto Sánchez', userRole: 'teacher', timestamp: h(30) },
          { id: 'act-11', type: 'enrollment', title: 'Nueva inscripción', description: 'se inscribió en "Ciberseguridad Empresarial"', userName: 'Laura Martínez', userRole: 'student', timestamp: h(36) },
          { id: 'act-12', type: 'course_published', title: 'Curso publicado', description: 'publicó el curso "Bases de Datos NoSQL"', userName: 'Prof. Carlos Mendoza', userRole: 'teacher', timestamp: h(48) },
];
