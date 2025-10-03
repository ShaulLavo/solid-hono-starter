import { z } from 'zod/v4'

const nonEmpty = z.string().min(1)
const url = z.url()
const bool = z.stringbool().default(false)
const localReplicaUrl = z
	.string()
	.min(1)
	.default('file:./turso-local.db')
	.transform(value => (value.startsWith('file:') ? value : `file:${value}`))
	.pipe(z.string().min(1))
const syncIntervalMs = z.coerce.number().int().min(0).default(60_000)
const boolTrue = z.stringbool().default(false)

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
	TURSO_SYNC_URL: url.optional(),
	TURSO_AUTH_TOKEN: nonEmpty,
	TURSO_EMBEDDED_DATABASE_URL: localReplicaUrl,
	TURSO_SYNC_INTERVAL_MS: syncIntervalMs,
	TURSO_BOOTSTRAP_SYNC: boolTrue,
	TURSO_OFFLINE_MODE: z.stringbool().default(false),
	GITHUB_CLIENT_ID: nonEmpty,
	GITHUB_CLIENT_SECRET: nonEmpty,
	RESEND_API_KEY: nonEmpty
}).transform(env => ({
	...env,
	TURSO_SYNC_URL: env.TURSO_SYNC_URL ?? env.TURSO_DATABASE_URL
}))

const env = envSchema.parse(process.env)
export type ServerEnv = z.infer<typeof envSchema>
export default env
