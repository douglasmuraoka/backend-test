import { arrayProp as ArrayProperty, prop as Property, Typegoose } from "typegoose"
import { Field, Float, Int, ObjectType } from "type-graphql"
import { ObjectId } from "mongodb"

@ObjectType()
export class Rating {
  @Field()
  public source: string

  @Field()
  public value: string
}

@ObjectType()
export class Movie extends Typegoose {
  @Field()
  public readonly _id: ObjectId

  @Field()
  @Property({ required: true })
  public title: string

  @Field(() => Int)
  @Property({ required: true })
  public year: number

  @Field(() => String, { nullable: true })
  @Property()
  public rated: string | null

  @Field(() => Date, { nullable: true })
  @Property()
  public released: Date | null

  @Field(() => Int, { nullable: true })
  @Property()
  public runtime: number | null // in minutes

  @Field(() => [String])
  @ArrayProperty({ items: String })
  public genre: string[]

  @Field()
  @Property({ required: true })
  public director: string

  @Field(() => [String])
  @ArrayProperty({ items: String })
  public writers: string[]

  @Field(() => [String])
  @ArrayProperty({ items: String })
  public actors: string[]

  @Field()
  @Property({ required: true })
  public plot: string

  @Field()
  @Property({ required: true })
  public language: string

  @Field()
  @Property({ required: true })
  public country: string

  @Field(() => [String], { nullable: true })
  @ArrayProperty({ items: String })
  public awards: string[] | null

  @Field(() => String, { nullable: true })
  @Property()
  public posterUrl: string | null

  @Field(() => [Rating], { nullable: true })
  @ArrayProperty({ items: Rating })
  public ratings: Rating[] | null

  @Field(() => Int, { nullable: true })
  @Property()
  public metascore: number | null

  @Field(() => Float, { nullable: true })
  @Property()
  public imdbRating: number | null

  @Field(() => Int, { nullable: true })
  @Property()
  public imdbVotes: number | null

  @Field()
  @Property({ required: true })
  public imdbID: string

  @Field(() => Date, { nullable: true })
  @Property()
  public dvdReleased: Date | null

  @Field(() => Int, { nullable: true })
  @Property()
  public boxOffice: number | null

  @Field(() => String, { nullable: true })
  @Property()
  public production: string | null

  @Field(() => String, { nullable: true })
  @Property()
  public website: string | null
}

export const MovieModel = new Movie().getModelForClass(Movie)

export default MovieModel
