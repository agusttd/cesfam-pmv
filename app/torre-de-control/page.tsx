"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Cita {
  id: number;
  rut_paciente: string;
  nombre_paciente: string;
  motivo: string;
  fecha_cita: string;
  hora_cita: string;
  estado: string;
}

export default function TorreDeControl() {
  const [citasPendientes, setCitasPendientes] = useState<Cita[]>([]);

  useEffect(() => {
    const fetchCitas = async () => {
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .order("fecha_cita", { ascending: true }) // Ordenamos por fecha de atención
        .order("hora_cita", { ascending: true }); // Y luego por hora
        
      if (data) setCitasPendientes(data);
      if (error) console.error("Error al cargar citas:", error);
    };

    fetchCitas();

    const channel = supabase
      .channel("cambios-en-citas")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "citas" },
        (payload) => {
          setCitasPendientes((prev) => [...prev, payload.new as Cita]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Función para darle un formato bonito a la fecha (Ej: 21-06-2026)
  const formatearFecha = (fechaOriginal: string) => {
    if (!fechaOriginal) return "";
    const partes = fechaOriginal.split("-");
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  };

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
                <th className="p-4">Paciente</th>
                <th className="p-4">RUT</th>
                <th className="p-4">Motivo</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Hora</th>
                <th className="p-4">Estado del Sistema</th>
              </tr>
            </thead>
            <tbody>
              {citasPendientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No hay solicitudes registradas.
                  </td>
                </tr>
              ) : (
                citasPendientes.map((cita) => (
                  <tr key={cita.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{cita.nombre_paciente}</td>
                    <td className="p-4 text-slate-500 text-sm">{cita.rut_paciente}</td>
                    <td className="p-4 text-slate-600">{cita.motivo}</td>
                    <td className="p-4 text-slate-600 font-medium">{formatearFecha(cita.fecha_cita)}</td>
                    <td className="p-4 text-slate-600 font-medium">{cita.hora_cita}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cita.estado === "Agendado automáticamente" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {cita.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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