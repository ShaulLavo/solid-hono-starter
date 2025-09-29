import { Context, Next } from 'hono'
import { auth } from '~/lib/auth'

export const authMiddleware = async (c: Context, next: Next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers
	})

	c.set('user', session?.user ?? null)
	c.set('session', session?.session ?? null)
	return next()
}
