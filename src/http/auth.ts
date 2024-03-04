import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt'
import { Elysia, type Static, t } from 'elysia'

import { env } from '../env'

const jwtPayloadSchema = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayloadSchema,
    }),
  )
  .use(cookie())
  .derive(({ jwt, setCookie, removeCookie, cookie, set }) => {
    return {
      async signUser(payload: Static<typeof jwtPayloadSchema>) {
        const token = await jwt.sign(payload)

        setCookie('auth', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        })
      },
      signOut() {
        removeCookie('auth')
      },
      async getCurrentUser() {
        const payload = await jwt.verify(cookie.auth)

        if (!payload) {
          set.status = 'Unauthorized'
          return {}
        }

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        }
      },
    }
  })
