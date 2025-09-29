import { Title } from '@solidjs/meta'
import { A } from '@solidjs/router'
import { createSignal, Show } from 'solid-js'
import { AuthButtons } from '~/components/AuthButtons'
import { EmailPasswordAuth } from '~/components/EmailPasswordAuth'
import {
	Card,
	CardContent,
	CardHeader,
	CardDescription,
	CardTitle
} from '~/components/ui/card'
import { buttonVariants } from '~/components/ui/button'
import { useSessionSSR } from '~/lib/useSessionSSR'

export default function AuthPage() {
	const [mode, setMode] = createSignal<'sign-in' | 'sign-up'>('sign-in')

	return (
		<>
			<Title>Authenticate</Title>
			<AuthPageContent mode={mode()} onModeChange={setMode} />
		</>
	)
}

interface AuthPageContentProps {
	mode: 'sign-in' | 'sign-up'
	onModeChange: (mode: 'sign-in' | 'sign-up') => void
}

function AuthPageContent(props: AuthPageContentProps) {
	const session = useSessionSSR()

	const hasSession = () => Boolean(session()?.data)

	return (
		<section class="mx-auto flex max-w-lg flex-col gap-6">
			<header class="space-y-2 text-center">
				<h1 class="text-3xl font-bold tracking-tight">
					{props.mode === 'sign-in' ? 'Welcome back' : 'Create an account'}
				</h1>
				<p class="text-muted-foreground text-sm">
					{props.mode === 'sign-in'
						? 'Log in to continue exploring the starter kit.'
						: 'Sign up to personalize your experience and access your profile.'}
				</p>
			</header>

			<Show
				when={!hasSession()}
				fallback={
					<Card>
						<CardHeader class="space-y-2">
							<CardTitle>You are already signed in</CardTitle>
							<CardDescription>
								Head over to your profile to review your account details.
							</CardDescription>
						</CardHeader>
						<CardContent class="flex justify-center">
							<A href="/profile" class={buttonVariants({ variant: 'default' })}>
								Go to profile
							</A>
						</CardContent>
					</Card>
				}
			>
				<Card>
					<CardHeader class="space-y-2 text-left">
						<CardTitle>Email authentication</CardTitle>
						<CardDescription>
							Use your email and password to{' '}
							{props.mode === 'sign-in' ? 'log in' : 'create an account'}.
						</CardDescription>
					</CardHeader>
					<CardContent class="space-y-6">
						<AuthButtons />
						<div class="h-px bg-border" role="separator" />
						<EmailPasswordAuth
							mode={props.mode}
							onModeChange={props.onModeChange}
						/>
					</CardContent>
				</Card>
			</Show>
		</section>
	)
}
