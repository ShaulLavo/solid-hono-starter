import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '~/db'
import env from '~/env/server'
import * as schema from '~/db/schema'

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	basePath: '/api/auth',
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema
	}),
	emailAndPassword: {
		enabled: true
	},
	account: {
		accountLinking: {
			enabled: false
		}
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,

			scopes: ['user:email']
		}
	}
})
