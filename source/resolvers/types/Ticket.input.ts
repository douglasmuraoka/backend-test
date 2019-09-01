import { ObjectId } from "mongodb"
import { ArgsType, Field, Float, InputType, Int } from "type-graphql"

import { Ticket } from "../../entities/Ticket"

@InputType()
export class TicketInput {
  @Field()
  public id: ObjectId
}

@ArgsType()
export class ListTicketsInput {
  @Field(() => Int, { nullable: true, description: "The amount of Tickets to be fetched" })
  public first: number

  @Field({
    nullable: true,
    description: "True if you wish to fetch only Tickets with Movie data, false otherwise",
  })
  public hasMovieData: boolean

  @Field({
    nullable: true,
    description:
      "The cursor of the latest Ticket from the previous query. Sets this cursor as the starting point to execute the query.",
  })
  public after: string
}

@InputType()
export class AddTicketInput implements Partial<Ticket> {
  @Field()
  public title: string

  @Field(() => [String])
  public genre: string[]

  @Field(() => Float)
  public price: number

  @Field(() => Int)
  public inventory: number

  @Field()
  public imageUrl: string

  @Field()
  public date: Date
}
