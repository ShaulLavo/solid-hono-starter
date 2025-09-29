import type { JSX } from 'solid-js'

const Plus = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M5 12h14M12 5v14" />
	</svg>
)

export default Plus
