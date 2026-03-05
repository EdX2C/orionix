'use client';
// ===== FAQ Page — Accordion Q&A =====
import React, { useState } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/ui/PublicNavbar';
import { ChevronDown, HelpCircle, BookOpen, CreditCard, Settings, GraduationCap, Mail } from 'lucide-react';

interface FAQItem { question: string; answer: string; }
interface FAQCategory { name: string; icon: React.ElementType; items: FAQItem[]; }

const faqData: FAQCategory[] = [
          {
                    name: 'General',
                    icon: HelpCircle,
                    items: [
                              { question: '¿Qué es Orionix?', answer: 'Orionix es una plataforma educativa SaaS que ofrece cursos en línea de tecnología, programación, inteligencia artificial, diseño y más. Permite a estudiantes aprender a su ritmo con contenido grabado disponible 24/7.' },
                              { question: '¿Necesito registrarme para ver los cursos?', answer: 'No. Puedes explorar el catálogo completo de cursos sin registrarte. Solo necesitas crear una cuenta para inscribirte y acceder al contenido.' },
                              { question: '¿Desde dónde puedo acceder?', answer: 'Orionix es una plataforma web accesible desde cualquier dispositivo con conexión a internet: computadora, tablet o teléfono móvil.' },
                              { question: '¿En qué idiomas está disponible la plataforma?', answer: 'Actualmente Orionix está disponible en español. Estamos trabajando en soporte para inglés que estará disponible próximamente.' },
                    ]
          },
          {
                    name: 'Cursos',
                    icon: BookOpen,
                    items: [
                              { question: '¿Los cursos son en vivo o grabados?', answer: 'Todos los cursos son grabados y están disponibles 24/7. Puedes avanzar a tu propio ritmo, pausar y retomar cuando quieras.' },
                              { question: '¿Cuánto tiempo tengo para completar un curso?', answer: 'No hay límite de tiempo. Una vez inscrito, tienes acceso al curso de forma indefinida según tu plan activo.' },
                              { question: '¿Recibo un certificado al terminar?', answer: 'Sí. Al completar todos los módulos y tareas de un curso, recibirás un certificado digital verificable de Orionix que puedes compartir en tu portafolio o LinkedIn.' },
                              { question: '¿Puedo descargar el contenido?', answer: 'El contenido en video no es descargable. Sin embargo, los materiales complementarios como PDFs, código fuente y recursos adicionales sí pueden descargarse.' },
                    ]
          },
          {
                    name: 'Pagos y Planes',
                    icon: CreditCard,
                    items: [
                              { question: '¿Qué planes están disponibles?', answer: 'Ofrecemos tres planes: Plan Básico (gratuito, acceso a 5 cursos), Plan Intermedio ($19/mes, 50+ cursos y certificados), y Plan Avanzado ($39/mes, acceso ilimitado con mentoría).' },
                              { question: '¿Puedo cambiar de plan en cualquier momento?', answer: 'Sí. Puedes actualizar o degradar tu plan cuando quieras. Los cambios se reflejan en tu próximo ciclo de facturación.' },
                              { question: '¿Hay política de reembolso?', answer: 'Si no estás satisfecho con tu plan, puedes solicitar un reembolso dentro de los primeros 7 días de tu suscripción.' },
                              { question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express) y PayPal. Pronto integraremos métodos locales adicionales.' },
                    ]
          },
          {
                    name: 'Técnico',
                    icon: Settings,
                    items: [
                              { question: '¿Qué hago si tengo problemas para iniciar sesión?', answer: 'Verifica que estés usando el correo correcto. Si olvidaste tu contraseña, usa la opción "Recuperar contraseña" en la página de inicio de sesión. Si el problema persiste, contacta soporte.' },
                              { question: '¿Cuáles son los requisitos técnicos?', answer: 'Solo necesitas un navegador web moderno (Chrome, Firefox, Safari, Edge) actualizado. Recomendamos una conexión a internet estable de al menos 5 Mbps para los videos.' },
                              { question: '¿Mis datos están seguros?', answer: 'Sí. Implementamos cifrado de contraseñas, conexiones HTTPS, control de acceso basado en roles y sesiones protegidas. No compartimos ni vendemos tu información personal.' },
                    ]
          },
          {
                    name: 'Docentes',
                    icon: GraduationCap,
                    items: [
                              { question: '¿Cómo puedo enseñar en Orionix?', answer: 'El proceso tiene 4 pasos: envía tu solicitud, selecciona una fecha para tu reunión de evaluación, participa en la entrevista y, si cumples los requisitos, recibirás acceso como docente.' },
                              { question: '¿Se requiere experiencia previa?', answer: 'Valoramos experiencia profesional en el área que deseas enseñar. No es obligatorio tener experiencia docente previa, pero sí conocimiento sólido de tu especialidad.' },
                              { question: '¿Los docentes reciben compensación?', answer: 'Sí. Los docentes reciben una compensación basada en las inscripciones de sus cursos. Los detalles se discuten durante el proceso de admisión.' },
                    ]
          }
];

