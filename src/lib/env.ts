import { z } from 'zod/v4'

const nonEmpty = z.string().min(1)
const url = z.url()
const bool = z.stringbool().default(false)

const envSchema = z.object({
	DEBUG: bool,
	BETTER_AUTH_SECRET: nonEmpty,
	BETTER_AUTH_URL: url,
	BASE_URL: url,
	KV_URL: url,
	KV_REST_API_READ_ONLY_TOKEN: nonEmpty,
	REDIS_URL: url,
	KV_REST_API_TOKEN: nonEmpty,
	KV_REST_API_URL: url,
	OPENAI_API_KEY: nonEmpty,
	TURSO_DATABASE_URL: url,
	TURSO_AUTH_TOKEN: nonEmpty,
	GITHUB_CLIENT_ID: nonEmpty,
	GITHUB_CLIENT_SECRET: nonEmpty,
	RESEND_API_KEY: nonEmpty
})

const env = envSchema.parse(process.env)

export default env
