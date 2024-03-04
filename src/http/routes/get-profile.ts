import { Elysia } from 'elysia'

import { db } from '../../db/connection'
import { auth } from '../auth'

export const getProfile = new Elysia()
  .use(auth)
  .get('/me', async ({ getCurrentUser, set }) => {
    const { userId } = await getCurrentUser()

    if (!userId) {
      return
    }

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId)
      },
    })

    if (!user) {
      set.status = 'Not Found'
    }

    return user
  })
