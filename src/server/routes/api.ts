import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { auth } from '~/lib/auth'

export const apiRouter = new Hono()
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
