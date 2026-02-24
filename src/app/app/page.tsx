'use client';
// ===== App Root: redirect to role dashboard =====
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AppPage() {
          const { user } = useAuth();
          const router = useRouter();
          useEffect(() => {
                    if (user) router.replace(`/app/${user.role}/dashboard`);
                    else router.replace('/auth/login');
          }, [user, router]);
          return null;
}
