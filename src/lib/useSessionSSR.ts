import { Accessor, createMemo, onMount } from 'solid-js'
import { isServer } from 'solid-js/web'
import type { UseSessionValue } from '~/lib/auth-client'
import { authClient } from '~/lib/auth-client'
import { useSessionSSRInitial } from '~/lib/SessionSSRContext'

let hydrated = false
export function useSessionSSR(): Accessor<UseSessionValue> {
	const session = authClient.useSession()
	const initial = useSessionSSRInitial()

	const stub = () => ({
		data: initial ?? null,
		error: null,
		isPending: false,
		isRefetching: false
	})

	if (isServer) {
		return () => stub()
	}

	onMount(() => {
		hydrated = true
	})

	return createMemo(() => {
		const s = session()
		if (hydrated) return s
		if (s?.data) return s
		return stub()
	})
}
