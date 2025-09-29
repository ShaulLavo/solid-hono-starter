import '@fontsource/geist'
import '@fontsource/geist-mono'
import geistMonoLatin400Woff2 from '@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff2?url'
import geistLatin400Woff2 from '@fontsource/geist/files/geist-latin-400-normal.woff2?url'
import {
	ColorModeProvider,
	ColorModeScript,
	cookieStorageManagerSSR
} from '@kobalte/core'
import { Link, MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import { isServer } from 'solid-js/web'
import { getCookie } from 'vinxi/http'
import { AppHeader } from '~/components/AppHeader'
import { SessionBoundary } from '~/lib/SessionSSRContext'
import './app.css'
// TODO add socket example
// TODO add real time reddis example or other reddis use case
//TODO add Observability (logging, error tracking).
//TODO vitest ?
// TODO  SEO
// TODO  File upload
// TODO  EMAIL
// TODO  Payments ??
//TODO correct font on the server?

function getThemeCookie() {
	'use server'
	const colorMode = getCookie('kb-color-mode')
	return colorMode ? `kb-color-mode=${colorMode}` : ''
}

export default function App() {
	const storageManager = cookieStorageManagerSSR(
		isServer ? getThemeCookie() : document.cookie
	)

	return (
		<Router
			root={props => (
				<MetaProvider>
					<Title>SolidStart - Basic</Title>
					<Link
						rel="preload"
						as="font"
						type="font/woff2"
						href={geistLatin400Woff2}
						crossorigin="anonymous"
					/>
					<Link
						rel="preload"
						as="font"
						type="font/woff2"
						href={geistMonoLatin400Woff2}
						crossorigin="anonymous"
					/>
					<ColorModeScript storageType={storageManager.type} />
					<ColorModeProvider storageManager={storageManager}>
						<SessionBoundary>
							<AppHeader />
							<main class="bg-background mx-auto max-w-5xl px-4 py-8">
								<Suspense>{props.children}</Suspense>
							</main>
						</SessionBoundary>
					</ColorModeProvider>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	)
}
