// Client-side environment variables
// Use zod to validate, map VITE_ -> non-prefixed keys
import { z } from 'zod/v4'

const url = z.url()

const envSchema = z
	.object({
		VITE_BASE_URL: url
	})
	.transform(env => ({
		BASE_URL: env.VITE_BASE_URL
	}))

const env = envSchema.parse(import.meta.env)

export type ClientEnv = z.infer<typeof envSchema>
export default env
