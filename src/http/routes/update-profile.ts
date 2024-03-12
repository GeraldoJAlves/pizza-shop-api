import { eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'

import { db } from '../../db/connection'
import { restaurants } from '../../db/schema'
import { auth } from '../auth'
import { UnauthorizedError } from '../errors/unauthorized-error'

export const updateProfile = new Elysia().use(auth).put(
  '/profile',
  async ({ body, getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const { name, description } = body

    await db
      .update(restaurants)
      .set({
        name,
        description,
      })
      .where(eq(restaurants.id, restaurantId))
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.String(),
    }),
  },
)
