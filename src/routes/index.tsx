import { Title } from '@solidjs/meta'
import { onMount } from 'solid-js'
import { Counter } from '~/components/Counter'
import { WelcomeHeader } from '~/components/WelcomeHeader'
import { client } from '~/lib/hono'

export default function Home() {
	onMount(() => {
		client.api.echo.$post({ json: { msg: 'hello from client!' } })
	})

	return (
		<>
			<Title>Home</Title>
			<section class="space-y-8">
				<WelcomeHeader />
				<Counter />
			</section>
		</>
	)
}