function AccordionItem({ item, isOpen, toggle }: { item: FAQItem; isOpen: boolean; toggle: () => void }) {
          return (
                    <div className="border-b border-border-subtle last:border-b-0">
                              <button onClick={toggle} className="w-full flex items-center justify-between py-4 px-1 text-left group">
                                        <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                                                  {item.question}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 ml-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-nebula-400' : ''}`} />
                              </button>
                              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-80 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                        <p className="text-sm text-text-muted leading-relaxed px-1">{item.answer}</p>
                              </div>
                    </div>
          );
}

export default function FAQPage() {
          const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

          const toggleItem = (key: string) => {
                    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
          };

          return (
                    <div className="min-h-screen starfield">
                              <PublicNavbar />
                              <div className="max-w-4xl mx-auto px-6 py-16 pt-24 relative z-10">
                                        {/* Header */}
                                        <div className="text-center mb-12">
                                                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-5">
                                                            <HelpCircle className="w-3.5 h-3.5 text-nebula-400" />
                                                            <span className="text-xs font-semibold text-nebula-300">Centro de ayuda</span>
                                                  </div>
                                                  <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                                                            Preguntas <span className="text-shimmer">frecuentes</span>
                                                  </h1>
                                                  <p className="text-text-secondary max-w-lg mx-auto">
                                                            Encuentra respuestas a las preguntas más comunes sobre Orionix.
                                                  </p>
                                        </div>

                                        {/* FAQ Categories */}
                                        <div className="space-y-8">
                                                  {faqData.map((cat, ci) => (
                                                            <div key={ci} className="orionix-card p-6 md:p-8" style={{ transform: 'none' }}>
                                                                      <div className="flex items-center gap-3 mb-5">
                                                                                <div className="w-10 h-10 rounded-xl bg-nebula-500/10 border border-nebula-500/20 flex items-center justify-center">
                                                                                          <cat.icon className="w-5 h-5 text-nebula-400" />
                                                                                </div>
                                                                                <h2 className="text-lg font-display font-semibold text-text-primary">{cat.name}</h2>
                                                                      </div>
                                                                      <div>
                                                                                {cat.items.map((item, qi) => {
                                                                                          const key = `${ci}-${qi}`;
                                                                                          return (
                                                                                                    <AccordionItem
                                                                                                              key={key}
                                                                                                              item={item}
                                                                                                              isOpen={!!openItems[key]}
                                                                                                              toggle={() => toggleItem(key)}
                                                                                                    />
                                                                                          );
                                                                                })}
                                                                      </div>
                                                            </div>
                                                  ))}
                                        </div>

                                        {/* CTA */}
                                        <div className="mt-12 text-center">
                                                  <div className="orionix-card p-8 inline-block" style={{ transform: 'none' }}>
                                                            <div className="flex items-center gap-3 mb-3 justify-center">
                                                                      <Mail className="w-5 h-5 text-astral-400" />
                                                                      <h3 className="font-display font-semibold text-text-primary">¿No encontraste tu respuesta?</h3>
                                                            </div>
                                                            <p className="text-sm text-text-muted mb-5">Nuestro equipo está aquí para ayudarte.</p>
                                                            <Link href="/#contacto" className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2">
                                                                      Contáctanos
                                                            </Link>
                                                  </div>
                                        </div>
                              </div>
                    </div>
          );
}
