import { createAuthClient } from 'better-auth/solid'
import env from '~/env/client'

// Configure Better Auth client to point at our API and include cookies.
// This ensures session fetches work reliably in dev/prod and across origins.
export const authClient = createAuthClient({
  baseURL: env.BASE_URL,
  basePath: '/api/auth',
  fetchOptions: {
    credentials: 'include'
  }
})
export const { useSession, signIn, signOut } = authClient

export type UseSession = typeof useSession
export type UseSessionAccessor = ReturnType<UseSession>
export type UseSessionValue = ReturnType<UseSessionAccessor>
export type SessionData = UseSessionValue['data']
