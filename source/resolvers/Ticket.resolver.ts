import { Arg, Args, Mutation, Query, Resolver, Subscription, Root } from "type-graphql"

import { AddTicketInput, TicketInput, ListTicketsInput } from "./types/Ticket.input"
import AsyncIterableObserver from "./AsyncIterableObserver"
import PagedResultFields from "./decorators/Fields"
import PaginationService from "../services/Pagination.service"
import MovieModel from "../entities/Movie"
import OMDbService from "../services/OMDb.service"
import PaginatedResults from "./types/PaginatedResults.output"
import TicketModel, { Ticket } from "../entities/Ticket"
import TicketService from "../services/Ticket.service"
import TicketSubscription from "./types/TicketSubscription.output"

@Resolver(() => Ticket)
export class TicketResolver {
  @Query(() => Ticket, { nullable: true, description: "Fetches a single Ticket by its ID" })
  public async ticket(@Arg("input") ticketInput: TicketInput): Promise<Ticket> {
    const ticket = await TicketModel.findById(ticketInput.id)
    if (!ticket) {
      throw new Error("No ticket found!")
    }
    return ticket
  }

  @Query(() => PaginatedResults, {
    description: `Fetches a list of Tickets with pagination.
Pagination can be controlled by setting the 'after' parameter with the cursor.
To navigate to the next page, set 'after' with the cursor of the latest node from the current query.`,
  })
  public async listTickets(
    @Args() { after, first, hasMovieData }: ListTicketsInput,
    @PagedResultFields() fields: string[],
  ): Promise<PaginatedResults> {
    let criteria
    if (hasMovieData !== undefined) {
      criteria = {
        movieId: hasMovieData
          ? {
              $gt: "", // Avoid using $exists since it costs way more
            }
          : { $eq: null },
      }
    } else {
      criteria = {}
    }
    // Since movie is not an attribute (movieId is), we need to transform it
    if (fields.includes("movie")) {
      fields.splice(fields.indexOf("movie"), 1)
      fields.push("movieId")
    }
    return await PaginationService.getPaginatedResults(criteria, fields, {
      after,
      first,
    })
  }

  @Mutation(() => Ticket, { description: "Persists a new single Ticket" })
  public async addTicket(@Arg("input") ticketInput: AddTicketInput): Promise<Ticket> {
    const ticket = new TicketModel(ticketInput)
    return ticket.saveFields()
  }

  @Subscription({
    subscribe: (): AsyncIterable<Ticket[]> => {
      // Returns an async iterable that will resolve data whenever a Ticket batch
      // was fetched from external sources and persisted into the database.
      const ticketDataAsyncIterable = new AsyncIterableObserver(
        TicketService.getTicketsInitObservable(),
      )

      // Cleans Ticket and Movie collection and then starts subscription, which will begin
      // providing values to async iterator
      Promise.all([TicketModel.deleteMany({}), MovieModel.deleteMany({})]).then(() => {
        // Subscribe to Ticket initialization, so that, once completed, starts
        // the Movie initialization
        ticketDataAsyncIterable.subscribe(OMDbService.initializeOMDbData)
      })
      return ticketDataAsyncIterable
    },
    description:
      "Initialize Tickets by fetching data from the Bonsai endpoint, and publishes Tickets batches as soon as they are persisted on the database.",
  })
  public initializeTickets(@Root() tickets: Ticket[]): TicketSubscription {
    return {
      tickets,
    }
  }
}
