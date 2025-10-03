import { Hono } from 'hono'
import { isOfflineReplicaEnabled, syncReplica } from '~/db'
import type { AppBindings } from '../app'

export const syncRouter = new Hono<AppBindings>()
  .post('/', async c => {
    const session = c.get('session')
    if (!session) {
      return c.json({ error: 'UNAUTHORIZED' }, 401)
    }

    if (!isOfflineReplicaEnabled) {
      return c.json({ error: 'SYNC_DISABLED' }, 400)
    }

    try {
      await syncReplica('on-demand')
      return c.json({ status: 'SYNCED' }, 200)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown sync error'
      return c.json({ error: 'SYNC_FAILED', message }, 500)
    }
  })
