'use client';
// ===== <LogoOrionix /> — Replace with real logo asset =====
// To integrate your real logo:
// 1. Place your logo file in /public/logo.svg (or .png)
// 2. Replace the SVG below with <Image src="/logo.svg" ... />
import React from 'react';

interface LogoProps {
          size?: 'sm' | 'md' | 'lg';
          showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
          const sizes = { sm: 28, md: 36, lg: 48 };
          const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' };
          const s = sizes[size];

          return (
                    <div className="flex items-center gap-2.5">
                              {/* Placeholder logo mark — replace with real SVG/Image */}
                              <div className="relative" style={{ width: s, height: s }}>
                                        <svg viewBox="0 0 40 40" fill="none" width={s} height={s}>
                                                  {/* Outer ring */}
                                                  <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.6" />
                                                  {/* Star shape */}
                                                  <path
                                                            d="M20 6L23.5 15.5L33 17L26 24L27.5 34L20 29L12.5 34L14 24L7 17L16.5 15.5L20 6Z"
                                                            fill="url(#logoGrad)"
                                                            opacity="0.9"
                                                  />
                                                  {/* Inner dot */}
                                                  <circle cx="20" cy="20" r="3" fill="#00cec9" />
                                                  <defs>
                                                            <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                                                                      <stop offset="0%" stopColor="#6c5ce7" />
                                                                      <stop offset="100%" stopColor="#00cec9" />
                                                            </linearGradient>
                                                  </defs>
                                        </svg>
                              </div>
                              {showText && (
                                        <span className={`font-display font-bold tracking-tight ${textSizes[size]}`}>
                                                  <span className="text-gradient">Orionix</span>
                                        </span>
                              )}
                    </div>
          );
}
