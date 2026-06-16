"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; 

export default function FormularioPaciente() {
  const [rut, setRut] = useState("");
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    // Inserción de datos en Supabase
    const { error } = await supabase
      .from("citas")
      .insert([{ rut_paciente: rut, motivo: motivo, estado: "Agendado automáticamente" }]);

    if (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al solicitar la hora.");
    } else {
      alert("¡Solicitud enviada con éxito al CESFAM!");
      setRut("");
      setMotivo("");
    }
    
    setEnviando(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-teal-700">CESFAM Digital</h1>
          <p className="text-sm text-gray-500">Solicitud de Horas Médicas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RUT del Paciente
            </label>
            <input
              type="text"
              placeholder="Ej: 12.345.678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de Consulta
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              required
            >
              <option value="" disabled>Seleccione un motivo...</option>
              <option value="Morbilidad">Consulta de Morbilidad</option>
              <option value="Control Crónico">Control Crónico</option>
              <option value="Exámenes">Revisión de Exámenes</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-4 ${
              enviando ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {enviando ? "Procesando..." : "Solicitar Hora"}
          </button>
        </form>
      </div>

      <Link href="/torre-de-control" className="mt-8 text-teal-600 hover:underline text-sm font-medium">
        Ir a la vista del funcionario (Torre de Control) &rarr;
      </Link>
    </main>
  );
}