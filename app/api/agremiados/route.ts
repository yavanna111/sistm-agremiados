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

    //  Validación que no vengan vacíos

    if (!body.cop || !body.nombres || !body.apellidos) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }
    
    const nuevoAgremiado = await db.agremiado.create({
      data: {
        cop: body.cop,
        nombres: body.nombres.toUpperCase(),
        apellidos: body.apellidos.toUpperCase(),
        colegio: body.colegio,
        estado: body.estado,
        habilitado: body.habilitado,
      },
    });

    return NextResponse.json(nuevoAgremiado);
  } catch (error:any) {

    console.error("Error al crear agremiado:", error);

    // clave única para el campo 'cop'
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "El número de COP ya está registrado" }, { status: 409 });
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });


  }
}