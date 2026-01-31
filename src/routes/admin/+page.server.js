import { redirect } from '@sveltejs/kit';
import { ADMIN_EMAILS } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  const session = await locals.auth();
  
  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!session?.user) {
    throw redirect(303, '/admin/login');
  }
  
  // 허용된 이메일인지 확인
  const allowedEmails = (ADMIN_EMAILS || '').split(',').map(e => e.trim());
  if (!allowedEmails.includes(session.user.email || '')) {
    throw redirect(303, '/admin/unauthorized');
  }
  
  return {
    user: session.user
  };
}
