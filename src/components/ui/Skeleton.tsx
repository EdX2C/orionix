'use client';
import React from 'react';

interface SkeletonProps {
          className?: string;
          count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
          return (
                    <>
                              {Array.from({ length: count }).map((_, i) => (
                                        <div key={i} className={`skeleton ${className}`} />
                              ))}
                    </>
          );
}

export function CardSkeleton() {
          return (
                    <div className="orionix-card p-6 space-y-4" style={{ pointerEvents: 'none' }}>
                              <Skeleton className="h-40 w-full" />
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-2/3" />
                              <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="h-6 w-20 rounded-full" />
                              </div>
                    </div>
          );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
          return (
                    <div className="space-y-3">
                              {Array.from({ length: rows }).map((_, r) => (
                                        <div key={r} className="flex gap-4">
                                                  {Array.from({ length: cols }).map((_, c) => (
                                                            <Skeleton key={c} className="h-10 flex-1" />
                                                  ))}
                                        </div>
                              ))}
                    </div>
          );
}

export function DashboardSkeleton() {
          return (
                    <div className="space-y-8 animate-fade-in">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                                  <div key={i} className="stat-card space-y-3">
                                                            <Skeleton className="h-4 w-20" />
                                                            <Skeleton className="h-8 w-16" />
                                                            <Skeleton className="h-3 w-28" />
                                                  </div>
                                        ))}
                              </div>
                              <Skeleton className="h-6 w-48" />
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                                  <CardSkeleton key={i} />
                                        ))}
                              </div>
                    </div>
          );
}
