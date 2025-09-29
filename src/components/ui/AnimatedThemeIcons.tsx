import { ColorMode } from '@kobalte/core'
import {
	Accessor,
	createEffect,
	createUniqueId,
	onCleanup,
	onMount
} from 'solid-js'
import { isServer } from 'solid-js/web'

let GSAP: GSAP = null!

type Theme = ColorMode

const iconProperties = {
	dark: { r: 9, rotate: 40, maskCx: 12, maskCy: 4, raysOpacity: 0 },
	light: { r: 5, rotate: 90, maskCx: 30, maskCy: 0, raysOpacity: 1 }
} as const satisfies Record<
	Theme,
	{
		r: number
		rotate: number
		maskCx: number
		maskCy: number
		raysOpacity: number
	}
>

const springDur = 0.5

type AnimatedThemeIconProps = {
	isDark: Accessor<boolean>
	isHovered: Accessor<boolean>
}

export function AnimatedThemeIcon(props: AnimatedThemeIconProps) {
	const maskId = createUniqueId().replace(/:/g, '')

	let svgEl: SVGSVGElement = null!
	let maskCircleEl: SVGCircleElement = null!
	let mainCircleEl: SVGCircleElement = null!
	let raysGroupEl: SVGGElement = null!

	onMount(async () => {
		if (!GSAP) {
			const mod = (await import('gsap')).default
			GSAP = mod
		}

		GSAP.set(svgEl, {
			transformOrigin: '50% 50%',
			rotate: (props.isDark() ? iconProperties.dark : iconProperties.light)
				.rotate
		})
		const { r, maskCx, maskCy, raysOpacity } = props.isDark()
			? iconProperties.dark
			: iconProperties.light

		GSAP.set(maskCircleEl, { attr: { cx: maskCx, cy: maskCy } })
		GSAP.set(mainCircleEl, { attr: { r } })
		GSAP.set(raysGroupEl, { opacity: raysOpacity })
	})

	createEffect(() => {
		const { r, rotate, maskCx, maskCy, raysOpacity } = props.isDark()
			? iconProperties.dark
			: iconProperties.light

		if (!GSAP) return
		GSAP.to(svgEl, { rotate, duration: springDur, ease: 'power3.out' })

		GSAP.to(maskCircleEl, {
			attr: { cx: maskCx, cy: maskCy },
			duration: springDur,
			ease: 'power3.out'
		})

		GSAP.to(mainCircleEl, {
			attr: { r },
			duration: springDur,
			ease: 'power3.out'
		})

		GSAP.to(raysGroupEl, {
			opacity: raysOpacity,
			duration: springDur,
			ease: 'power3.out'
		})
	})

	createEffect(() => {
		const width = props.isHovered() ? 2.7 : 2
		if (svgEl && GSAP) {
			GSAP.to(svgEl, {
				attr: { 'stroke-width': width },
				duration: 0.2,
				ease: 'power1.out'
			})
		}
	})

	onCleanup(() => {
		if (!isServer && GSAP && typeof GSAP.killTweensOf === 'function') {
			const els = [svgEl, maskCircleEl, mainCircleEl, raysGroupEl].filter(
				Boolean
			)
			if (els.length) GSAP.killTweensOf(els)
		}
	})

	return (
		<svg
			ref={el => (svgEl = el)}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			stroke="currentColor"
			fill="none"
			stroke-width={2}
			stroke-linecap="round"
			stroke-linejoin="round"
			class="relative h-[1.2rem] w-[1.2rem]"
		>
			<mask id={maskId}>
				<rect x="0" y="0" width="100%" height="100%" fill="white" />
				<circle
					ref={el => (maskCircleEl = el)}
					r={9}
					fill="black"
					cx={30}
					cy={0}
				/>
			</mask>
			<circle
				ref={el => (mainCircleEl = el)}
				cx="12"
				cy="12"
				fill="currentColor"
				mask={`url(#${maskId})`}
				r={5}
			/>
			<g ref={el => (raysGroupEl = el)} stroke="currentColor" opacity={1}>
				<line x1="12" y1="1" x2="12" y2="3" />
				<line x1="12" y1="21" x2="12" y2="23" />
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
				<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
				<line x1="1" y1="12" x2="3" y2="12" />
				<line x1="21" y1="12" x2="23" y2="12" />
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
				<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
			</g>
		</svg>
	)
}
