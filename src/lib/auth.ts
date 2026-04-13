// Dev mode: mock auth — returns a fake user session
// Replace with real NextAuth config for production

const DEV_USER = {
  id: 'dev-user-001',
  name: 'Dev User',
  email: 'dev@noveaire.local',
  image: null,
}

export async function auth() {
  return {
    user: DEV_USER,
    expires: new Date(Date.now() + 86400000).toISOString(),
  }
}

export const handlers = {
  GET: async () => new Response('Dev mode', { status: 200 }),
  POST: async () => new Response('Dev mode', { status: 200 }),
}

export const signIn = async () => {}
export const signOut = async () => {}
