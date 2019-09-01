import { ObjectId } from "mongodb"
import { Field, Float, Int, ObjectType } from "type-graphql"
import {
  arrayProp as ArrayProperty,
  instanceMethod as InstanceMethod,
  InstanceType,
  ModelType,
  prop as Property,
  staticMethod as StaticMethod,
  Typegoose,
} from "typegoose"
import MovieModel, { Movie } from "./Movie"

@ObjectType()
export class Ticket extends Typegoose {
  @StaticMethod
  public static findById(this: ModelType<Ticket>, _id: any) {
    return this.findOne({ _id })
  }

  @Field()
  public readonly _id: ObjectId

  @Field()
  @Property({ required: true })
  public title: string

  @Field(() => [String])
  @ArrayProperty({ items: String, default: [] })
  public genre: string[]

  @Field(() => Float)
  @Property({ required: true })
  public price: number

  @Field(() => Int)
  @Property({ required: true })
  public inventory: number

  @Field()
  @Property({ required: true })
  public imageUrl: string

  @Field()
  @Property({ required: true })
  public date: Date

  @Property()
  public movieId?: string

  @Field(() => Movie, { name: "movie", nullable: true })
  async movie() {
    return this.movieId ? await MovieModel.findOne({ imdbID: { $eq: this.movieId } }) : null
  }

  @InstanceMethod
  public saveFields(this: InstanceType<Ticket>) {
    // Inventory should always be at least 0
    this.inventory = Math.max(this.inventory || 0, 0)
    return this.save()
  }
}

export const TicketModel = new Ticket().getModelForClass(Ticket)

export default TicketModel
