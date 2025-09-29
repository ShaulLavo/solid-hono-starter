import { Title } from '@solidjs/meta'
import { User } from '~/components/UserProfile'

export default function Profile() {
	return (
		<>
			<Title>Profile</Title>
			<section class="space-y-6">
				<header class="space-y-2">
					<h1 class="text-3xl font-bold tracking-tight">Your Profile</h1>
					<p class="text-muted-foreground text-sm">
						Review your account details and linked information.
					</p>
				</header>
				<User />
			</section>
		</>
	)
}
