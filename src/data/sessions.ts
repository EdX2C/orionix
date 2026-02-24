// ===== Orionix Mock Data: Sessions =====
import { Session } from '@/types';

export const mockSessions: Session[] = [
          {
                    id: 'sess-001', userId: 'u4', userName: 'Ana Lucía Torres', userRole: 'student',
                    device: 'Windows 11 — Chrome 120', browser: 'Chrome', ip: '192.168.1.45', location: 'Bogotá, Colombia',
                    createdAt: '2026-02-22T08:00:00Z', lastActive: '2026-02-22T13:10:00Z', status: 'active',
          },
          {
                    id: 'sess-002', userId: 'u4', userName: 'Ana Lucía Torres', userRole: 'student',
                    device: 'iPhone 15 — Safari 17', browser: 'Safari', ip: '10.0.0.22', location: 'Bogotá, Colombia',
                    createdAt: '2026-02-21T19:00:00Z', lastActive: '2026-02-21T22:30:00Z', status: 'active',
          },
          {
                    id: 'sess-003', userId: 'u5', userName: 'Daniel Herrera', userRole: 'student',
                    device: 'macOS Sonoma — Firefox 122', browser: 'Firefox', ip: '172.16.0.88', location: 'Medellín, Colombia',
                    createdAt: '2026-02-22T07:00:00Z', lastActive: '2026-02-22T12:45:00Z', status: 'active',
          },
          {
                    id: 'sess-004', userId: 'u2', userName: 'Dra. Elena Ríos', userRole: 'teacher',
                    device: 'macOS Ventura — Chrome 120', browser: 'Chrome', ip: '192.168.2.10', location: 'México D.F., México',
                    createdAt: '2026-02-22T06:30:00Z', lastActive: '2026-02-22T13:00:00Z', status: 'active',
          },
          {
                    id: 'sess-005', userId: 'u3', userName: 'Prof. Marco Gutiérrez', userRole: 'teacher',
                    device: 'Windows 10 — Edge 120', browser: 'Edge', ip: '10.10.0.5', location: 'Lima, Perú',
                    createdAt: '2026-02-22T09:00:00Z', lastActive: '2026-02-22T11:30:00Z', status: 'active',
          },
          {
                    id: 'sess-006', userId: 'u6', userName: 'Sofía Morales', userRole: 'student',
                    device: 'Android 14 — Chrome 120', browser: 'Chrome', ip: '192.168.3.77', location: 'Santiago, Chile',
                    createdAt: '2026-02-22T10:00:00Z', lastActive: '2026-02-22T12:00:00Z', status: 'active',
          },
          {
                    id: 'sess-007', userId: 'u1', userName: 'Carlos Mendoza', userRole: 'admin',
                    device: 'Windows 11 — Chrome 120', browser: 'Chrome', ip: '10.0.1.1', location: 'Bogotá, Colombia',
                    createdAt: '2026-02-22T07:30:00Z', lastActive: '2026-02-22T13:15:00Z', status: 'active',
          },
          {
                    id: 'sess-008', userId: 'u7', userName: 'Andrés Vega', userRole: 'student',
                    device: 'Linux Ubuntu — Firefox 122', browser: 'Firefox', ip: '172.20.0.33', location: 'Quito, Ecuador',
                    createdAt: '2026-02-20T14:00:00Z', lastActive: '2026-02-20T18:00:00Z', status: 'expired',
          },
];
