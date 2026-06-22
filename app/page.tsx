"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function FormularioPaciente() {
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [enviando, setEnviando] = useState(false);
  
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const validarRut = (rutP: string) => {
    const regex = /^[0-9]{7,8}-[0-9kK]{1}$/;
    return regex.test(rutP);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensajeError("");
    setMensajeExito("");

    // Validación 1: RUT
    if (!validarRut(rut)) {
      setMensajeError("Formato de RUT inválido. Debe ser sin puntos y con guion (Ej: 12345678-9).");
      setEnviando(false);
      return;
    }

    // Validación 2: Nombre Mínimo 4 caracteres 
    if (nombre.trim().length < 4) {
      setMensajeError("Por favor, ingresa un nombre y apellido válido.");
      setEnviando(false);
      return;
    }

    // Validación 3: Horario CESFAM (De 08:00 a 17:00)
    const horaSeleccionada = parseInt(hora.split(":")[0]);
    if (horaSeleccionada < 8 || horaSeleccionada > 16) {
      setMensajeError("El horario de atención del CESFAM es entre las 08:00 y las 17:00 hrs.");
      setEnviando(false);
      return;
    }

    const { error } = await supabase.from("citas").insert([
      {
        rut_paciente: rut,
        nombre_paciente: nombre.trim(),
        motivo: motivo,
        fecha_cita: fecha,
        hora_cita: hora,
      },
    ]);

    if (error) {
      console.error("Error BD:", error);
      if (error.code === "23505") {
        setMensajeError("Ya tienes una hora agendada para este mismo motivo.");
      } else {
        setMensajeError("Hubo un error de conexión. Inténtalo más tarde.");
      }
    } else {
      setMensajeExito("¡Hora médica agendada con éxito en el CESFAM!");
      setRut("");
      setNombre("");
      setMotivo("");
      setFecha("");
      setHora("");
    }

    setEnviando(false);
  };

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-teal-700">CESFAM Digital</h1>
          <p className="text-sm text-gray-500">Agendamiento de Horas Médicas</p>
        </div>

        {mensajeError && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {mensajeError}
          </div>
        )}
        
        {mensajeExito && (
          <div className="mb-4 p-3 bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded">
            {mensajeExito}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
              <input
                type="text"
                placeholder="12345678-9"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellido</label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Consulta</label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              required
            >
              <option value="" disabled>Seleccione un motivo...</option>
              <option value="Morbilidad">Consulta de Morbilidad</option>
              <option value="Control Crónico">Control Crónico</option>
              <option value="Exámenes">Revisión de Exámenes</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                min={hoy}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora (08:00 - 17:00)</label>
              <input
                type="time"
                min="08:00"
                max="17:00"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-4 ${
              enviando ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {enviando ? "Procesando..." : "Confirmar Agendamiento"}
          </button>
        </form>
      </div>

      <Link href="/torre-de-control" className="mt-8 text-teal-600 hover:underline text-sm font-medium">
        Ir a la vista del funcionario (Torre de Control) &rarr;
      </Link>
    </main>
  );
}