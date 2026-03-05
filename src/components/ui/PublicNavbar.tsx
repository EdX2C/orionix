'use client';
// ===== Public Navbar — Reusable for all public pages =====
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/context/LocaleContext';
import { Sparkles, ArrowRight, Menu, X, Globe } from 'lucide-react';

export default function PublicNavbar() {
          const pathname = usePathname();
          const [mobileOpen, setMobileOpen] = useState(false);
          const t = useTranslations('nav');
          const { locale, toggleLocale } = useLocale();

          const navLinks = [
                    { href: '/courses', label: t('catalog') },
                    { href: '/#planes', label: t('plans') },
                    { href: '/#nosotros', label: t('about') },
                    { href: '/#contacto', label: t('contact') },
                    { href: '/faq', label: t('faq') },
          ];

          return (
                    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-orion-950/70 border-b border-border-subtle">
                              <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                                        {/* Logo */}
                                        <Link href="/" className="flex items-center gap-2.5 group">
                                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nebula-500 to-astral-500 flex items-center justify-center shadow-lg shadow-nebula-500/25 group-hover:shadow-nebula-500/40 transition-shadow">
                                                            <Sparkles className="w-4.5 h-4.5 text-white" />
                                                  </div>
                                                  <span className="font-display font-bold text-lg text-text-primary">Orionix</span>
                                        </Link>

                                        {/* Desktop links */}
                                        <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
                                                  {navLinks.map(link => (
                                                            <Link
                                                                      key={link.href}
                                                                      href={link.href}
                                                                      className={`hover:text-text-primary transition-colors ${pathname === link.href ? 'text-text-primary font-semibold' : ''}`}
                                                            >
                                                                      {link.label}
                                                            </Link>
                                                  ))}
                                        </div>

                                        {/* Auth buttons + Language toggle */}
                                        <div className="flex items-center gap-2">
                                                  {/* Language toggle */}
                                                  <button
                                                            onClick={toggleLocale}
                                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-glass border border-border-subtle transition-all"
                                                            title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                                                  >
                                                            <Globe className="w-3.5 h-3.5" />
                                                            <span>{locale === 'es' ? 'EN' : 'ES'}</span>
                                                  </button>

                                                  <Link href="/auth/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2 hidden sm:inline-block">
                                                            {t('login')}
                                                  </Link>
                                                  <Link href="/auth/register" className="btn-primary text-sm flex items-center gap-1.5">
                                                            {t('start')} <ArrowRight className="w-3.5 h-3.5" />
                                                  </Link>

                                                  {/* Mobile menu button */}
                                                  <button
                                                            onClick={() => setMobileOpen(!mobileOpen)}
                                                            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-glass transition-all"
                                                            aria-label="Menu"
                                                  >
                                                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                                  </button>
                                        </div>
                              </div>

                              {/* Mobile dropdown */}
                              {mobileOpen && (
                                        <div className="md:hidden border-t border-border-subtle bg-orion-950/95 backdrop-blur-xl animate-slide-up">
                                                  <div className="max-w-6xl mx-auto px-6 py-4 space-y-1">
                                                            {navLinks.map(link => (
                                                                      <Link
                                                                                key={link.href}
                                                                                href={link.href}
                                                                                onClick={() => setMobileOpen(false)}
                                                                                className={`block px-4 py-2.5 rounded-xl text-sm transition-colors ${pathname === link.href ? 'text-text-primary bg-surface-glass font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-glass'}`}
                                                                      >
                                                                                {link.label}
                                                                      </Link>
                                                            ))}
                                                            <Link
                                                                      href="/auth/login"
                                                                      onClick={() => setMobileOpen(false)}
                                                                      className="block px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-glass"
                                                            >
                                                                      {t('login')}
                                                            </Link>
                                                  </div>
                                        </div>
                              )}
                    </nav>
          );
}
