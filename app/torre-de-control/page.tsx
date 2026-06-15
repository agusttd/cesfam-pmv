"use client";

import Link from "next/link";

export default function TorreDeControl() {
  // Datos simulados (Mock data) para esta etapa 1.
  // En la Etapa 3, esto vendra de un fetch a Supabase/otra en tiempo real.
  const citasPendientes = [
    { id: 1, rut: "15.678.123-4", motivo: "Morbilidad", hora: "08:30 AM", estado: "Pendiente" },
    { id: 2, rut: "12.345.678-9", motivo: "Control Crónico", hora: "09:00 AM", estado: "Asignado" },
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Torre de Control CESFAM</h1>
            <p className="text-sm text-slate-500">Panel de agendamiento automatizado</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-emerald-600">Sistema Activo (Latencia Cero)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                <th className="p-4">RUT Paciente</th>
                <th className="p-4">Motivo</th>
                <th className="p-4">Hora Solicitada</th>
                <th className="p-4">Estado del Sistema</th>
              </tr>
            </thead>
            <tbody>
              {citasPendientes.map((cita) => (
                <tr key={cita.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-700">{cita.rut}</td>
                  <td className="p-4 text-slate-600">{cita.motivo}</td>
                  <td className="p-4 text-slate-600">{cita.hora}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cita.estado === "Asignado" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {cita.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Mensaje de placeholder para cuando conecten la BD */}
          <div className="p-4 text-center text-sm text-slate-400 border-t border-slate-100 bg-slate-50/50">
            Esperando nuevas solicitudes en tiempo real...
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors">
            &larr; Volver al formulario de paciente
          </Link>
        </div>
      </div>
    </main>
  );
}