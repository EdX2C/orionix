'use client';
// ===== Orionix Professional SaaS Landing Page =====
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, BookOpen, Users, TrendingUp, ChevronRight, Star,
  GraduationCap, Shield, Zap, Award, Heart,
  ArrowRight, Monitor, Rocket
} from 'lucide-react';

const stats = [
  { value: '500+', label: 'Estudiantes activos' },
  { value: '50+', label: 'Cursos disponibles' },
  { value: '4.8', label: 'Rating promedio' },
  { value: '95%', label: 'Tasa de satisfacción' },
];

const features = [
  { icon: BookOpen, title: 'Cursos interactivos', description: 'Contenido multimedia con módulos progresivos, quizzes y actividades prácticas.', color: 'text-nebula-400', bgColor: 'bg-nebula-500/10 border-nebula-500/20' },
  { icon: TrendingUp, title: 'Progreso inteligente', description: 'Seguimiento en tiempo real de tu aprendizaje con métricas y análisis detallados.', color: 'text-astral-400', bgColor: 'bg-astral-500/10 border-astral-500/20' },
  { icon: Award, title: 'Sistema de badges', description: 'Gana insignias y reconocimientos conforme avanzas en tu aprendizaje.', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20' },
  { icon: Shield, title: 'Seguridad avanzada', description: 'Sesiones protegidas, roles de acceso y datos encriptados.', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
  { icon: Monitor, title: 'Multi-plataforma', description: 'Accede desde cualquier dispositivo con una experiencia fluida y adaptable.', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/20' },
  { icon: Users, title: 'Comunidad activa', description: 'Conecta con estudiantes y docentes en un entorno colaborativo.', color: 'text-pink-400', bgColor: 'bg-pink-500/10 border-pink-500/20' },
];

const testimonials = [
  { name: 'María González', role: 'Estudiante de Ing. Software', text: 'Orionix cambió completamente la forma en que organizo y administro mi aprendizaje. La interfaz es intuitiva y elegante.', avatar: 'MG', rating: 5 },
  { name: 'Dr. Carlos Ruiz', role: 'Docente de IA', text: 'Como profesor, la plataforma me permite crear cursos profesionales y dar seguimiento a mis estudiantes de manera eficiente.', avatar: 'CR', rating: 5 },
  { name: 'Ana Martínez', role: 'Estudiante de Diseño', text: 'Los badges y el progreso visual me motivan a seguir aprendiendo. Es la mejor plataforma educativa que he usado.', avatar: 'AM', rating: 5 },
];

const steps = [
  { step: '01', title: 'Crea tu cuenta', description: 'Regístrate en segundos como estudiante, docente o administrador.', icon: Rocket },
  { step: '02', title: 'Explora el catálogo', description: 'Descubre cursos diseñados por expertos en tecnología y diseño.', icon: BookOpen },
  { step: '03', title: 'Aprende a tu ritmo', description: 'Avanza por módulos, completa quizzes y obtén badges.', icon: Award },
];

export default function LandingPage() {
  const [animatedStats, setAnimatedStats] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedStats(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen starfield text-text-primary">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-orion-950/70 border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nebula-500 to-astral-500 flex items-center justify-center shadow-lg shadow-nebula-500/25 group-hover:shadow-nebula-500/40 transition-shadow">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">Orionix</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            <Link href="/courses" className="hover:text-text-primary transition-colors">Catálogo</Link>
            <a href="#features" className="hover:text-text-primary transition-colors">Características</a>
            <a href="#testimonials" className="hover:text-text-primary transition-colors">Testimonios</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2">Iniciar sesión</Link>
            <Link href="/auth/register" className="btn-primary text-sm flex items-center gap-1.5">
              Comenzar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-36">
        {/* Aurora orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="aurora-orb aurora-orb-1" style={{ top: '-10%', left: '10%' }} />
          <div className="aurora-orb aurora-orb-2" style={{ top: '20%', right: '5%' }} />
          <div className="aurora-orb aurora-orb-3" style={{ bottom: '10%', left: '40%' }} />
        </div>

        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-premium mb-10 floating-badge">
            <Rocket className="w-4 h-4 text-nebula-400" />
            <span className="text-xs font-semibold text-nebula-300">Plataforma Educativa de Nueva Generación</span>
          </div>

          {/* Heading with shimmer */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.08] mb-7">
            Aprende sin límites con{' '}
            <span className="text-shimmer">Orionix</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 animate-fade-in leading-relaxed" style={{ animationDelay: '0.1s' }}>
            La plataforma SaaS educativa que transforma la manera de enseñar y aprender.
            Cursos interactivos, seguimiento inteligente y una experiencia que inspira.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link href="/auth/register" className="btn-primary text-base px-10 py-4 flex items-center gap-2.5 shadow-2xl shadow-nebula-500/25 hover:shadow-nebula-500/40 transition-shadow">
              <GraduationCap className="w-5 h-5" /> Empezar gratis
            </Link>
            <Link href="/courses" className="btn-secondary text-base px-10 py-4 flex items-center gap-2.5">
              <BookOpen className="w-5 h-5" /> Explorar cursos
            </Link>
          </div>

          {/* Stats with glowing separators */}
          <div className="flex flex-wrap items-center justify-center gap-0 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <React.Fragment key={i}>
                <div
                  className={`flex-1 min-w-[130px] glass-premium py-6 px-4 text-center transition-all duration-700 ${animatedStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${i === 0 ? 'rounded-l-2xl' : ''} ${i === stats.length - 1 ? 'rounded-r-2xl' : ''}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <p className="text-2xl md:text-3xl font-display font-bold text-shimmer">{s.value}</p>
                  <p className="text-xs text-text-muted mt-1.5">{s.label}</p>
                </div>
                {i < stats.length - 1 && <div className="glow-separator hidden md:block" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
              <Zap className="w-3.5 h-3.5 text-astral-400" />
              <span className="text-xs font-semibold text-astral-300">Características</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              Todo lo que necesitas para <span className="text-shimmer">brillar</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-lg">
              Herramientas profesionales diseñadas para potenciar el aprendizaje, la enseñanza y la gestión educativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card-glow p-7 group stagger-item">
                <div className={`w-14 h-14 rounded-2xl ${f.bgColor} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`w-7 h-7 ${f.color}`} />
                </div>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-28 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              Cómo <span className="text-shimmer">funciona</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-lg">
              En tres simples pasos estarás listo para transformar tu aprendizaje.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center group stagger-item">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-nebula-500/20 to-astral-500/10 border border-border-default flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-nebula-500/20 transition-all duration-300">
                  <s.icon className="w-8 h-8 text-nebula-400" />
                </div>
                <div className="text-xs font-display font-bold text-text-muted mb-2 tracking-widest">PASO {s.step}</div>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{s.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%_-_12px)] w-6">
                    <ChevronRight className="w-5 h-5 text-nebula-500/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-28 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
              <Heart className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300">Testimonios</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              Lo que dicen nuestros <span className="text-shimmer">usuarios</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="quote-card stagger-item">
                <div className="flex items-center gap-1 mb-5 pt-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-nebula-500/30 to-astral-500/20 border border-border-default flex items-center justify-center text-xs font-bold text-nebula-400 glow-ring">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        {/* CTA aurora */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="aurora-orb aurora-orb-2" style={{ bottom: '-20%', left: '20%' }} />
          <div className="aurora-orb aurora-orb-1" style={{ top: '-15%', right: '15%' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="glass-premium p-12 md:p-16 border border-nebula-500/20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              Comienza tu viaje con <span className="text-shimmer">Orionix</span>
            </h2>
            <p className="text-text-secondary mb-10 max-w-md mx-auto text-lg">
              Únete a la plataforma educativa que está transformando la forma de aprender en la era digital.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="btn-primary text-base px-10 py-4 flex items-center gap-2.5 shadow-2xl shadow-nebula-500/25 hover:shadow-nebula-500/40 transition-shadow">
                Crear cuenta gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/courses" className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 group">
                Ver catálogo <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border-subtle py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-nebula-500 to-astral-500 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-display font-bold text-text-primary">Orionix</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">Plataforma educativa SaaS de nueva generación para estudiantes, docentes y administradores.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">Producto</h4>
              <div className="space-y-2">
                <Link href="/courses" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Catálogo</Link>
                <a href="#features" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Características</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Precios</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">Soporte</h4>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Centro de ayuda</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Contacto</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">FAQ</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Privacidad</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Términos</a>
                <a href="#" className="block text-xs text-text-muted hover:text-text-primary transition-colors">Cookies</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <p>&copy; {new Date().getFullYear()} Orionix. Creado por Rosellen Cordero.</p>
            <p className="flex items-center gap-1">Hecho con <Heart className="w-3 h-3 text-red-400 fill-red-400" /> para la educación</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
