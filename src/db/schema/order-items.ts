import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'

import { orders, products } from '.'

export const orderItems = pgTable('order_items', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  orderId: text('order_id')
    .references(() => orders.id)
    .notNull(),
  productId: text('product_id')
    .references(() => products.id)
    .notNull(),
  priceInCents: integer('price_in_cents').notNull(),
  quantity: integer('quantity').notNull(),
})

export const orderItemsRealations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
    relationName: 'order_item_order',
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
    relationName: 'order_item_product',
  }),
}))
