// ===== Orionix Mock Data: Users =====
import { User } from '@/types';

export const mockUsers: User[] = [
          {
                    id: 'u1',
                    name: 'Carlos Mendoza',
                    email: 'admin@orionix.edu',
                    role: 'admin',
                    avatar: '',
                    bio: 'Administrador de la plataforma Orionix.',
                    createdAt: '2025-01-15T08:00:00Z',
                    isApproved: true,
                    isActive: true,
          },
          {
                    id: 'u2',
                    name: 'Dra. Elena Ríos',
                    email: 'elena@orionix.edu',
                    role: 'teacher',
                    avatar: '',
                    bio: 'Doctora en Ciencias de la Computación con 15 años de experiencia docente.',
                    createdAt: '2025-02-10T10:00:00Z',
                    isApproved: true,
                    isActive: true,
          },
          {
                    id: 'u3',
                    name: 'Prof. Marco Gutiérrez',
                    email: 'marco@orionix.edu',
                    role: 'teacher',
                    avatar: '',
                    bio: 'Especialista en Inteligencia Artificial y Machine Learning.',
                    createdAt: '2025-03-05T09:00:00Z',
                    isApproved: true,
                    isActive: true,
          },
          {
                    id: 'u4',
                    name: 'Ana Lucía Torres',
                    email: 'ana@estudiante.edu',
                    role: 'student',
                    avatar: '',
                    bio: 'Estudiante de Ingeniería de Software.',
                    createdAt: '2025-06-01T14:00:00Z',
                    isActive: true,
          },
          {
                    id: 'u5',
                    name: 'Daniel Herrera',
                    email: 'daniel@estudiante.edu',
                    role: 'student',
                    avatar: '',
                    bio: 'Apasionado por el desarrollo web y la tecnología.',
                    createdAt: '2025-06-15T11:00:00Z',
                    isActive: true,
          },
          {
                    id: 'u6',
                    name: 'Sofía Vargas',
                    email: 'sofia@estudiante.edu',
                    role: 'student',
                    avatar: '',
                    bio: 'Estudiante de Ciencia de Datos.',
                    createdAt: '2025-07-01T09:00:00Z',
                    isActive: true,
          },
          {
                    id: 'u7',
                    name: 'Prof. Laura Castillo',
                    email: 'laura@orionix.edu',
                    role: 'teacher',
                    avatar: '',
                    bio: 'Diseñadora UX/UI con experiencia en educación digital.',
                    createdAt: '2025-08-01T08:00:00Z',
                    isApproved: false,
                    isActive: false,
          },
];

export const getUser = (id: string) => mockUsers.find(u => u.id === id);
export const getUsersByRole = (role: string) => mockUsers.filter(u => u.role === role);

