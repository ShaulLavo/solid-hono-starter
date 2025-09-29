import { getRequestEvent } from 'solid-js/web'
import { auth } from '~/lib/auth'
import {
	Router,
	Route,
	redirect,
	RoutePreloadFuncArgs,
	query
} from '@solidjs/router'

export type ServerSession =
	| typeof import('~/lib/auth').auth.$Infer.Session
	| null

export const getServerSession = query(async (): Promise<ServerSession> => {
	'use server'
	const ev = getRequestEvent()
	if (!ev) return null
	const res = await auth.api.getSession({ headers: ev.request.headers })
	return res
}, 'getServerSession')

export const checkAuth = query(
	async (): Promise<NonNullable<ServerSession>> => {
		'use server'

		const ev = getRequestEvent()
		if (!ev) throw redirect('/')

		try {
			const res = await auth.api.getSession({ headers: ev.request.headers })
			if (!res || !res.session || !res.user) {
				throw redirect('/auth')
			}
			return res
		} catch (error) {
			if (error instanceof Response) throw error
			throw redirect('/')
		}
	},
	'checkAuth'
)
