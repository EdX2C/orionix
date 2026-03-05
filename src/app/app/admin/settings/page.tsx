'use client';
// ===== Admin: Settings =====
import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { Globe, Shield, Mail, Database, Loader2, Save, ToggleLeft, ToggleRight } from 'lucide-react';

function ToggleSwitch({
          enabled,
          onToggle,
          label,
          description,
}: {
          enabled: boolean;
          onToggle: () => void;
          label: string;
          description: string;
}) {
          return (
                    <div className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
                              <div>
                                        <p className="text-sm font-medium text-text-primary">{label}</p>
                                        <p className="text-xs text-text-muted">{description}</p>
                              </div>
                              <button onClick={onToggle} className="shrink-0">
                                        {enabled ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-text-muted" />}
                              </button>
                    </div>
          );
}

export default function AdminSettingsPage() {
          const { addToast } = useToast();
          const [saving, setSaving] = useState(false);
          const [settings, setSettings] = useState({
                    platformName: 'Orionix',
                    supportEmail: 'soporte@orionix.edu',
                    maxCoursesPerTeacher: '10',
                    maxCapacityPerCourse: '50',
                    autoApproveTeachers: false,
                    autoApproveStudents: true,
                    enableNotifications: true,
                    enableEmails: true,
                    maintenanceMode: false,
          });

          const toggle = (key: keyof typeof settings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
          const update = (key: string, val: string) => setSettings(prev => ({ ...prev, [key]: val }));

          const handleSave = async () => {
                    setSaving(true);
                    await new Promise(r => setTimeout(r, 600));
                    addToast('Configuración guardada correctamente', 'success');
                    setSaving(false);
          };

          return (
                    <div className="max-w-3xl space-y-8 animate-fade-in">
                              <div>
                                        <h1 className="text-2xl font-display font-bold">Configuración</h1>
                                        <p className="text-sm text-text-muted mt-1">Ajustes generales de la plataforma</p>
                              </div>

                              {/* General */}
                              <div className="orionix-card p-6 space-y-5" style={{ transform: 'none' }}>
                                        <h2 className="font-display font-semibold flex items-center gap-2"><Globe className="w-4 h-4 text-nebula-400" /> General</h2>
                                        <div>
                                                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Nombre de la plataforma</label>
                                                  <input value={settings.platformName} onChange={e => update('platformName', e.target.value)} className="orionix-input" />
                                        </div>
                                        <div>
                                                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Correo de soporte</label>
                                                  <div className="relative">
                                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                            <input value={settings.supportEmail} onChange={e => update('supportEmail', e.target.value)} className="orionix-input pl-10" />
                                                  </div>
                                        </div>
                              </div>

                              {/* Limits */}
                              <div className="orionix-card p-6 space-y-5" style={{ transform: 'none' }}>
                                        <h2 className="font-display font-semibold flex items-center gap-2"><Database className="w-4 h-4 text-astral-400" /> Límites</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                  <div>
                                                            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Máx. cursos por docente</label>
                                                            <input type="number" value={settings.maxCoursesPerTeacher} onChange={e => update('maxCoursesPerTeacher', e.target.value)} className="orionix-input" />
                                                  </div>
                                                  <div>
                                                            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Máx. capacidad por curso</label>
                                                            <input type="number" value={settings.maxCapacityPerCourse} onChange={e => update('maxCapacityPerCourse', e.target.value)} className="orionix-input" />
                                                  </div>
                                        </div>
                              </div>

                              {/* Policies */}
                              <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                        <h2 className="font-display font-semibold flex items-center gap-2 mb-4"><Shield className="w-4 h-4 text-amber-400" /> Políticas y alertas</h2>
                                        <ToggleSwitch enabled={settings.autoApproveStudents} onToggle={() => toggle('autoApproveStudents')} label="Auto-aprobar estudiantes" description="Los estudiantes se activan sin aprobación manual" />
                                        <ToggleSwitch enabled={settings.autoApproveTeachers} onToggle={() => toggle('autoApproveTeachers')} label="Auto-aprobar docentes" description="Los docentes se activan sin aprobación manual" />
                                        <ToggleSwitch enabled={settings.enableNotifications} onToggle={() => toggle('enableNotifications')} label="Notificaciones in-app" description="Mostrar notificaciones dentro de la plataforma" />
                                        <ToggleSwitch enabled={settings.enableEmails} onToggle={() => toggle('enableEmails')} label="Notificaciones por correo" description="Enviar notificaciones por correo electrónico" />
                                        <ToggleSwitch enabled={settings.maintenanceMode} onToggle={() => toggle('maintenanceMode')} label="Modo mantenimiento" description="Solo los administradores podrán acceder" />
                              </div>

                              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar configuración
                              </button>
                    </div>
          );
}
