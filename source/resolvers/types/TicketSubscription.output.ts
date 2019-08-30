import { Field, ObjectType } from "type-graphql"
import { Ticket } from "../../entities/Ticket"

@ObjectType()
export class TicketSubscription {
  @Field(() => [Ticket], { nullable: true })
  public tickets?: Ticket[]
}
export default TicketSubscription
