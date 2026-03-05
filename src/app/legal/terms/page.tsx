// ===== Terms & Conditions =====
import PublicNavbar from '@/components/ui/PublicNavbar';

export default function TermsPage() {
          return (
                    <div className="min-h-screen starfield">
                              <PublicNavbar />
                              <div className="max-w-3xl mx-auto px-6 py-16 pt-24 relative z-10">
                                        <div className="mb-8">
                                                  <h1 className="text-3xl font-display font-bold">Términos y Condiciones</h1>
                                                  <p className="text-sm text-text-muted mt-2">Última actualización: 1 de enero de 2026</p>
                                        </div>
                                        <div className="orionix-card p-8 md:p-12 space-y-8 text-text-secondary text-sm leading-relaxed" style={{ transform: 'none' }}>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">1. Aceptación de los términos</h2>
                                                            <p>Al acceder y utilizar la plataforma Orionix, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, no debes usar la plataforma.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">2. Descripción del servicio</h2>
                                                            <p>Orionix es una plataforma educativa que permite a estudiantes acceder a cursos virtuales, a docentes crear y gestionar contenido educativo, y a administradores supervisar la operación de la plataforma.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">3. Registro y cuentas</h2>
                                                            <p>Para utilizar los servicios de Orionix, debes crear una cuenta proporcionando información veraz y actualizada. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Los docentes requieren aprobación del administrador para activar su cuenta.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">4. Uso aceptable</h2>
                                                            <p>Te comprometes a usar la plataforma de manera ética y legal. Está prohibido: compartir credenciales, distribuir contenido con derechos de autor sin autorización, intentar acceder a cuentas ajenas, o utilizar la plataforma para actividades ilegales.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">5. Propiedad intelectual</h2>
                                                            <p>El contenido publicado por los docentes es de su propiedad o cuenta con las licencias necesarias. Orionix no reclama propiedad sobre el contenido de los usuarios, pero se reserva el derecho de mostrarlo dentro de la plataforma.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">6. Modificaciones</h2>
                                                            <p>Orionix se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma y entrarán en vigencia inmediatamente.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">7. Contacto</h2>
                                                            <p>Para consultas sobre estos términos, contacta a: <span className="text-nebula-400">legal@orionix.edu</span></p>
                                                  </section>
                                        </div>
                              </div>
                    </div>
          );
}
