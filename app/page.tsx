"use client";
import { useState, useEffect } from "react";
import { exportarAgremiadosCSV } from "./lib/exportUtils";

export default function PaginaAgremiados() {
  const [tabActiva, setTabActiva] = useState("registro");
  const [agremiados, setAgremiados] = useState([]); // Lista completa de la BD
  const [busqueda, setBusqueda] = useState(""); // Texto del buscador
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [verAgremiado, setVerAgremiado] = useState<any | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    cop: "",
    nombres: "",
    apellidos: "",
    colegio: "COLEGIO DE PROFESIONALES",
    estado: "ACTIVO",
    habilitado: "SI",
  });

  // 1. CARGAR DATOS (GET)
  const cargarDatos = async () => {
    try {
      const res = await fetch("/api/agremiados");
      const data = await res.json();
      setAgremiados(data);
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // busqueda
  const agremiadosFiltrados = agremiados.filter(
    (a: any) =>
      a.cop.includes(busqueda) ||
      a.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.apellidos.toLowerCase().includes(busqueda.toLowerCase()),
  );

  //limpiar form

  const limpiarFormulario = () => {
    setFormData({
      cop: "",
      nombres: "",
      apellidos: "",
      colegio: "COLEGIO DE PROFESIONALES",
      estado: "ACTIVO",
      habilitado: "SI",
    });
    setEditandoId(null);
    setMensaje({ texto: "", tipo: "" });
  };
  // MANEJAR ENVÍO (Versión Única - Crea y Actualiza)
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    //setMensaje({ texto: "Procesando...", tipo: "info" });

    // Incluimos el id si estamos editando
    const datosAEnviar = {
      ...formData,
      id: editandoId,
    };

    const res = await fetch("/api/agremiados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosAEnviar),
    });

    const resultado = await res.json();

    if (res.ok) {
      const textoExito = editandoId
        ? "¡Registro actualizado!"
        : "¡Agremiado guardado exitosamente!";
      limpiarFormulario();

      setMensaje({
        texto: textoExito,
        tipo: "success",
      });

      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 5000);
      cargarDatos();
    } else {
      setMensaje({ texto: `Error: ${resultado.error}`, tipo: "error" });
    }
  };
  //eliminar
  const eliminarAgremiado = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;

    const res = await fetch(`/api/agremiados?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMensaje({ texto: "Registro eliminado", tipo: "success" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
      cargarDatos();
    }
  };

  //editar
  const prepararEdicion = (item: any) => {
    setFormData({
      cop: item.cop,
      nombres: item.nombres,
      apellidos: item.apellidos,
      colegio: item.colegio,
      estado: item.estado,
      habilitado: item.habilitado,
    });
    setEditandoId(item.id);
    setTabActiva("registro");
    window.scrollTo(0, 0);
  };

  return (
    <main className="max-w-5xl mx-auto my-10 bg-white shadow-2xl rounded-2xl overflow-hidden font-sans border border-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          SISTEMA DE AGREMIADOS
        </h1>
        <p className="text-slate-400 mt-2">
          Colegio de Profesionales - Registro y Consulta de Miembros
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-50 border-b">
        {["registro", "busqueda", "listado"].map((tab) => (
          <button
            key={tab}
            onClick={() => setTabActiva(tab)}
            className={`flex-1 py-4 font-bold uppercase text-xs tracking-widest ${tabActiva === tab ? "bg-white text-blue-600 border-b-4 border-blue-600" : "text-slate-500"}`}
          >
            {tab === "registro"
              ? "📝 Registro"
              : tab === "busqueda"
                ? "🔍 Buscador"
                : "📋 Listado Full"}
          </button>
        ))}
      </div>

      <div className="p-8">
        {/* CONTENIDO DINÁMICO SEGÚN LA PESTAÑA */}

        {/* --- PESTAÑA 1: REGISTRO --- */}
        {tabActiva === "registro" && (
          <>
            {mensaje.texto && (
              <div
                className={`mb-6 p-4 rounded-xl text-center font-bold text-white animate-pulse animate-in fade-in zoom-in duration-300 ${mensaje.tipo === "success" ? "bg-green-500" : "bg-red-500"}`}
              >
                {mensaje.texto}
              </div>
            )}

            <form
              onSubmit={manejarEnvio}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Número de COP
                </label>
                <input
                  type="text"
                  required
                  className="w-full border-2 p-3 rounded-lg outline-none focus:border-blue-500"
                  value={formData.cop}
                  onChange={(e) =>
                    setFormData({ ...formData, cop: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombres
                </label>
                <input
                  type="text"
                  required
                  className="w-full border-2 p-3 rounded-lg outline-none focus:border-blue-500 uppercase"
                  value={formData.nombres}
                  onChange={(e) =>
                    setFormData({ ...formData, nombres: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Apellidos
                </label>
                <input
                  type="text"
                  required
                  className="w-full border-2 p-3 rounded-lg outline-none focus:border-blue-500 uppercase"
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Habilitado
                </label>
                <select
                  className="w-full border-2 p-3 rounded-lg outline-none focus:border-blue-500"
                  value={formData.habilitado}
                  onChange={(e) =>
                    setFormData({ ...formData, habilitado: e.target.value })
                  }
                >
                  <option value="SI">SÍ</option>
                  <option value="NO">NO</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg"
                >
                  {editandoId ? "💾 ACTUALIZAR REGISTRO" : "GUARDAR REGISTRO"}
                </button>
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="flex-1 bg-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-300"
                >
                  LIMPIAR
                </button>
              </div>
            </form>
          </>
        )}

        {/* --- PESTAÑA 2: BUSCADOR --- */}
        {tabActiva === "busqueda" && (
          <div className="space-y-6">
            <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar por COP, Nombre o Apellido..."
              className="w-full p-4 border-2 border-blue-100 rounded-xl outline-none focus:border-blue-500 shadow-sm"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button 
                onClick={() => setBusqueda('')}
                className="absolute right-4 top-4 text-slate-500 hover:text-slate-600"
              >
                ✕
              </button>
            )}
            </div>
            

            {/* Tabla simple de resultados */}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-white text-sm">
                  <tr>
                    <th className="p-4">COP</th>
                    <th className="p-4">AGREMIADO</th>
                    <th className="p-4 text-center">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {agremiadosFiltrados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-blue-50">
                      <td className="p-4 font-bold text-blue-600">
                        {item.cop}
                      </td>
                      <td className="p-4">
                        {item.apellidos}, {item.nombres}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${item.habilitado === "SI" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {item.habilitado === "SI"
                            ? "HABILITADO"
                            : "NO HABILITADO"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- PESTAÑA 3: LISTADO COMPLETO (CRUD) --- */}
        {tabActiva === "listado" && (
            <>
            {mensaje.texto && (
              <div
                className={`mb-6 p-4 rounded-xl text-center font-bold text-white animate-pulse ${mensaje.tipo === "success" ? "bg-green-500" : "bg-red-500"}`}
              >
                {mensaje.texto}
              </div>
            )}

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Administración de Base de Datos
                </h2>
                <p className="text-sm text-slate-500">
                  Total: {agremiados.length} registros
                </p>
              </div>
              <button
                onClick={() => exportarAgremiadosCSV(agremiados)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
              >
                📥 Descargar Excel (CSV)
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr className="text-slate-600 text-sm">
                    <th className="p-4 font-bold">COP</th>
                    <th className="p-4 font-bold">NOMBRE COMPLETO</th>
                    <th className="p-4 font-bold text-center">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agremiados.map((item: any) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 font-mono text-slate-600">
                        {item.cop}
                      </td>
                      <td className="p-4 text-slate-800 font-medium">
                        {item.apellidos}, {item.nombres}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setVerAgremiado(item)}
                          className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-1 rounded-lg font-bold text-sm"
                        >
                          👁️ Ver
                        </button>
                        <button
                          onClick={() => eliminarAgremiado(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-all font-bold text-sm"
                        >
                          🗑️ Eliminar
                        </button>
                        <button
                          onClick={() => prepararEdicion(item)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition-all font-bold text-sm mr-2"
                        >
                          ✏️ Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>

        )}
      </div>

      {/* MODAL DE VISUALIZACIÓN */}
      {verAgremiado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
<div 
      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500"
      onClick={() => setVerAgremiado(null)}
    ></div>

         <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl z-10 
                    animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-bold text-slate-800">
                Detalles del Agremiado
              </h3>
              <button
                onClick={() => setVerAgremiado(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Número de COP
                </p>
                <p className="text-xl font-mono font-bold text-blue-600">
                  {verAgremiado.cop}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Nombres y Apellidos
                </p>
                <p className="text-lg text-slate-800 font-medium uppercase">
                  {verAgremiado.apellidos}, {verAgremiado.nombres}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Habilitación
                  </p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${verAgremiado.habilitado === "SI" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {verAgremiado.habilitado === "SI"
                      ? "HABILITADO"
                      : "NO HABILITADO"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Estado
                  </p>
                  <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                    {verAgremiado.estado}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setVerAgremiado(null)}
              className="w-full mt-8 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors"
            >
              Cerrar Vista
            </button>
          </div>
          
        </div>
        
      )}
    </main>
  );
}
