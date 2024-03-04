import { Elysia } from 'elysia'

import { db } from '../../db/connection'
import { auth } from '../auth'

export const managedRestaurant = new Elysia()
  .use(auth)
  .get('/managed-restaurant', async ({ getCurrentUser, set }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      set.status = 'Not Found'
      return
    }

    const restaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    if (!restaurant) {
      set.status = 'Not Found'
      return
    }

    return restaurant
  })
