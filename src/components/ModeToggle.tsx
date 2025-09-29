import {
	createEffect,
	createSignal,
	onCleanup,
	onMount,
	createUniqueId,
	type Accessor
} from 'solid-js'
import { isServer } from 'solid-js/web'
import { Button, buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { useColorMode, ColorMode } from '@kobalte/core'
import { AnimatedThemeIcon } from './ui/AnimatedThemeIcons'

type Theme = ColorMode

function hasStartViewTransition(doc: Document): doc is Document & {
	startViewTransition: (cb: () => void) => { ready: Promise<void> }
} {
	return 'startViewTransition' in doc
}

export function ModeToggle() {
	const { colorMode, setColorMode } = useColorMode()

	const [localTheme, setLocalTheme] = createSignal<Theme>('light')
	const [isHovered, setIsHovered] = createSignal(false)

	let buttonEl: HTMLButtonElement = null!

	createEffect(() => {
		setLocalTheme(colorMode())
	})

	const handleToggle = async () => {
		const currentTheme = localTheme()
		const nextTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark'
		const target = buttonEl

		const applyTheme = () => {
			setLocalTheme(nextTheme)
			setColorMode(nextTheme)
		}

		if (!target || !hasStartViewTransition(document)) {
			applyTheme()
			return
		}

		const transition = document.startViewTransition(() => {
			applyTheme()
		})

		await transition.ready

		const { top, left, width, height } = target.getBoundingClientRect()
		const y = top + height / 2
		const x = left + width / 2

		const right = window.innerWidth - left
		const bottom = window.innerHeight - top
		const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom))

		document.documentElement.animate(
			{
				clipPath: [
					`circle(0px at ${x}px ${y}px)`,
					`circle(${maxRadius}px at ${x}px ${y}px)`
				]
			},
			{
				duration: 700,
				easing: 'ease-in-out',
				pseudoElement: '::view-transition-new(root)'
			}
		)
	}

	return (
		<Button
			ref={el => (buttonEl = el)}
			type="button"
			onClick={handleToggle}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onFocus={() => setIsHovered(true)}
			onBlur={() => setIsHovered(false)}
			class={cn(
				buttonVariants({ variant: 'default', size: 'icon' }),
				'relative h-9 w-9 transition-colors bg-black/10 text-black dark:bg-white/10 dark:text-white hover:bg-black/10 hover:dark:bg-white/10'
			)}
			aria-label="Toggle theme"
		>
			<AnimatedThemeIcon
				isDark={() => localTheme() === 'dark'}
				isHovered={isHovered}
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	)
}
