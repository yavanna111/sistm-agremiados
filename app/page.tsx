'use client';
import { useState, useEffect } from 'react';

export default function PaginaAgremiados() {
  const [tabActiva, setTabActiva] = useState('registro');
  const [agremiados, setAgremiados] = useState([]); // Lista completa de la BD
  const [busqueda, setBusqueda] = useState('');     // Texto del buscador
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const [formData, setFormData] = useState({
    cop: '', nombres: '', apellidos: '', colegio: 'COLEGIO DE PROFESIONALES', estado: 'ACTIVO', habilitado: 'SI'
  });

  // 1. CARGAR DATOS DE LA BD (GET)
  const cargarDatos = async () => {
    try {
      const res = await fetch('/api/agremiados');
      const data = await res.json();
      setAgremiados(data);
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // 2. GUARDAR DATOS (POST)
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ texto: 'Procesando...', tipo: 'info' });

    const res = await fetch('/api/agremiados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const resultado = await res.json();

    if (res.ok) {
      setMensaje({ texto: '¡Agremiado guardado exitosamente!', tipo: 'success' });
      setFormData({ cop: '', nombres: '', apellidos: '', colegio: 'COLEGIO DE PROFESIONALES', estado: 'ACTIVO', habilitado: 'SI' });
      cargarDatos(); // Actualizamos la lista automáticamente
    } else {
      setMensaje({ texto: `Error: ${resultado.error}`, tipo: 'error' });
    }
  };

  // 3. LÓGICA DE BÚSQUEDA (Filtrado en tiempo real)
  const agremiadosFiltrados = agremiados.filter((a: any) => 
    a.cop.includes(busqueda) || 
    a.nombres.toLowerCase().includes(busqueda.toLowerCase()) || 
    a.apellidos.toLowerCase().includes(busqueda.toLowerCase())
  );

  

  return (
    <main className="max-w-5xl mx-auto my-10 bg-white shadow-2xl rounded-2xl overflow-hidden font-sans border border-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">SISTEMA DE AGREMIADOS</h1>
        <p className="text-slate-400 mt-2">Colegio de Profesionales - Registro y Consulta de Miembros</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-50 border-b">
        <button onClick={() => setTabActiva('registro')} className={`flex-1 py-4 font-bold ${tabActiva === 'registro' ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'text-slate-500'}`}>
          📝 REGISTRAR
        </button>
        <button onClick={() => setTabActiva('lista')} className={`flex-1 py-4 font-bold ${tabActiva === 'lista' ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'text-slate-500'}`}>
          🔍 BUSCAR / LISTADO
        </button>
      </div>

      <div className="p-8">
        {mensaje.texto && (
          <div className={`mb-6 p-4 rounded-xl text-center font-bold text-white animate-pulse ${mensaje.tipo === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {mensaje.texto}
          </div>
        )}

        {tabActiva === 'registro' ? (
          <form onSubmit={manejarEnvio} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Número de COP</label>
              <input type="text" required className="w-full border-2 p-3 rounded-lg outline-none focus:border-blue-500" value={formData.cop} onChange={e => setFormData({...formData, cop: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nombres</label>
              <input type="text" required className="w-full border-2 p-3 rounded-lg outline-none focus:border-blue-500 uppercase" value={formData.nombres} onChange={e => setFormData({...formData, nombres: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Apellidos</label>
              <input type="text" required className="w-full border-2 p-3 rounded-lg outline-none focus:border-blue-500 uppercase" value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Habilitado</label>
              <select className="w-full border-2 p-3 rounded-lg outline-none focus:border-blue-500" value={formData.habilitado} onChange={e => setFormData({...formData, habilitado: e.target.value})}>
                <option value="SI">SÍ</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <button type="submit" className="md:col-span-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
              GUARDAR REGISTRO
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <input 
              type="text" 
              placeholder="Escribe COP, Nombre o Apellido para buscar..." 
              className="w-full p-4 border-2 border-blue-100 rounded-xl outline-none focus:border-blue-500 shadow-inner"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-4">COP</th>
                    <th className="p-4">AGREMIADO</th>
                    <th className="p-4">HABILITADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {agremiadosFiltrados.map((item: any) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 font-bold text-blue-600">{item.cop}</td>
                      <td className="p-4 font-medium">{item.apellidos}, {item.nombres}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.habilitado === 'SI' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.habilitado === 'SI' ? 'HABILITADO' : 'INHABILITADO'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 