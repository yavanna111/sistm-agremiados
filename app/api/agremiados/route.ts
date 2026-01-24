import { NextResponse } from 'next/server';
import db from "../../lib/db";

// Este método GET servirá para BUSCAR y LISTAR
export async function GET() {
  try {
    const agremiados = await db.agremiado.findMany();
    return NextResponse.json(agremiados);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}

// Este método POST servirá para REGISTRAR un nuevo agremiado
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, cop, nombres, apellidos, colegio, estado, habilitado } = body;

    // UPSERT: El comando "2 en 1" de Prisma
    const resultado = await db.agremiado.upsert({
      where: { 
        // Si 'id' es undefined o null, usamos -1 para forzar la creación
        id: id ? Number(id) : -1 
      },
      update: {
        cop: String(cop),
        nombres: nombres.toUpperCase(),
        apellidos: apellidos.toUpperCase(),
        colegio,
        estado,
        habilitado,
      },
      create: {
        cop: String(cop),
        nombres: nombres.toUpperCase(),
        apellidos: apellidos.toUpperCase(),
        colegio: colegio || "GENERAL",
        estado: estado || "ACTIVO",
        habilitado: habilitado || "SI",
      },
    });

    return NextResponse.json(resultado);
  } catch (error: any) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "No se pudo procesar la solicitud" }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await db.agremiado.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}