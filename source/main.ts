import { ApolloServer } from "apollo-server"
import { ObjectId } from "mongodb"
import { connect } from "mongoose"
import * as path from "path"
import "reflect-metadata"
import { buildSchema } from "type-graphql"

import { ObjectIdScalar } from "./objectId.scalar"
import resolvers from "./resolvers"
import typegooseMiddleware from "./typegooseMiddleware"
import { MONGO_HOST, MONGO_PORT, MONGO_DB, PORT } from "./settings"

export const MONGODB_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`

const main = async () => {
  try {
    await connect(
      MONGODB_URI,
      { useNewUrlParser: true },
    )
  } catch (mongoConnectError) {
    console.error(mongoConnectError)
  }
  try {
    const schema = await buildSchema({
      resolvers,
      emitSchemaFile: path.resolve(__dirname, "schema.gql"),
      globalMiddlewares: [typegooseMiddleware],
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    })
    const server = new ApolloServer({ schema, context: {} })
    const { url } = await server.listen(PORT)
    console.log(`GraphQL Playground running at ${url}`)
  } catch (apolloError) {
    console.error(apolloError)
  }
}

main()
