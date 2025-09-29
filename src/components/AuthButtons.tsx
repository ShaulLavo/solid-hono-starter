import { createSignal } from 'solid-js'
import { signIn, signOut } from '~/lib/auth-client'
import { Button } from '~/components/ui/button'
import { GitHub } from './icons/Github'

export function AuthButtons() {
	const [loading, setLoading] = createSignal(false)

	const signInGithub = async () => {
		setLoading(true)
		try {
			await signIn.social({ provider: 'github' })
		} finally {
			setLoading(false)
		}
	}

	return (
		<div class="flex items-center gap-2">
			<Button onClick={signInGithub} disabled={loading()}>
				<GitHub />
				{loading() ? 'Redirecting…' : 'Sign in with GitHub'}
			</Button>
			<Button
				variant="outline"
				onClick={async () => {
					try {
						await signOut()
					} catch (e) {
						console.error(e)
					}
				}}
			>
				Sign out
			</Button>
		</div>
	)
}
