'use client';
// ===== Orionix Professional SaaS Landing Page =====
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/context/LocaleContext';
import { courseService } from '@/services';
import { Course } from '@/types';
import {
  Sparkles, BookOpen, Users, TrendingUp, ChevronRight, Star,
  GraduationCap, Shield, Zap, Award, Heart,
  ArrowRight, Monitor, Rocket, CheckCircle2, Mail, Phone,
  MapPin, Send, Calendar, UserCheck, Video, Clock,
  Globe as GlobeIcon, Target, Briefcase, MessageSquare, Globe
} from 'lucide-react';

const stats = [
  { value: '10,000+', labelKey: 'students' },
  { value: '120+', labelKey: 'courses' },
  { value: '4.8', labelKey: 'rating' },
  { value: '95%', labelKey: 'satisfaction' },
];

const features = [
  { icon: BookOpen, title: 'Cursos interactivos', description: 'Contenido multimedia con módulos progresivos, quizzes y actividades prácticas.', color: 'text-nebula-400', bgColor: 'bg-nebula-500/10 border-nebula-500/20' },
  { icon: TrendingUp, title: 'Progreso inteligente', description: 'Seguimiento en tiempo real de tu aprendizaje con métricas y análisis detallados.', color: 'text-astral-400', bgColor: 'bg-astral-500/10 border-astral-500/20' },
  { icon: Award, title: 'Certificados verificables', description: 'Recibe certificados al completar cursos que validan tus habilidades.', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20' },
  { icon: Shield, title: 'Seguridad avanzada', description: 'Sesiones protegidas, roles de acceso y datos encriptados.', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
  { icon: Monitor, title: 'Multi-plataforma', description: 'Accede desde cualquier dispositivo con una experiencia fluida y adaptable.', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/20' },
  { icon: Users, title: 'Comunidad activa', description: 'Conecta con estudiantes y docentes en un entorno colaborativo.', color: 'text-pink-400', bgColor: 'bg-pink-500/10 border-pink-500/20' },
];

const testimonials = [
  { name: 'María González', role: 'Estudiante de Ing. Software', text: 'Orionix cambió completamente la forma en que organizo y administro mi aprendizaje. La interfaz es intuitiva y elegante.', avatar: 'MG', rating: 5 },
  { name: 'Dr. Carlos Ruiz', role: 'Docente de IA', text: 'Como profesor, la plataforma me permite crear cursos profesionales y dar seguimiento a mis estudiantes de manera eficiente.', avatar: 'CR', rating: 5 },
  { name: 'Ana Martínez', role: 'Estudiante de Diseño', text: 'Los badges y el progreso visual me motivan a seguir aprendiendo. Es la mejor plataforma educativa que he usado.', avatar: 'AM', rating: 5 },
];

const howItWorks = [
  { step: '01', title: 'Explora el catálogo', description: 'Navega por cientos de cursos organizados por categoría, nivel y duración. Sin registro necesario.', icon: BookOpen },
  { step: '02', title: 'Elige tu curso', description: 'Lee la descripción, revisa el contenido y conoce al instructor antes de inscribirte.', icon: Target },
  { step: '03', title: 'Inscríbete', description: 'Crea tu cuenta gratuita y selecciona el plan que mejor se adapte a ti.', icon: UserCheck },
  { step: '04', title: 'Aprende a tu ritmo', description: 'Accede a módulos guiados, videos, quizzes y actividades prácticas. Cursos grabados, disponibles 24/7.', icon: Video },
  { step: '05', title: 'Recibe tu certificado', description: 'Al completar un curso obtendrás un certificado de Orion que valida tus habilidades.', icon: Award },
];

const plans = [
  {
    name: 'Básico',
    price: 'Gratis',
    period: '',
    description: 'Perfecto para explorar y comenzar tu aprendizaje.',
    features: ['Acceso a 5 cursos gratuitos', 'Módulos de introducción', 'Foros de comunidad', 'Progreso básico'],
    cta: 'Comenzar gratis',
    popular: false,
    accent: 'border-border-default',
  },
  {
    name: 'Intermedio',
    price: '$19',
    period: '/mes',
    description: 'Para estudiantes comprometidos que quieren más.',
    features: ['Acceso a 50+ cursos', 'Certificados verificables', 'Soporte prioritario', 'Proyectos prácticos', 'Acceso a grabaciones'],
    cta: 'Elegir plan',
    popular: true,
    accent: 'border-nebula-500',
  },
  {
    name: 'Avanzado',
    price: '$39',
    period: '/mes',
    description: 'Acceso completo para profesionales y equipos.',
    features: ['Acceso ilimitado a cursos', 'Certificados premium', 'Soporte 1-a-1', 'Mentoría personalizada', 'Acceso anticipado a nuevos cursos', 'Rutas de aprendizaje guiadas'],
    cta: 'Elegir plan',
    popular: false,
    accent: 'border-astral-500',
  },
];

const teachSteps = [
  { step: 1, title: 'Solicitud', description: 'Completa el formulario de aplicación con tu experiencia y área de expertise.', icon: Send },
  { step: 2, title: 'Selección de fecha', description: 'Elige una fecha para tu reunión de evaluación, presencial o virtual.', icon: Calendar },
  { step: 3, title: 'Reunión', description: 'Participa en una entrevista donde conoceremos tu estilo de enseñanza.', icon: MessageSquare },
  { step: 4, title: 'Aprobación', description: 'Si cumples los requisitos, recibirás acceso como docente para crear cursos.', icon: CheckCircle2 },
];

const levelLabels: Record<string, string> = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' };

export default function LandingPage() {
  const [animatedStats, setAnimatedStats] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  // Translations
  const tNav = useTranslations('nav');
  const tHero = useTranslations('hero');
  const tHow = useTranslations('howItWorks');
  const tFeatured = useTranslations('featuredCourses');
  const tCert = useTranslations('certificates');
  const tFeat = useTranslations('features');
  const tPrice = useTranslations('pricing');
  const tTesti = useTranslations('testimonials');
  const tTeach = useTranslations('teach');
  const tAbout = useTranslations('about');
  const tContact = useTranslations('contactSection');
  const tCta = useTranslations('cta');
  const tFooter = useTranslations('footer');
  const { locale, toggleLocale } = useLocale();

  useEffect(() => {
    const t = setTimeout(() => setAnimatedStats(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    courseService.list().then(c => {
      setFeaturedCourses(c.filter(x => x.status === 'published').slice(0, 3));
    });
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => setContactSent(false), 4000);
    setContactForm({ name: '', email: '', message: '' });
  };

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
            <Link href="/courses" className="hover:text-text-primary transition-colors">{tNav('catalog')}</Link>
            <a href="#planes" className="hover:text-text-primary transition-colors">{tNav('plans')}</a>
            <a href="#nosotros" className="hover:text-text-primary transition-colors">{tNav('about')}</a>
            <a href="#contacto" className="hover:text-text-primary transition-colors">{tNav('contact')}</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleLocale} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-glass border border-border-subtle transition-all" title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}>
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === 'es' ? 'EN' : 'ES'}</span>
            </button>
            <Link href="/auth/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2">{tNav('login')}</Link>
            <Link href="/auth/register" className="btn-primary text-sm flex items-center gap-1.5">
              {tNav('start')} <ArrowRight className="w-3.5 h-3.5" />
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
            <span className="text-xs font-semibold text-nebula-300">{tHero('badge')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.08] mb-7">
            {tHero('title_1')}{' '}
            <span className="text-shimmer">{tHero('title_2')}</span>{' '}
            {tHero('title_3')}
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-6 animate-fade-in leading-relaxed" style={{ animationDelay: '0.1s' }}>
            {tHero('subtitle')}
          </p>

          <p className="text-sm text-text-muted max-w-lg mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            {tHero('features')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link href="/auth/register" className="btn-primary text-base px-10 py-4 flex items-center gap-2.5 shadow-2xl shadow-nebula-500/25 hover:shadow-nebula-500/40 transition-shadow">
              <GraduationCap className="w-5 h-5" /> {tHero('cta_register')}
            </Link>
            <Link href="/courses" className="btn-secondary text-base px-10 py-4 flex items-center gap-2.5">
              <BookOpen className="w-5 h-5" /> {tHero('cta_catalog')}
            </Link>
            <a href="#cursos" className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 group px-4 py-4">
              {tHero('cta_courses')} <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
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
                  <p className="text-xs text-text-muted mt-1.5">{tHero(s.labelKey)}</p>
                </div>
                {i < stats.length - 1 && <div className="glow-separator hidden md:block" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works (expanded) ── */}
      <section id="como-funciona" className="py-28 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
              <Zap className="w-3.5 h-3.5 text-astral-400" />
              <span className="text-xs font-semibold text-astral-300">{tHow('badge')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              {tHow('title_1')} <span className="text-shimmer">{tHow('title_2')}</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-lg">
              {tHow('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {howItWorks.map((s, i) => (
              <div key={i} className="relative text-center group stagger-item">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nebula-500/20 to-astral-500/10 border border-border-default flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-nebula-500/20 transition-all duration-300">
                  <s.icon className="w-7 h-7 text-nebula-400" />
                </div>
                <div className="text-xs font-display font-bold text-text-muted mb-2 tracking-widest">{tHow('step_prefix')} {s.step}</div>
                <h3 className="font-display font-semibold text-sm text-text-primary mb-2">{tHow(`step${i + 1}_title`)}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{tHow(`step${i + 1}_desc`)}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%_-_8px)] w-4">
                    <ChevronRight className="w-4 h-4 text-nebula-500/40" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass-premium text-sm">
              <Video className="w-4 h-4 text-astral-400" />
              <span className="text-text-secondary">{tHow('note_plain')} <strong className="text-text-primary">{tHow('note_bold')}</strong> {tHow('note_suffix')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Courses (public preview) ── */}
      <section id="cursos" className="py-28 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
              <BookOpen className="w-3.5 h-3.5 text-nebula-400" />
              <span className="text-xs font-semibold text-nebula-300">{tFeatured('badge')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              {tFeatured('title_1')} <span className="text-shimmer">{tFeatured('title_2')}</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-lg">
              {tFeatured('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map(c => (
              <Link key={c.id} href={`/courses/${c.id}`} className="orionix-card overflow-hidden group">
                <div className="h-44 relative overflow-hidden">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-nebula-500/20 to-astral-500/10 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-nebula-400/40" strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-orion-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="badge badge-purple text-[10px]">{levelLabels[c.level] || c.level}</span>
                    <span className="badge badge-slate text-[10px]">{c.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-text-primary mb-1 line-clamp-2 group-hover:text-nebula-400 transition-colors">{c.title}</h3>
                  <p className="text-xs text-text-muted mb-4 line-clamp-2">{c.shortDescription}</p>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {c.teacherName}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.enrolled}</span>
                      {c.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {c.rating}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/courses" className="btn-secondary inline-flex items-center gap-2 px-8 py-3">
              {tFeatured('viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Certificados ── */}
      <section id="certificados" className="py-28 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-amber-300">{tCert('badge')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
                {tCert('title_1')} <span className="text-shimmer">{tCert('title_2')}</span>
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                {tCert('subtitle')}
              </p>
              <ul className="space-y-3">
                {[tCert('feature1'), tCert('feature2'), tCert('feature3'), tCert('feature4')].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Certificate mockup */}
            <div className="relative">
              <div className="certificate-card p-8 md:p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-nebula-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-amber-400" />
                </div>
                <p className="text-xs text-text-muted uppercase tracking-widest mb-2">{tCert('certTitle')}</p>
                <h3 className="font-display font-bold text-xl text-text-primary mb-1">{tCert('certCourse')}</h3>
                <p className="text-sm text-text-muted mb-6">{tCert('certAwarded')}</p>
                <div className="h-px bg-gradient-to-r from-transparent via-border-default to-transparent mb-6" />
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>Marzo 2026</span>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-nebula-400" />
                    <span className="font-semibold text-nebula-400">Orionix</span>
                  </div>
                  <span>{tCert('certHours')}</span>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/5 to-nebula-500/5 rounded-3xl -z-10 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
              <Zap className="w-3.5 h-3.5 text-astral-400" />
              <span className="text-xs font-semibold text-astral-300">{tFeat('badge')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              {tFeat('title_1')} <span className="text-shimmer">{tFeat('title_2')}</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-lg">
              {tFeat('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card-glow p-7 group stagger-item">
                <div className={`w-14 h-14 rounded-2xl ${f.bgColor} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`w-7 h-7 ${f.color}`} />
                </div>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-2">{tFeat(`f${i + 1}_title`)}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{tFeat(`f${i + 1}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planes (Pricing) ── */}
      <section id="planes" className="py-28 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
              <Sparkles className="w-3.5 h-3.5 text-nebula-400" />
              <span className="text-xs font-semibold text-nebula-300">{tPrice('badge')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              {tPrice('title_1')} <span className="text-shimmer">{tPrice('title_2')}</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-lg">
              {tPrice('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`pricing-card relative glass-premium p-8 ${plan.accent} ${plan.popular ? 'pricing-card-popular' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-nebula-500 to-astral-500 text-xs font-bold text-white shadow-lg shadow-nebula-500/30">
                    {tPrice('popular')}
                  </div>
                )}
                <h3 className="font-display font-bold text-lg text-text-primary mb-2">{tPrice(`plan${i + 1}_name`)}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-display font-bold text-shimmer">{plan.price === 'Gratis' ? tPrice('free') : plan.price}</span>
                  {plan.period && <span className="text-sm text-text-muted">/{tPrice('month')}</span>}
                </div>
                <p className="text-sm text-text-muted mb-6">{tPrice(`plan${i + 1}_desc`)}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      {tPrice(`plan${i + 1}_f${j + 1}`)}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`w-full text-center block ${plan.popular ? 'btn-primary' : 'btn-secondary'} py-3`}
                >
                  {plan.popular ? tPrice('cta_choose') : (i === 0 ? tPrice('cta_free') : tPrice('cta_choose'))}
                </Link>
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
              <span className="text-xs font-semibold text-amber-300">{tTesti('badge')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              {tTesti('title_1')} <span className="text-shimmer">{tTesti('title_2')}</span>
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

      {/* ── Enseña en Orion ── */}
      <section id="ensenar" className="py-28 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
              <Briefcase className="w-3.5 h-3.5 text-astral-400" />
              <span className="text-xs font-semibold text-astral-300">{tTeach('badge')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              {tTeach('title_1')} <span className="text-shimmer">{tTeach('title_2')}</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-lg">
              {tTeach('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {teachSteps.map((s, i) => (
              <div key={i} className="text-center group stagger-item">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-astral-500/20 to-nebula-500/10 border border-border-default flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <s.icon className="w-6 h-6 text-astral-400" />
                </div>
                <div className="text-xs font-bold text-text-muted mb-1 tracking-widest">{tTeach('step_prefix')} {s.step}</div>
                <h3 className="font-display font-semibold text-sm text-text-primary mb-1">{tTeach(`step${i + 1}_title`)}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{tTeach(`step${i + 1}_desc`)}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <Link href="/auth/register" className="btn-accent text-base px-8 py-3.5 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> {tTeach('cta')}
              </Link>
              <p className="text-xs text-text-muted">{tTeach('cta_note')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quiénes Somos ── */}
      <section id="nosotros" className="py-28 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
                <Globe className="w-3.5 h-3.5 text-nebula-400" />
                <span className="text-xs font-semibold text-nebula-300">{tAbout('badge')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
                {tAbout('title_1')} <span className="text-shimmer">{tAbout('title_2')}</span>
              </h2>
              <p className="text-text-secondary mb-4 leading-relaxed">
                <strong className="text-text-primary">Orionix</strong> {tAbout('text_p1').replace('Orionix ', '')}
              </p>
              <p className="text-text-secondary mb-6 leading-relaxed">
                {tAbout('text_p2')}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Target className="w-4 h-4 text-nebula-400 shrink-0" />
                  <span><strong className="text-text-primary">{tAbout('mission')}</strong> {tAbout('mission_val')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <MapPin className="w-4 h-4 text-astral-400 shrink-0" />
                  <span><strong className="text-text-primary">{tAbout('location')}</strong> {tAbout('location_val')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-text-primary">{tAbout('team_label')}</strong> {tAbout('team_val')}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: tAbout('stat1_val'), label: tAbout('stat1_label'), icon: Users, color: 'text-nebula-400', bg: 'bg-nebula-500/10 border-nebula-500/20' },
                { value: tAbout('stat2_val'), label: tAbout('stat2_label'), icon: BookOpen, color: 'text-astral-400', bg: 'bg-astral-500/10 border-astral-500/20' },
                { value: tAbout('stat3_val'), label: tAbout('stat3_label'), icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
                { value: tAbout('stat4_val'), label: tAbout('stat4_label'), icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              ].map((s, i) => (
                <div key={i} className="orionix-card p-6 text-center group">
                  <div className={`w-12 h-12 rounded-xl ${s.bg} border flex items-center justify-center mx-auto mb-3 ${s.color} group-hover:scale-110 transition-transform`}>
                    <s.icon className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-display font-bold text-text-primary">{s.value}</p>
                  <p className="text-xs text-text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contacto ── */}
      <section id="contacto" className="py-28 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
              <Mail className="w-3.5 h-3.5 text-astral-400" />
              <span className="text-xs font-semibold text-astral-300">{tContact('badge')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              {tContact('title_1')} <span className="text-shimmer">{tContact('title_2')}</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-lg">
              {tContact('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              <div className="orionix-card p-6 flex items-start gap-4" style={{ transform: 'none' }}>
                <div className="w-11 h-11 rounded-xl bg-nebula-500/10 border border-nebula-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-nebula-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-text-primary mb-1">{tContact('email_label')}</h4>
                  <p className="text-sm text-text-secondary">soporte@orionix.edu</p>
                  <p className="text-sm text-text-secondary">info@orionix.edu</p>
                </div>
              </div>
              <div className="orionix-card p-6 flex items-start gap-4" style={{ transform: 'none' }}>
                <div className="w-11 h-11 rounded-xl bg-astral-500/10 border border-astral-500/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-astral-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-text-primary mb-1">{tContact('phone_label')}</h4>
                  <p className="text-sm text-text-secondary">+1 (809) 555-0123</p>
                  <p className="text-xs text-text-muted">{tContact('phone_hours')}</p>
                </div>
              </div>
              <div className="orionix-card p-6 flex items-start gap-4" style={{ transform: 'none' }}>
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-text-primary mb-1">{tContact('location_label')}</h4>
                  <p className="text-sm text-text-secondary">{tContact('location_val')}</p>
                </div>
              </div>
              {/* Social links */}
              <div className="flex items-center gap-3">
                {['Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map(social => (
                  <a key={social} href="#" className="px-4 py-2 rounded-xl glass-premium text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-border-default transition-all">
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <form onSubmit={handleContactSubmit} className="orionix-card p-8" style={{ transform: 'none' }}>
              <h3 className="font-display font-semibold text-lg text-text-primary mb-6">{tContact('form_title')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">{tContact('form_name')}</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                    placeholder={tContact('form_name_placeholder')}
                    className="orionix-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">{tContact('form_email')}</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                    placeholder={tContact('form_email_placeholder')}
                    className="orionix-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">{tContact('form_message')}</label>
                  <textarea
                    value={contactForm.message}
                    onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                    placeholder={tContact('form_message_placeholder')}
                    rows={4}
                    className="orionix-input resize-none"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> {tContact('form_send')}
                </button>
                {contactSent && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> {tContact('form_success')}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="aurora-orb aurora-orb-2" style={{ bottom: '-20%', left: '20%' }} />
          <div className="aurora-orb aurora-orb-1" style={{ top: '-15%', right: '15%' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="glass-premium p-12 md:p-16 border border-nebula-500/20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              {tCta('title_1')} <span className="text-shimmer">{tCta('title_2')}</span>
            </h2>
            <p className="text-text-secondary mb-10 max-w-md mx-auto text-lg">
              {tCta('subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="btn-primary text-base px-10 py-4 flex items-center gap-2.5 shadow-2xl shadow-nebula-500/25 hover:shadow-nebula-500/40 transition-shadow">
                {tCta('btn')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/courses" className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 group">
                {tCta('link')} <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
              <p className="text-xs text-text-muted leading-relaxed mb-3">{tFooter('desc')}</p>
              <p className="text-xs text-text-muted flex items-center gap-1"><MapPin className="w-3 h-3" /> Santo Domingo, RD</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">{tFooter('product')}</h4>
              <div className="space-y-2">
                <Link href="/courses" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('catalog')}</Link>
                <a href="#features" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('features_link')}</a>
                <a href="#planes" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('prices')}</a>
                <a href="#certificados" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('certificates_link')}</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">{tFooter('company')}</h4>
              <div className="space-y-2">
                <a href="#nosotros" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('who_we_are')}</a>
                <a href="#ensenar" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('teach_on_orion')}</a>
                <a href="#contacto" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('contact')}</a>
                <Link href="/faq" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('faq')}</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">{tFooter('legal')}</h4>
              <div className="space-y-2">
                <Link href="/legal/privacy" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('privacy')}</Link>
                <Link href="/legal/terms" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('terms')}</Link>
                <Link href="/legal/cookies" className="block text-xs text-text-muted hover:text-text-primary transition-colors">{tFooter('cookies')}</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <p>&copy; {new Date().getFullYear()} Orionix. {tFooter('credit')}</p>
            <p className="flex items-center gap-1">{tFooter('made_with')} <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {tFooter('for_education')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
