import { spawn } from 'node:child_process'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import env from '~/env/server'
import { auth } from '~/lib/auth'
import { authMiddleware } from './middleware'
import { authRouter } from './routes/auth'
import { syncRouter } from './routes/sync'

const apiRouter = new Hono()
	.post('/echo', zValidator('json', z.object({ msg: z.string() })), async c => {
		const { msg } = c.req.valid('json')
		console.log(msg)
		return c.json({ echoed: msg }, 200)
	})
	.get('/accounts', async c => {
		const headers = c.req.raw.headers
		const session = await auth.api.getSession({ headers })
		if (!session?.session) return c.json({ error: 'UNAUTHORIZED' }, 401)
		const accounts = await auth.api.listUserAccounts({ headers })
		return c.json(accounts, 200)
	})

export type AppBindings = {
	Variables: {
		user: typeof import('~/lib/auth').auth.$Infer.Session.user | null
		session: typeof import('~/lib/auth').auth.$Infer.Session.session | null
	}
}

export const app = new Hono<AppBindings>()
	.basePath('/api')
	.use(
		'*',
		cors({
			origin: env.BASE_URL,
			allowHeaders: ['Content-Type', 'Authorization'],
			allowMethods: ['GET', 'POST', 'OPTIONS'],
			exposeHeaders: ['Content-Length'],
			credentials: true,
			maxAge: 600
		})
	)
	.use('*', authMiddleware)
	.route('/', apiRouter)
	.route('/auth', authRouter)
	.route('/sync', syncRouter)
	.notFound(c => c.text('Not Found :(', 404))

export type AppType = typeof app
