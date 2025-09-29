import { A as Link } from '@solidjs/router'
import { createEffect, createSignal, Show } from 'solid-js'
import { authClient } from '~/lib/auth-client'
import { Button } from '~/components/ui/button'
import {
	TextField,
	TextFieldInput,
	TextFieldLabel
} from '~/components/ui/TextField'

type Mode = 'sign-in' | 'sign-up'

export interface EmailPasswordAuthProps {
	mode?: Mode
	onModeChange?: (mode: Mode) => void
}

export function EmailPasswordAuth(props: EmailPasswordAuthProps) {
	const [internalMode, setInternalMode] = createSignal<Mode>(
		props.mode ?? 'sign-in'
	)
	const mode = () => props.mode ?? internalMode()
	const [email, setEmail] = createSignal('')
	const [password, setPassword] = createSignal('')
	const [name, setName] = createSignal('')
	const [rememberMe, setRememberMe] = createSignal(true)
	const [loading, setLoading] = createSignal(false)
	const [error, setError] = createSignal<string | null>(null)
	const [message, setMessage] = createSignal<string | null>(null)

	const setMode = (next: Mode) => {
		if (mode() === next) return
		props.onModeChange?.(next)
		if (props.mode === undefined) {
			setInternalMode(next)
		}
	}

	createEffect(() => {
		const currentMode = mode()
		setError(null)
		setMessage(null)
		if (currentMode === 'sign-in') {
			setName('')
		}
	})

	const callbackURL = () => {
		try {
			return new URL('/', window.location.origin).toString()
		} catch {
			return '/'
		}
	}

	const placeholderImage = 'https://www.gravatar.com/avatar?d=mp'

	const onSubmit = async (e: Event) => {
		e.preventDefault()
		setLoading(true)
		setError(null)
		setMessage(null)
		try {
			if (mode() === 'sign-in') {
				const { error } = await authClient.signIn.email({
					email: email().trim(),
					password: password(),
					rememberMe: rememberMe(),
					callbackURL: callbackURL()
				})
				if (error) throw error
				setMessage('Signed in successfully.')
			} else {
				const { error } = await authClient.signUp.email({
					name: name().trim() || 'User',
					email: email().trim(),
					password: password(),
					image: placeholderImage,
					callbackURL: callbackURL()
				})
				if (error) throw error
				setMessage('Account created. You are now signed in.')
			}
			setPassword('')
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Something went wrong'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	const handleSwitch = (next: Mode) => (event: MouseEvent) => {
		event.preventDefault()
		setMode(next)
	}

	return (
		<div class="space-y-4">
			<form onSubmit={onSubmit} class="space-y-4">
				<Show when={mode() === 'sign-up'}>
					<TextField value={name()} onChange={setName} class="gap-1">
						<TextFieldLabel class="text-sm font-medium text-foreground">
							Name
						</TextFieldLabel>
						<TextFieldInput
							type="text"
							placeholder="John Doe"
							autocomplete="name"
						/>
					</TextField>
				</Show>

				<TextField value={email()} onChange={setEmail} class="gap-1">
					<TextFieldLabel class="text-sm font-medium text-foreground">
						Email
					</TextFieldLabel>
					<TextFieldInput
						type="email"
						required
						placeholder="john.doe@example.com"
						autocomplete="email"
					/>
				</TextField>

				<TextField value={password()} onChange={setPassword} class="gap-1">
					<TextFieldLabel class="text-sm font-medium text-foreground">
						Password
					</TextFieldLabel>
					<TextFieldInput
						type="password"
						required
						minLength={8}
						placeholder={
							mode() === 'sign-in' ? 'Your password' : 'At least 8 characters'
						}
						autocomplete={
							mode() === 'sign-in' ? 'current-password' : 'new-password'
						}
					/>
				</TextField>

				<Show when={mode() === 'sign-in'}>
					<TextField class="flex-row items-center gap-2 text-sm text-muted-foreground">
						<TextFieldInput
							type="checkbox"
							checked={rememberMe()}
							onChange={e => setRememberMe(e.currentTarget.checked)}
							class="h-4 w-4 !rounded !border !px-0 !py-0 !ring-0"
						/>
						<TextFieldLabel class="font-normal">Remember me</TextFieldLabel>
					</TextField>
				</Show>

				<div class="flex flex-col gap-3 pt-1">
					<Button type="submit" disabled={loading()}>
						{loading()
							? 'Working...'
							: mode() === 'sign-in'
							? 'Sign in'
							: 'Sign up'}
					</Button>
					<p class="text-xs text-muted-foreground">
						Callback to {callbackURL()}
					</p>
				</div>
			</form>

			<Show when={mode() === 'sign-in'}>
				<p class="text-sm text-muted-foreground">
					Don't have an account?{' '}
					<Link
						href="/signup"
						class="font-medium text-primary hover:underline"
						onClick={handleSwitch('sign-up')}
					>
						Sign up here
					</Link>
				</p>
			</Show>
			<Show when={mode() === 'sign-up'}>
				<p class="text-sm text-muted-foreground">
					Already have an account?{' '}
					<Link
						href="/login"
						class="font-medium text-primary hover:underline"
						onClick={handleSwitch('sign-in')}
					>
						Login here
					</Link>
				</p>
			</Show>

			<Show when={error()}>
				<p class="text-sm text-destructive">{error()}</p>
			</Show>
			<Show when={message()}>
				<p class="text-sm text-green-600">{message()}</p>
			</Show>
		</div>
	)
}

export type EmailPasswordAuthMode = Mode
