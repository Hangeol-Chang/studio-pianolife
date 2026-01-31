import { redirect } from '@sveltejs/kit';
import { signOut } from '@auth/sveltekit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    await signOut(event);
    throw redirect(303, '/admin/login');
  }
};
