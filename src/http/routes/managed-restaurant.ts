import { Elysia, NotFoundError } from 'elysia'

import { db } from '../../db/connection'
import { auth } from '../auth'

export const managedRestaurant = new Elysia()
  .use(auth)
  .get('/managed-restaurant', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new NotFoundError()
    }

    const restaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    if (!restaurant) {
      throw new NotFoundError()
    }

    return restaurant
  })
