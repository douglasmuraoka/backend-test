import { Field, ObjectType } from "type-graphql"
import { Ticket } from "../../entities/Ticket"

@ObjectType()
class PageInfo {
  @Field()
  public hasNextPage: boolean
}

@ObjectType()
class Edge {
  @Field()
  public cursor: string

  @Field(() => Ticket)
  public node: Ticket
}

/**
 * Output type for Ticket paginated results (Relay style).
 *
 * Sample:
 *  {
      pageInfo: {
        hasNextPage,
      },
      edges: {
        cursor: <last_ticket_id>,
        node: {
          ...ticket
        }
      }
    }
 */
@ObjectType()
export class PaginatedResults {
  @Field(() => PageInfo)
  public pageInfo: PageInfo

  @Field(() => [Edge])
  public edges?: Edge[]
}

export default PaginatedResults
