
export const exportarAgremiadosCSV = (datos: any[]) => {
  if (datos.length === 0) return;

  const encabezados = ["COP", "Nombres", "Apellidos", "Colegio", "Estado", "Habilitado"];
  
  // Mapeamos los datos y manejamos posibles comas dentro de los textos
  const filas = datos.map(a => [
    a.cop,
    a.nombres,
    a.apellidos,
    a.colegio,
    a.estado,
    a.habilitado
  ].join(";"));

  // Agregamos el BOM (Byte Order Mark) para que Excel reconozca tildes y Ñ
  const csvContent = "sep=;\n" + "\uFEFF" + [encabezados.join(";"), ...filas].join("\n"); 
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.href = url;
  link.setAttribute("download", `reporte_agremiados_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};