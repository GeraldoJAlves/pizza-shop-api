import { createId } from '@paralleldrive/cuid2'
import { Elysia, t } from 'elysia'
import nodemailer from 'nodemailer'

import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'
import { env } from '../../env'
import { mail } from '../../lib/mail'

export const sendAuthLink = new Elysia().post(
  '/auth-links',
  async ({ body, set }) => {
    const { email } = body

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    set.status = 'No Content'
    if (!user) {
      return
    }

    const authLinkCode = createId()

    await db.insert(authLinks).values({
      code: authLinkCode,
      userId: user.id,
    })

    const url = new URL('/auth-links/authenticate', env.API_BASE_URL)

    url.searchParams.set('code', authLinkCode)
    url.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    const info = await mail.sendMail({
      from: {
        name: 'Pizza shop',
        address: 'hi@pizzashop.com',
      },
      to: email,
      subject: 'Authenticate to Pizza Shop',
      text: `Use the following link to authenticate on Pizza Shop: ${url.toString()}`,
      html: `<div><p>Use the following link to authenticate on Pizza Shop: <a href="${url.toString()}">Authenticate</a> <div>`,
    })

    console.log('auth link', url.toString())
    console.log('email link', nodemailer.getTestMessageUrl(info))
  },
  {
    body: t.Object({
      email: t.String({ format: 'email', default: '' }),
    }),
  },
)
