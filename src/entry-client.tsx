// @refresh reload
import { mount, StartClient } from '@solidjs/start/client'

mount(() => {
	console.log('client: StartClient mount')
	return <StartClient />
}, document.getElementById('app')!)
