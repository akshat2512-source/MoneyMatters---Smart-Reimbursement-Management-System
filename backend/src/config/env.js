import dotenv from 'dotenv'
dotenv.config()
export const { PORT = 5000, JWT_SECRET, DATABASE_URL, EXCHANGE_RATE_API_KEY } = process.env
