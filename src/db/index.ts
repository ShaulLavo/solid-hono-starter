import { createClient } from '@libsql/client'
import { existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { drizzle } from 'drizzle-orm/libsql'
import env from '~/env/server'

type SyncTrigger = 'bootstrap' | 'interval' | 'manual' | 'on-demand'

const resolveReplicaPath = (fileUrl: string): string => {
  if (fileUrl.startsWith('file:')) {
    try {
      return fileURLToPath(fileUrl)
    } catch {
      const fallback = fileUrl.slice('file:'.length)
      return path.isAbsolute(fallback) ? fallback : path.resolve(process.cwd(), fallback)
    }
  }

  return path.isAbsolute(fileUrl) ? fileUrl : path.resolve(process.cwd(), fileUrl)
}

const replicaArtifacts = ['', '-wal', '-shm', '-journal', '-lock', '-metadata', '.metadata', '-libsql', '-info']

const cleanupReplicaArtifacts = (basePath: string) => {
  for (const suffix of replicaArtifacts) {
    const target = suffix === '' ? basePath : `${basePath}${suffix}`
    if (suffix === '' && !existsSync(target)) continue
    if (!existsSync(target)) continue
    try {
      rmSync(target, { force: true })
    } catch {
      // Best-effort cleanup; ignore removal errors
    }
  }
}

const createReplicaClient = () => {
  const config = {
    url: env.TURSO_EMBEDDED_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
    syncUrl: env.TURSO_SYNC_URL,
    syncInterval: env.TURSO_SYNC_INTERVAL_MS === 0 ? undefined : env.TURSO_SYNC_INTERVAL_MS,
    offline: true
  } as const

  const tryInstantiate = () => createClient(config)

  try {
    return { client: tryInstantiate(), mode: 'replica' as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message.includes('metadata file does not')) {
      const replicaPath = resolveReplicaPath(env.TURSO_EMBEDDED_DATABASE_URL)
      cleanupReplicaArtifacts(replicaPath)
      console.warn('[turso] Replica metadata missing. Removed local files and retrying instantiation.')
      return { client: tryInstantiate(), mode: 'replica' as const }
    }
    throw error
  }
}

const createRemoteClient = () => ({
  client: createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN
  }),
  mode: 'remote' as const
})

const desiredOffline = env.TURSO_OFFLINE_MODE

let tursoClientInit: ReturnType<typeof createReplicaClient | typeof createRemoteClient>

try {
  tursoClientInit = desiredOffline ? createReplicaClient() : createRemoteClient()
} catch (error) {
  if (!desiredOffline) throw error
  const fallback = createRemoteClient()
  tursoClientInit = fallback
  console.warn('[turso] Failed to initialize embedded replica; falling back to remote client:', error)
}

const tursoClient = tursoClientInit.client
const offlineReplicaActive = tursoClientInit.mode === 'replica'

let syncInFlight: Promise<void> | null = null

const runSync = (trigger: SyncTrigger): Promise<void> => {
  if (!offlineReplicaActive) {
    return Promise.reject(new Error('Turso offline replica is not active'))
  }

  if (!syncInFlight) {
    const startedAt = Date.now()
    syncInFlight = tursoClient
      .sync()
      .then(() => {
        if (env.DEBUG) {
          console.info(`[turso] sync (${trigger}) completed in ${Date.now() - startedAt}ms`)
        }
      })
      .catch(error => {
        if (env.DEBUG) {
          console.error(`[turso] sync (${trigger}) failed`, error)
        }
        throw error
      })
      .finally(() => {
        syncInFlight = null
      })
  } else if (env.DEBUG) {
    console.info(`[turso] sync (${trigger}) skipped; another sync is running`)
  }

  return syncInFlight ?? Promise.resolve()
}

if (offlineReplicaActive && env.TURSO_BOOTSTRAP_SYNC) {
  try {
    await runSync('bootstrap')
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error while bootstrapping Turso sync'
    console.warn(`[turso] bootstrap sync failed: ${message}. Continuing in offline mode.`)
  }
}

if (offlineReplicaActive && env.TURSO_SYNC_INTERVAL_MS > 0) {
  const timer = setInterval(() => {
    void runSync('interval').catch(() => undefined)
  }, env.TURSO_SYNC_INTERVAL_MS)

  if (typeof timer.unref === 'function') {
    timer.unref()
  }
}

export const db = drizzle({ client: tursoClient })
export const turso = tursoClient
export const syncReplica = (reason: Exclude<SyncTrigger, 'interval' | 'bootstrap'> = 'manual') =>
  runSync(reason)
export const isOfflineReplicaEnabled = offlineReplicaActive
