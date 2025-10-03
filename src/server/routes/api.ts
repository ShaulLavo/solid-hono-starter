import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { auth } from '~/lib/auth'
import { log } from '~/lib/log'
import { dispatchLog, LOG_METHODS } from '~/lib/logger'

export const apiRouter = new Hono()
	.post('/echo', zValidator('json', z.object({ msg: z.string() })), async c => {
		const { msg } = c.req.valid('json')
		log(msg)
		return c.json({ echoed: msg }, 200)
	})
	.post(
		'/log',
		zValidator(
			'json',
			z
				.object({
					message: z.string().min(1),
					method: z.enum(LOG_METHODS).default('info'),
					data: z.record(z.string(), z.unknown()).optional(),
					source: z.enum(['client', 'server']).optional()
				})
				.strict()
		),
		async c => {
			// const payload = c.req.valid('json')
			// const meta: Record<string, unknown> = {}
			// if (payload.source) meta.source = payload.source
			// if (payload.data) Object.assign(meta, payload.data)
			// const extraArgs = Object.keys(meta).length > 0 ? [meta] : []
			// dispatchLog(payload.method, payload.message, ...extraArgs)
			return c.json({ ok: true }, 200)
		}
	)
	.get('/accounts', async c => {
		const headers = c.req.raw.headers
		const session = await auth.api.getSession({ headers })
		if (!session?.session) return c.json({ error: 'UNAUTHORIZED' }, 401)
		const accounts = await auth.api.listUserAccounts({ headers })
		return c.json(accounts, 200)
	})
