import { createAsync } from '@solidjs/router'
import type { JSX, ParentProps } from 'solid-js'
import { createContext, Suspense, useContext } from 'solid-js'
import type { SessionData } from '~/lib/auth-client'
import { getServerSession } from './getServerSession.server'

const SessionSSRContext = createContext<SessionData | undefined>(undefined)

export function SessionSSRProvider(props: {
	initial?: SessionData
	children: JSX.Element
}) {
	return (
		<SessionSSRContext.Provider value={props.initial}>
			{props.children}
		</SessionSSRContext.Provider>
	)
}

export function useSessionSSRInitial(): SessionData | undefined {
	return useContext(SessionSSRContext)
}

export function SessionBoundary(props: ParentProps) {
	const initialSession = createAsync(() => getServerSession(), {
		deferStream: true
	})

	return (
		<Suspense
			fallback={
				<div class="sr-only" aria-hidden="true" data-session-placeholder />
			}
		>
			<SessionSSRProvider initial={initialSession()}>
				{props.children}
			</SessionSSRProvider>
		</Suspense>
	)
}
