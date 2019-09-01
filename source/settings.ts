export const BONSAI_MAX_TICKETS = 1000
export const BONSAI_TICKETS_BATCH_SIZE = 100

export const PORT = (process.env.PORT && Number.parseInt(process.env.PORT)) || 4000

export const {
  OMDB_API_KEY,
  MONGO_HOST = "localhost",
  MONGO_PORT = 27017,
  MONGO_DB = "bonsai-backend-test",
} = process.env
