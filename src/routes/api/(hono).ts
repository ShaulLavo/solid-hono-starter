import type { APIEvent } from '@solidjs/start/server'
import { app } from '~/server/app'

export const GET = ({ request }: APIEvent) => app.fetch(request)
export const POST = ({ request }: APIEvent) => app.fetch(request)
