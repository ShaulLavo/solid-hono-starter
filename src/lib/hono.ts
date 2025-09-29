import { hc } from 'hono/client'
import env from '~/env/client'
import type { AppType } from '~/server/app'

export const client = hc<AppType>(env.BASE_URL, {
	fetch: ((input, init) => {
		return fetch(input, {
			...init,
			credentials: 'include'
		})
	}) satisfies typeof fetch
})
