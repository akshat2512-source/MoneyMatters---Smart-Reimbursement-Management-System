import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// TODO: wire up routes
// import authRoutes     from './src/routes/auth.routes.js'
// import expenseRoutes  from './src/routes/expense.routes.js'
// import approvalRoutes from './src/routes/approval.routes.js'
// import adminRoutes    from './src/routes/admin.routes.js'
// app.use('/api/auth',      authRoutes)
// app.use('/api/expenses',  expenseRoutes)
// app.use('/api/approvals', approvalRoutes)
// app.use('/api/admin',     adminRoutes)

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server on port ${process.env.PORT || 5000}`)
)
