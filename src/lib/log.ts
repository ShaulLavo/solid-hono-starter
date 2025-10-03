import { client } from '~/lib/hono'
import { dispatchLog, type LogMethod } from '~/lib/logger'

type LogMetadata = Record<string, unknown>

const resolveSource = () =>
	typeof window === 'undefined' ? 'server' : 'client'

const send = async (method: LogMethod, message: string, data?: LogMetadata) => {
	const source = resolveSource()
	const meta = data ? { ...data, source } : { source }
	dispatchLog(method, message, meta)

	client.api.log
		.$post({
			json: {
				method,
				message,
				source,
				data
			}
		})
		.catch(() => {
			console.log('sending logs failed, lol who cares')
		})
}

export type LogFunction = {
	(message: string, data?: LogMetadata): void
	info: (message: string, data?: LogMetadata) => void
	warn: (message: string, data?: LogMetadata) => void
	error: (message: string, data?: LogMetadata) => void
	success: (message: string, data?: LogMetadata) => void
	ready: (message: string, data?: LogMetadata) => void
	debug: (message: string, data?: LogMetadata) => void
	log: (message: string, data?: LogMetadata) => void
	start: (message: string, data?: LogMetadata) => void
}

const createLogFunction = (): LogFunction => {
	const base = (message: string, data?: LogMetadata) =>
		send('log', message, data)
	base.info = (message: string, data?: LogMetadata) =>
		send('info', message, data)
	base.warn = (message: string, data?: LogMetadata) =>
		send('warn', message, data)
	base.error = (message: string, data?: LogMetadata) =>
		send('error', message, data)
	base.success = (message: string, data?: LogMetadata) =>
		send('success', message, data)
	base.ready = (message: string, data?: LogMetadata) =>
		send('ready', message, data)
	base.debug = (message: string, data?: LogMetadata) =>
		send('debug', message, data)
	base.log = (message: string, data?: LogMetadata) => send('log', message, data)
	base.start = (message: string, data?: LogMetadata) =>
		send('start', message, data)
	return base
}

export const log = createLogFunction()
