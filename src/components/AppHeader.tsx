import { A } from '@solidjs/router'
import { Show, createEffect, createSignal } from 'solid-js'
import { unwrap } from 'solid-js/store'
import { ModeToggle } from '~/components/ModeToggle'
import { Button, buttonVariants } from '~/components/ui/button'
import { signOut } from '~/lib/auth-client'
import { useSessionSSR } from '~/lib/useSessionSSR'

export function AppHeader() {
	const session = useSessionSSR()
	const hasSession = () => Boolean(session()?.data)
	const [signingOut, setSigningOut] = createSignal(false)

	const handleSignOut = async () => {
		if (signingOut()) return
		setSigningOut(true)
		try {
			await signOut()
		} catch (error) {
			console.error('Failed to sign out', error)
		} finally {
			setSigningOut(false)
		}
	}
	console.log('hasSession', hasSession())
	createEffect(() => {
		console.log('session data:', unwrap(session().data))
		console.log('hasSession', hasSession())
	})
	return (
		<header class="bg-background backdrop-blur">
			<div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
				<A href="/" class="font-semibold text-foreground hover:opacity-80">
					solid-hono-starter
				</A>
				<div class="flex items-center gap-4">
					<nav class="flex items-center gap-4 text-sm">
						<A
							href="/"
							activeClass="text-foreground"
							class="text-muted-foreground hover:text-foreground"
						>
							Home
						</A>
						<A
							href="/profile"
							activeClass="text-foreground"
							class="text-muted-foreground hover:text-foreground"
						>
							Profile
						</A>
						<A
							href="/auth"
							activeClass="text-foreground"
							class="text-muted-foreground hover:text-foreground"
						>
							Auth
						</A>
					</nav>
					<div class="flex items-center gap-3">
						<ModeToggle />
						<Show
							when={hasSession()}
							fallback={
								<A href="/auth" class={buttonVariants({ size: 'sm' })}>
									Log in
								</A>
							}
						>
							<Button
								size="sm"
								variant="secondary"
								onClick={handleSignOut}
								disabled={signingOut()}
							>
								{signingOut() ? 'Signing out...' : 'Log out'}
							</Button>
						</Show>
					</div>
				</div>
			</div>
		</header>
	)
}
