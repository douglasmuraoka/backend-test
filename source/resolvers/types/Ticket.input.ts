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
  @Field(() => Int, { nullable: true })
  public first: number

  @Field({ nullable: true })
  public hasMovieData: boolean

  @Field({ nullable: true })
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
