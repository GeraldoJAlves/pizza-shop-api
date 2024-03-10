import { Elysia } from 'elysia'

import { env } from '../env'
import { approveOrder } from './routes/approve-order'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { cancelOrder } from './routes/cancel-order'
import { deliverOrder } from './routes/deliver-order'
import { dispatchOrder } from './routes/dispatch-order'
import { getDailyReceiptInPeriod } from './routes/get-daily-receipt-in-period'
import { getMonthOrdersAmount } from './routes/get-month-orders-amount'
import { getMonthReceipt } from './routes/get-month-receipt'
import { getOrderDetails } from './routes/get-order-details'
import { getOrders } from './routes/get-orders'
import { getPopularProducts } from './routes/get-popular-products'
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
  .use(approveOrder)
  .use(cancelOrder)
  .use(deliverOrder)
  .use(dispatchOrder)
  .use(getDailyReceiptInPeriod)
  .use(getMonthReceipt)
  .use(getPopularProducts)
  .use(getMonthOrdersAmount)
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
