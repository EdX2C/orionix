'use client';
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function LoadingBar() {
          const pathname = usePathname();
          const [loading, setLoading] = useState(false);
          const [progress, setProgress] = useState(0);

          useEffect(() => {
                    setLoading(true);
                    setProgress(30);
                    const t1 = setTimeout(() => setProgress(70), 100);
                    const t2 = setTimeout(() => setProgress(100), 250);
                    const t3 = setTimeout(() => { setLoading(false); setProgress(0); }, 400);
                    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
          }, [pathname]);

          if (!loading) return null;

          return (
                    <div className="fixed top-0 left-0 right-0 z-[100] h-[2.5px]">
                              <div
                                        className="h-full bg-gradient-to-r from-nebula-500 via-astral-400 to-nebula-500 rounded-r-full transition-all duration-200 ease-out"
                                        style={{ width: `${progress}%` }}
                              />
                    </div>
          );
}
