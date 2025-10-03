import { createLogger } from 'isomorphic-rslog'
import { isServer } from 'solid-js/web'

export const LOG_METHODS = [
	'log',
	'info',
	'warn',
	'error',
	'success',
	'ready',
	'debug',
	'start'
] as const

export type LogMethod = (typeof LOG_METHODS)[number]

export const logger = createLogger({
	level: 'log',
	labels: {
		warn: 'Warn',
		error: 'Error',
		success: 'Success',
		info: 'Info',
		ready: 'Ready',
		debug: 'Debug',
		start: 'Start'
	}
})

export type LoggableArgs = [message: string, ...rest: unknown[]]

const hasSource = (
	value: unknown
): value is { source?: 'client' | 'server' } => {
	if (typeof value !== 'object' || value === null) return false
	const maybeSource = (value as { source?: unknown }).source
	return typeof maybeSource === 'string'
}

const resolveOrigin = (args: unknown[]): 'Client' | 'Server' => {
	for (const arg of args) {
		if (hasSource(arg)) {
			if (arg.source === 'client') return 'Client'
			if (arg.source === 'server') return 'Server'
		}
	}
	return isServer ? 'Server' : 'Client'
}

export const dispatchLog = (method: LogMethod, ...args: LoggableArgs) => {
	const [message, ...rest] = args
	const handler = logger[method] ?? logger.info
	handler(message, ...rest)
}
