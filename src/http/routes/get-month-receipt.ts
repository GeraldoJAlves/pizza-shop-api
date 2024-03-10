import dayjs from 'dayjs'
import { and, eq, gte, sql, sum } from 'drizzle-orm'
import { Elysia } from 'elysia'

import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { auth } from '../auth'
import { UnauthorizedError } from '../errors/unauthorized-error'

export const getMonthReceipt = new Elysia()
  .use(auth)
  .get('/metrics/month-receipt', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfLastMonth = lastMonth.startOf('month')

    const monthReceipts = await db
      .select({
        monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        receipt: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfLastMonth.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

    const currentMonthWithYear = today.format('YYYY-MM')
    const lastMonthWithYear = lastMonth.format('YYYY-MM')

    const currentMonthReceipt = monthReceipts.find((monthReceipt) => {
      return monthReceipt.monthWithYear === currentMonthWithYear
    })

    const lastMonthReceipt = monthReceipts.find((monthReceipt) => {
      return monthReceipt.monthWithYear === lastMonthWithYear
    })

    const diffFromLastMonth =
      currentMonthReceipt && lastMonthReceipt
        ? (currentMonthReceipt.receipt / lastMonthReceipt.receipt) * 100
        : null

    return {
      receipt: currentMonthReceipt?.receipt || 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    }
  })
