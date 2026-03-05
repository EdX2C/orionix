// ===== Privacy Policy =====
import PublicNavbar from '@/components/ui/PublicNavbar';

export default function PrivacyPage() {
          return (
                    <div className="min-h-screen starfield">
                              <PublicNavbar />
                              <div className="max-w-3xl mx-auto px-6 py-16 pt-24 relative z-10">
                                        <div className="mb-8">
                                                  <h1 className="text-3xl font-display font-bold">Política de Privacidad</h1>
                                                  <p className="text-sm text-text-muted mt-2">Última actualización: 1 de enero de 2026</p>
                                        </div>
                                        <div className="orionix-card p-8 md:p-12 space-y-8 text-text-secondary text-sm leading-relaxed" style={{ transform: 'none' }}>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">1. Información que recopilamos</h2>
                                                            <p>Recopilamos información que proporcionas al registrarte (nombre, correo, rol), datos de uso de la plataforma (cursos accedidos, tareas entregadas, progreso) y datos técnicos (IP, navegador, dispositivo) para mejorar el servicio.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">2. Uso de la información</h2>
                                                            <p>Utilizamos tu información para: proporcionar y mejorar los servicios educativos, personalizar tu experiencia, enviar notificaciones relevantes sobre tus cursos, y generar reportes académicos para docentes y administradores.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">3. Compartir información</h2>
                                                            <p>No vendemos ni compartimos tu información personal con terceros. Los docentes pueden ver el progreso y entregas de los estudiantes inscritos en sus cursos. Los administradores tienen acceso a datos agregados de la plataforma.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">4. Seguridad</h2>
                                                            <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información, incluyendo cifrado de contraseñas, conexiones seguras (HTTPS) y control de acceso basado en roles.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">5. Tus derechos</h2>
                                                            <p>Tienes derecho a acceder, rectificar y eliminar tu información personal. También puedes solicitar la portabilidad de tus datos o restringir su procesamiento. Para ejercer estos derechos, contacta a nuestro equipo.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">6. Cookies</h2>
                                                            <p>Utilizamos cookies esenciales para el funcionamiento de la plataforma (autenticación, preferencias). No utilizamos cookies de seguimiento publicitario de terceros.</p>
                                                  </section>
                                                  <section>
                                                            <h2 className="text-lg font-display font-semibold text-text-primary mb-3">7. Contacto</h2>
                                                            <p>Para consultas sobre privacidad: <span className="text-nebula-400">privacidad@orionix.edu</span></p>
                                                  </section>
                                        </div>
                              </div>
                    </div>
          );
}
