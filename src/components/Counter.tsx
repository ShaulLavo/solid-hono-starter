import { createEffect, createSignal } from 'solid-js'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from './ui/card'
import { cn } from '~/lib/utils'
import Minus from './icons/Minus'
import Plus from './icons/Plus'

interface CounterProps {
	initialValue?: number
	min?: number
	max?: number
}

export function Counter({
	initialValue = 0,
	min = Number.NEGATIVE_INFINITY,
	max = Number.POSITIVE_INFINITY
}: CounterProps) {
	const [count, setCount] = createSignal(initialValue)

	const decrement = () => {
		setCount(prev => Math.max(min, prev - 1))
	}

	const increment = () => {
		setCount(prev => Math.min(max, prev + 1))
	}

	return (
		<div class="flex items-center gap-4 py-4 w-fit">
			<Button
				variant="outline"
				size="icon"
				onClick={decrement}
				disabled={count() <= min}
				aria-label="Decrement"
			>
				<Minus />
			</Button>

			<span class="text-4xl font-bold tabular-nums min-w-[4ch] text-center">
				{count()}
			</span>

			<Button
				variant="outline"
				size="icon"
				onClick={increment}
				disabled={count() >= max}
				aria-label="Increment"
			>
				<Plus />
			</Button>
		</div>
	)
}
