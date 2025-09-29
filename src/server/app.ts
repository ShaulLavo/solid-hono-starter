import { Hono } from 'hono'
import { cors } from 'hono/cors'
import env from '~/env/server'
import { authMiddleware } from './middleware'
import { apiRouter } from './routes/api'
import { authRouter } from './routes/auth'

export const app = new Hono<{
	Variables: {
		user: typeof import('~/lib/auth').auth.$Infer.Session.user | null
		session: typeof import('~/lib/auth').auth.$Infer.Session.session | null
	}
}>()
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
	.notFound(c => c.text('Not Found :(', 404))

export type AppType = typeof app
