/* eslint-disable drizzle/enforce-delete-with-where */

import { faker } from '@faker-js/faker'
import chalk from 'chalk'

import { db } from './connection'
import { authLinks, orders, products, restaurants, users } from './schema'
import { orderItems } from './schema/order-items'

await db.delete(restaurants)
await db.delete(authLinks)
await db.delete(orderItems)
await db.delete(users)
await db.delete(orders)
await db.delete(products)

console.log(chalk.yellow('✔️ Dabatase reset!'))

await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: 'customer',
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: 'customer',
  },
])

console.log(chalk.cyan('✔️ Created customers!'))

const [restaurantManager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com',
      phone: faker.phone.number(),
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  })

console.log(chalk.cyan('✔️ Created manager!'))

await db.insert(restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: restaurantManager.id,
  },
])

console.log(chalk.cyan('✔️ Created restaurant!'))
console.log(chalk.green('✔️ Seeded successfully!'))
process.exit()
