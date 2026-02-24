// ===== Orionix Mock Data: Modules, Materials, Announcements =====
import { Module, Material, Announcement } from '@/types';

export const mockModules: Module[] = [
          {
                    id: 'm1', courseId: 'c1', title: 'Introducción a Python', description: 'Configuración del entorno e introducción al lenguaje.', order: 1,
                    units: [
                              { id: 'u1-1', moduleId: 'm1', title: 'Instalación de Python y herramientas', type: 'lesson', duration: '30 min', isCompleted: true },
                              { id: 'u1-2', moduleId: 'm1', title: 'Tu primer programa', type: 'lesson', duration: '45 min', isCompleted: true },
                              { id: 'u1-3', moduleId: 'm1', title: 'Quiz: Conceptos básicos', type: 'quiz', duration: '15 min', isCompleted: true },
                    ],
          },
          {
                    id: 'm2', courseId: 'c1', title: 'Variables y Tipos de Datos', description: 'Números, strings, listas, diccionarios y más.', order: 2,
                    units: [
                              { id: 'u2-1', moduleId: 'm2', title: 'Tipos numéricos y strings', type: 'lesson', duration: '40 min', isCompleted: true },
                              { id: 'u2-2', moduleId: 'm2', title: 'Listas y tuplas', type: 'lesson', duration: '50 min', isCompleted: false },
                              { id: 'u2-3', moduleId: 'm2', title: 'Diccionarios y sets', type: 'lesson', duration: '45 min', isCompleted: false },
                              { id: 'u2-4', moduleId: 'm2', title: 'Actividad: Manipulación de datos', type: 'activity', duration: '60 min', isCompleted: false },
                    ],
          },
          {
                    id: 'm3', courseId: 'c1', title: 'Estructuras de Control', description: 'Condicionales, bucles y control de flujo.', order: 3,
                    units: [
                              { id: 'u3-1', moduleId: 'm3', title: 'If, elif, else', type: 'lesson', duration: '35 min', isCompleted: false },
                              { id: 'u3-2', moduleId: 'm3', title: 'Bucles for y while', type: 'lesson', duration: '40 min', isCompleted: false },
                              { id: 'u3-3', moduleId: 'm3', title: 'Quiz: Control de flujo', type: 'quiz', duration: '20 min', isCompleted: false },
                    ],
          },
          {
                    id: 'm4', courseId: 'c1', title: 'Funciones y Módulos', description: 'Definición de funciones, parámetros, retorno y módulos.', order: 4,
                    units: [
                              { id: 'u4-1', moduleId: 'm4', title: 'Definir funciones', type: 'lesson', duration: '45 min', isCompleted: false },
                              { id: 'u4-2', moduleId: 'm4', title: 'Parámetros y retorno', type: 'lesson', duration: '40 min', isCompleted: false },
                              { id: 'u4-3', moduleId: 'm4', title: 'Importar módulos', type: 'lesson', duration: '30 min', isCompleted: false },
                    ],
          },
          // Course c2 modules
          {
                    id: 'm5', courseId: 'c2', title: 'Fundamentos de IA', description: 'Historia, tipos de IA y aplicaciones.', order: 1,
                    units: [
                              { id: 'u5-1', moduleId: 'm5', title: 'Historia de la IA', type: 'lesson', duration: '50 min', isCompleted: true },
                              { id: 'u5-2', moduleId: 'm5', title: 'Tipos de aprendizaje automático', type: 'lesson', duration: '60 min', isCompleted: true },
                    ],
          },
          {
                    id: 'm6', courseId: 'c2', title: 'Machine Learning Supervisado', description: 'Regresión, clasificación y evaluación.', order: 2,
                    units: [
                              { id: 'u6-1', moduleId: 'm6', title: 'Regresión lineal y logística', type: 'lesson', duration: '55 min', isCompleted: false },
                              { id: 'u6-2', moduleId: 'm6', title: 'Árboles de decisión', type: 'lesson', duration: '50 min', isCompleted: false },
                              { id: 'u6-3', moduleId: 'm6', title: 'Actividad: Clasificador de imágenes', type: 'activity', duration: '90 min', isCompleted: false },
                    ],
          },
          // Course c4 modules
          {
                    id: 'm7', courseId: 'c4', title: 'Introducción a Next.js', description: 'Fundamentos de React y Next.js.', order: 1,
                    units: [
                              { id: 'u7-1', moduleId: 'm7', title: 'Setup y estructura', type: 'lesson', duration: '40 min', isCompleted: false },
                              { id: 'u7-2', moduleId: 'm7', title: 'Componentes y JSX', type: 'lesson', duration: '45 min', isCompleted: false },
                    ],
          },
];

export const mockMaterials: Material[] = [
          { id: 'mat1', courseId: 'c1', moduleId: 'm1', title: 'Guía de instalación de Python 3.12', type: 'pdf', url: '#', size: '2.4 MB', uploadedAt: '2025-12-15T10:00:00Z' },
          { id: 'mat2', courseId: 'c1', moduleId: 'm1', title: 'Video: Introducción a Python', type: 'video', url: '#', size: '150 MB', uploadedAt: '2025-12-15T10:00:00Z' },
          { id: 'mat3', courseId: 'c1', moduleId: 'm2', title: 'Cheat Sheet: Tipos de datos', type: 'pdf', url: '#', size: '800 KB', uploadedAt: '2025-12-20T08:00:00Z' },
          { id: 'mat4', courseId: 'c1', moduleId: 'm2', title: 'Documentación oficial de Python', type: 'link', url: 'https://docs.python.org', uploadedAt: '2025-12-20T08:00:00Z' },
          { id: 'mat5', courseId: 'c2', moduleId: 'm5', title: 'Slides: Historia de la IA', type: 'pdf', url: '#', size: '5.1 MB', uploadedAt: '2025-12-28T09:00:00Z' },
          { id: 'mat6', courseId: 'c2', moduleId: 'm5', title: 'Video: Panorama de la IA', type: 'video', url: '#', size: '320 MB', uploadedAt: '2026-01-02T10:00:00Z' },
          { id: 'mat7', courseId: 'c2', moduleId: 'm6', title: 'Notebook: Regresión lineal', type: 'document', url: '#', size: '1.2 MB', uploadedAt: '2026-01-10T08:00:00Z' },
];

export const mockAnnouncements: Announcement[] = [
          { id: 'a1', courseId: 'c1', title: 'Bienvenidos al curso', content: '¡Bienvenidos a Fundamentos de Programación con Python! Revisen el módulo 1 y completen la instalación antes de la próxima sesión.', createdAt: '2026-01-15T08:00:00Z', authorName: 'Dra. Elena Ríos' },
          { id: 'a2', courseId: 'c1', title: 'Cambio de horario sesión 3', content: 'La sesión del jueves se adelanta una hora. Nuevo horario: 9:00 AM.', createdAt: '2026-01-28T14:00:00Z', authorName: 'Dra. Elena Ríos' },
          { id: 'a3', courseId: 'c2', title: 'Proyecto final anunciado', content: 'El proyecto final consiste en un clasificador de imágenes. Detalles en el módulo 2.', createdAt: '2026-02-10T09:00:00Z', authorName: 'Prof. Marco Gutiérrez' },
];

export const getModulesByCourse = (courseId: string) => mockModules.filter(m => m.courseId === courseId);
export const getMaterialsByCourse = (courseId: string) => mockMaterials.filter(m => m.courseId === courseId);
export const getAnnouncementsByCourse = (courseId: string) => mockAnnouncements.filter(a => a.courseId === courseId);
