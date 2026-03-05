// ===== Cookies Policy =====
import Link from 'next/link';
import PublicNavbar from '@/components/ui/PublicNavbar';
import { Sparkles } from 'lucide-react';

export default function CookiesPage() {
          return (
                    <div className="min-h-screen starfield">
                              <PublicNavbar />
                              <div className="max-w-3xl mx-auto px-6 py-16 pt-24 relative z-10">
                                        <div className="mb-8">
                                                  <h1 className="text-3xl font-display font-bold">Política de Cookies</h1>
                                                  <p className="text-sm text-text-muted mt-2">Última actualización: 1 de enero de 2026</p>
                                        </div>
                                        <div className="orionix-card p-8 md:p-12 space-y-8 text-text-secondary text-sm leading-relaxed" style={{ transform: 'none' }}>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">1. ¿Qué son las cookies?</h2>
                                                            <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Se utilizan para recordar tus preferencias, mantener tu sesión activa y mejorar tu experiencia de navegación.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">2. Tipos de cookies que usamos</h2>
                                                            <p className="mb-3">En Orionix utilizamos los siguientes tipos de cookies:</p>
                                                            <ul className="list-disc pl-5 space-y-2">
                                                                      <li><strong className="text-text-primary">Cookies esenciales:</strong> Necesarias para el funcionamiento básico de la plataforma. Incluyen autenticación, preferencias de sesión y seguridad. No pueden ser desactivadas.</li>
                                                                      <li><strong className="text-text-primary">Cookies de preferencias:</strong> Almacenan tus configuraciones como el tema (claro/oscuro) e idioma seleccionado para personalizar tu experiencia.</li>
                                                                      <li><strong className="text-text-primary">Cookies de rendimiento:</strong> Nos ayudan a entender cómo interactúas con la plataforma para optimizar su funcionamiento. No recopilan información personal identificable.</li>
                                                            </ul>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">3. Cookies de terceros</h2>
                                                            <p>Orionix <strong className="text-text-primary">no utiliza</strong> cookies de seguimiento publicitario ni cookies de terceros para fines de marketing. No compartimos datos de cookies con redes publicitarias ni servicios externos de tracking.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">4. Duración de las cookies</h2>
                                                            <ul className="list-disc pl-5 space-y-2">
                                                                      <li><strong className="text-text-primary">Cookies de sesión:</strong> Se eliminan automáticamente cuando cierras el navegador.</li>
                                                                      <li><strong className="text-text-primary">Cookies persistentes:</strong> Permanecen en tu dispositivo hasta su fecha de expiración o hasta que las elimines manualmente. Las cookies de preferencias de Orionix tienen una duración máxima de 1 año.</li>
                                                            </ul>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">5. Gestión de cookies</h2>
                                                            <p>Puedes gestionar o eliminar las cookies a través de la configuración de tu navegador. Ten en cuenta que desactivar las cookies esenciales podría afectar el funcionamiento de la plataforma, como mantener tu sesión activa o recordar tus preferencias de tema.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">6. Cambios en esta política</h2>
                                                            <p>Nos reservamos el derecho de actualizar esta política de cookies cuando sea necesario. Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">7. Contacto</h2>
                                                            <p>Si tienes preguntas sobre nuestra política de cookies, contacta a: <span className="text-nebula-400">privacidad@orionix.edu</span></p>
                                                  </section>
                                        </div>
                                        {/* Cross-links */}
                                        <div className="mt-8 flex flex-wrap gap-4 text-xs text-text-muted">
                                                  <Link href="/legal/privacy" className="hover:text-text-primary transition-colors">Privacidad</Link>
                                                  <Link href="/legal/terms" className="hover:text-text-primary transition-colors">Términos</Link>
                                                  <Link href="/faq" className="hover:text-text-primary transition-colors">Preguntas frecuentes</Link>
                                        </div>
                              </div>
                    </div>
          );
}
