"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Cita {
  id: number;
  rut_paciente: string;
  motivo: string;
  estado: string;
  fecha_solicitud: string;
}

export default function TorreDeControl() {
  const [citasPendientes, setCitasPendientes] = useState<Cita[]>([]);

  useEffect(() => {
    // Se cargan las citas existentes al abrir la página
    const fetchCitas = async () => {
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .order("fecha_solicitud", { ascending: false });
        
      if (data) setCitasPendientes(data);
      if (error) console.error("Error al cargar citas:", error);
    };

    fetchCitas();

    // se actualizan los cambios en tiempo real 
    const channel = supabase
      .channel("cambios-en-citas")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "citas" },
        (payload) => {
          // Cuando llega un nuevo INSERT a la BD, lo agregamos arriba en la tabla visual
          console.log("¡Nueva cita recibida en tiempo real!", payload.new);
          setCitasPendientes((prev) => [payload.new as Cita, ...prev]);
        }
      )
      .subscribe();

    // Limpieza al cerrar la página
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
                <th className="p-4">Estado del Sistema</th>
              </tr>
            </thead>
            <tbody>
              {citasPendientes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    No hay solicitudes pendientes.
                  </td>
                </tr>
              ) : (
                citasPendientes.map((cita) => (
                  <tr key={cita.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-700">{cita.rut_paciente}</td>
                    <td className="p-4 text-slate-600">{cita.motivo}</td>
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