import type { PageServerLoad } from './$types';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'svelte_user',
  host: 'localhost',
  database: 'aaff',
  password: '1234',
  port: 5432
});

export const load: PageServerLoad = async ({ url }) => {
  const categoria = url.searchParams.get('categoria');
  const fondo = url.searchParams.get('fondo');
  const seriefondo = url.searchParams.get('seriefondo');
  const client = await pool.connect();
  

  try {
    // 1. Administradores únicos
    const categoriasResult = await client.query('SELECT DISTINCT administratorname FROM datos');

    // 2. Fondos asociados a esa categoría (segundo select)
    let fondosResult = { rows: [] };
    if (categoria) {
      fondosResult = await client.query(
        'SELECT DISTINCT fundname FROM datos WHERE administratorname = $1',
        [categoria]
      );
    }
     // 3. Seriefondo asociado a la categoria (tercer select)
    let seriefondoResult = { rows: [] };
    if (categoria && fondo) {
      seriefondoResult = await client.query(
        'SELECT distinct(fundseries) FROM datos WHERE fundname = $1',
        [fondo]
      );
    }

    // 3. Datos para renderizar el gráfico
    let serie = { rows: [] };
    if (categoria && fondo && seriefondo) {
      serie = await client.query(
        'SELECT * FROM datos WHERE fundname = $1 AND fundseries = $2 ORDER BY scrap_date DESC LIMIT 20;',[fondo,seriefondo]
      );
    }
    return {
      categorias: categoriasResult.rows.map(r => r.administratorname),
      fondos: fondosResult.rows.map(r => r.fundname),
      categoriaSeleccionada: categoria,
      fondoSeleccionado: fondo,
      serie : serie.rows,
      seriefondo : seriefondoResult.rows.map(r => r.fundseries)
    };
  } finally {
    client.release();
  }
};
