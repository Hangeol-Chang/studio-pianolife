import { redirect } from '@sveltejs/kit';
import { ADMIN_EMAILS } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  const session = await locals.auth();

  if (!session?.user) {
    throw redirect(303, '/admin/login');
  }

  const allowedEmails = (ADMIN_EMAILS || '').split(',').map(e => e.trim());
  if (!allowedEmails.includes(session.user.email || '')) {
    throw redirect(303, '/admin/unauthorized');
  }

  return {
    user: session.user
  };
}
