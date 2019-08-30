import { Arg, Mutation, Query, Resolver, Subscription, Root } from "type-graphql"

import { AddTicketInput, ListTicketsInput, TicketInput } from "./types/Ticket.input"
import AsyncIterableObserver from "./AsyncIterableObserver"
import TicketModel, { Ticket } from "../entities/Ticket"
import TicketService from "../services/Ticket.service"
import TicketSubscription from "./types/TicketSubscription.output"

@Resolver(() => Ticket)
export class TicketResolver {
  @Query(() => Ticket, { nullable: true })
  public async ticket(@Arg("input") ticketInput: TicketInput): Promise<Ticket> {
    const ticket = await TicketModel.findById(ticketInput.id)
    if (!ticket) {
      throw new Error("No ticket found!")
    }
    return ticket
  }

  @Query(() => [Ticket])
  public async listTickets(@Arg("input") input: ListTicketsInput): Promise<Ticket[]> {
    const tickets = await TicketModel.find({})
    const result = tickets
      .filter(ticket => ticket.date.getTime() < input.cursor.getTime())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, input.limit)
    return result
  }

  @Mutation(() => Ticket)
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
      // Cleans Ticket collection and then starts subscription, which will begin
      // providing values to async iterator
      TicketModel.deleteMany({}).then(() => {
        ticketDataAsyncIterable.subscribe()
      })
      return ticketDataAsyncIterable
    },
  })
  public initializeTickets(@Root() tickets: Ticket[]): TicketSubscription {
    return {
      tickets,
    }
  }
}
