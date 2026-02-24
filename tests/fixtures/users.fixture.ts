/**
 * Shared test fixture data — mirrors src/data/users.ts
 * Used by both E2E and unit tests.
 */
export const testUsers = {
          admin: {
                    id: 'u1',
                    email: 'admin@orionix.edu',
                    name: 'Carlos Mendoza',
                    role: 'admin' as const,
          },
          teacher: {
                    id: 'u2',
                    email: 'elena@orionix.edu',
                    name: 'Dra. Elena Ríos',
                    role: 'teacher' as const,
          },
          student: {
                    id: 'u4',
                    email: 'ana@estudiante.edu',
                    name: 'Ana Lucía Torres',
                    role: 'student' as const,
          },
};

export const localStorageKeys = {
          user: 'orionix_user',
          sessionId: 'orionix_session_id',
          theme: 'orionix_theme',
};
