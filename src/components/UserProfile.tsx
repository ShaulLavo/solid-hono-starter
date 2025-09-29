import { Show, Suspense } from 'solid-js'
import { isServer } from 'solid-js/web'
import { useSessionSSR } from '~/lib/useSessionSSR'
import { Card, CardContent, CardHeader } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import Clock from './icons/Clock'
import Calendar from './icons/Calendar'
import Mail from './icons/Mail'
import Check from './icons/Check'

export function User() {
	const session = useSessionSSR()
	const user = () => session().data?.user
	const hasSession = () => Boolean(session()?.data)
	return (
		<Card class="mb-8">
			<CardContent class="p-4 border  rounded-lg text-left">
				<h2 class="text-lg font-semibold mb-2">User Data</h2>
				<Show
					when={hasSession()}
					fallback="Sign in to view your linked accounts."
				>
					<Suspense
						fallback={<p class="text-sm text-gray-500">Loading account…</p>}
					>
						<div>rendered on: {isServer ? 'server' : 'client'}</div>
						<Show
							when={user()}
							fallback={
								<p class="text-sm text-gray-600">No linked accounts yet.</p>
							}
						>
							<UserProfile user={user()} />
						</Show>
					</Suspense>
				</Show>
			</CardContent>
		</Card>
	)
}

type User =
	| {
			id: string
			createdAt: Date
			updatedAt: Date
			email: string
			emailVerified: boolean
			name: string
			image?: string | null
	  }
	| undefined

interface UserProfileProps {
	user: User
}

export function UserProfile({ user }: UserProfileProps) {
	if (!user) {
		return (
			<Card class="w-full max-w-2xl">
				<CardContent class="flex items-center justify-center py-12">
					<p class="text-muted-foreground">No user data available</p>
				</CardContent>
			</Card>
		)
	}

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date)
	}

	return (
		<Card class="w-full max-w-2xl">
			<CardHeader class="pb-4">
				<div class="flex items-start gap-6">
					<Avatar class="h-24 w-24 border-2 border-primary/20">
						<AvatarImage src={user.image ?? undefined} alt={user.name} />
						<AvatarFallback class="bg-primary/10 text-primary text-2xl font-semibold">
							{getInitials(user.name)}
						</AvatarFallback>
					</Avatar>

					<div class="flex-1 space-y-2">
						<div class="flex items-center gap-3">
							<h2 class="text-3xl font-bold tracking-tight text-balance">
								{user.name}
							</h2>
							{user.emailVerified && (
								<Badge
									variant="secondary"
									class="bg-primary/10 text-primary hover:bg-primary/20 gap-1"
								>
									<Check class="h-3.5 w-3.5" />
									Verified
								</Badge>
							)}
						</div>

						<div class="flex items-center gap-2 text-muted-foreground">
							<Mail class="h-4 w-4" />
							<span class="text-sm">{user.email}</span>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent class="space-y-6">
				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2 rounded-lg border bg-muted/30 p-4">
						<div class="flex items-center gap-2 text-muted-foreground">
							<Calendar class="h-4 w-4" />
							<span class="text-sm font-medium">Account Created</span>
						</div>
						<p class="text-sm font-mono text-foreground">
							{formatDate(user.createdAt)}
						</p>
					</div>

					<div class="space-y-2 rounded-lg border bg-muted/30 p-4">
						<div class="flex items-center gap-2 text-muted-foreground">
							<Clock class="h-4 w-4" />
							<span class="text-sm font-medium">Last Updated</span>
						</div>
						<p class="text-sm font-mono text-foreground">
							{formatDate(user.updatedAt)}
						</p>
					</div>
				</div>

				<div class="space-y-2 rounded-lg border bg-muted/30 p-4">
					<span class="text-sm font-medium text-muted-foreground">User ID</span>
					<p class="text-sm font-mono text-foreground break-all">{user.id}</p>
				</div>
			</CardContent>
		</Card>
	)
}
