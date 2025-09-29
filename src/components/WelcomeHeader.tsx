import type { Component } from 'solid-js'
import { useSessionSSR } from '~/lib/useSessionSSR'

export const WelcomeHeader: Component = () => {
	const session = useSessionSSR()

	const greeting = () => {
		const { data } = session()
		if (!data) return 'Welcome'
		const name = data.user?.name?.trim()?.split(/\s+/)[0]
		const emailName = data.user?.email?.split('@')[0]
		return `Hello ${name || emailName || 'there'}!`
	}

	return (
		<section class="mb-8 space-y-3">
			<h1 class="text-3xl font-bold text-foreground  tracking-tight">
				{greeting()}
			</h1>
			<p class="text-sm text-muted-foreground">
				A tiny SolidStart + Hono starter with auth and RPC.
			</p>
		</section>
	)
}
