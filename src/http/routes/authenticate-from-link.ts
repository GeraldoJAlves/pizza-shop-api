import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'

import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'
import { auth } from '../auth'

export const authenticateFromLink = new Elysia().use(auth).get(
  'auth-links/authenticate',
  async ({ params, set, jwt, setCookie }) => {
    const { code, redirect } = params

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })

    set.status = 'No Content'
    if (!authLinkFromCode) {
      return
    }

    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createdAt,
      'days',
    )

    if (daysSinceAuthLinkWasCreated > 7) {
      await db.delete(authLinks).where(eq(authLinks.code, code))
      return
    }

    const restaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId)
      },
    })

    const token = await jwt.sign({
      sub: authLinkFromCode.userId,
      restaurantId: restaurant?.id,
    })

    setCookie('auth', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    await db.delete(authLinks).where(eq(authLinks.code, code))

    set.redirect = redirect
  },
  {
    params: t.Object({
      code: t.String(),
      redirect: t.String({ format: 'uri' }),
    }),
  },
)
