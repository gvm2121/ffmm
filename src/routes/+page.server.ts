// aca va el backend del formulario de acceso
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';

const pool = new Pool({
  user: 'svelte_user',
  host: 'localhost',
  database: 'aaff',
  password: '1234',
  port: 5432
});

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    console.log(data);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    console.log("accion invocada");

    const client = await pool.connect();
    try {
      const res = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
      const user = res.rows[0];

      if (!user || user.password !== password) {
        return fail(401, { error: 'Credenciales inválidas' });
      }

      cookies.set('session', JSON.stringify({
        user_id: user.id,
        tenant_id: user.tenant_id
      }), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24
      });

      throw redirect(303, '/intra');
    } finally {
      client.release();
    }
  },

  register: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const tenantName = data.get('tenant') as string;
    const tenantId = randomUUID();

    const client = await pool.connect();
    try {
      await client.query('INSERT INTO tenant (id, nombre) VALUES ($1, $2)', [tenantId, tenantName]);
      await client.query(
        'INSERT INTO usuarios (email, password, tenant_id) VALUES ($1, $2, $3)',
        [email, password, tenantId]
      );
      throw redirect(303, '/');
    } catch (e) {
      return fail(500, { error: 'Error creando cuenta' });
    } finally {
      client.release();
    }
  }
};
