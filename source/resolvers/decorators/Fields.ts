import graphqlFields from "graphql-fields"
import { createParamDecorator } from "type-graphql"
import { GraphQLResolveInfo } from "graphql"

/**
 * Custom decoration function to retrieve the selected fields from
 * GraphQL query info.
 * Required in order to set MongoDB query projection.
 */
export default function PagedResultFields(): ParameterDecorator {
  return createParamDecorator(
    ({ info }: { info: GraphQLResolveInfo }): string[] => {
      const fields = graphqlFields(info as any)
      return Object.keys(fields.edges.node)
    },
  )
}
