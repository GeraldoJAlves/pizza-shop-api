import { Elysia } from 'elysia'

import { env } from '../env'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)

app.listen(env.API_PORT, () => {
  console.log('🔥 Server started on ', env.API_BASE_URL)
})
