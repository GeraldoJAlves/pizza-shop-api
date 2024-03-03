import { Elysia } from 'elysia'

const app = new Elysia().get('/', () => {
  return 'pizza-shop'
})

app.listen(3333, () => {
  console.log('Server started on http://localhost::3333')
})
