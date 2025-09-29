import type { Component } from 'solid-js'
import { AuthButtons } from '~/components/AuthButtons'
import { EmailPasswordAuth } from '~/components/EmailPasswordAuth'
import { Card, CardContent } from './ui/card'

export const AuthSection: Component = () => {
	return (
		<CardContent class="rounded-lg border   p-4 shadow-sm">
			<h2 class="mb-3 text-base font-semibold">Authentication</h2>
			<AuthButtons />
			<div class="mt-3">
				<EmailPasswordAuth />
			</div>
		</CardContent>
	)
}
