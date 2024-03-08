import { Elysia } from 'elysia'

import { env } from '../env'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { getOrderDetails } from './routes/get-order-details'
import { getOrders } from './routes/get-orders'
import { getProfile } from './routes/get-profile'
import { managedRestaurant } from './routes/managed-restaurant'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'
import { signOut } from './routes/sign-out'

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(managedRestaurant)
  .use(getOrders)
  .use(getOrderDetails)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = error.status
        return error.message
      }
      case 'NOT_FOUND': {
        set.status = 'Not Found'
        return {
          code: 404,
        }
      }
      default: {
        console.log(error.message)
        set.status = 'Internal Server Error'
        return {
          code: 500,
        }
      }
    }
  })

app.listen(env.API_PORT, () => {
  console.log('🔥 Server started on ', env.API_BASE_URL)
})
