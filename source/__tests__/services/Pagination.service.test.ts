import mongoose from "mongoose"

import TicketModel, { Ticket } from "../../entities/Ticket"
import PaginationService from "../../services/Pagination.service"

describe("Pagination.service", () => {
  let t1: Ticket
  let t2: Ticket
  let t3: Ticket
  let t4: Ticket

  beforeAll(async () => {
    t1 = createTicket("Mortal Kombat", 19.99, 4, "mk", ["Action"], new Date())
    t2 = createTicket("LOL", 4.99, 1, "lol", ["Comedy", "Drama", "Romance"], new Date())
    t3 = createTicket(
      "Terminator",
      39.99,
      6,
      "terminator",
      ["Schwarzenegger", "I'll be back"],
      new Date(),
      "tt5817168",
    )
    t4 = createTicket(
      "Predator",
      29.99,
      4,
      "predator",
      ["Schwarzenegger", "Get to da choppa!"],
      new Date(),
      "tt0093773",
    )

    await mongoose.connect("mongodb://localhost:27019/test")

    // Creates in order for easier asserts
    await TicketModel.create(t1)
    await TicketModel.create(t2)
    await TicketModel.create(t3)
    await TicketModel.create(t4)
  })

  it("should find all paginated results", async () => {
    const { edges, pageInfo } = await PaginationService.getPaginatedResults({}, {}, {})
    expect(pageInfo.hasNextPage).toBeFalsy()
    expect(edges).toHaveLength(4)
    expect(edges[0].node.title).toBe(t1.title)
    expect(edges[1].node.title).toBe(t2.title)
    expect(edges[2].node.title).toBe(t3.title)
    expect(edges[3].node.title).toBe(t4.title)
  })

  it("should find paginated results and iterate", async () => {
    let res = await PaginationService.getPaginatedResults({}, {}, { first: 2 })
    expect(res.pageInfo.hasNextPage).toBeTruthy()
    expect(res.edges).toHaveLength(2)
    expect(res.edges[0].node.title).toBe(t1.title)
    expect(res.edges[1].node.title).toBe(t2.title)

    const lastTicket = res.edges[1].node._id
    res = await PaginationService.getPaginatedResults({}, {}, { after: lastTicket.toHexString() })
    expect(res.edges).toHaveLength(2)
    expect(res.edges[0].node.title).toBe(t3.title)
    expect(res.edges[1].node.title).toBe(t4.title)
  })

  it("should find results using projection", async () => {
    const { edges, pageInfo } = await PaginationService.getPaginatedResults(
      {},
      { title: 1 },
      { first: 1 },
    )
    expect(pageInfo.hasNextPage).toBeTruthy()
    Object.entries(edges[0].node).forEach(([key, value]) => {
      if (key === "_id" || key === "title") {
        expect(value).toBeDefined()
      } else {
        expect(value).toBeUndefined()
      }
    })
  })

  it("should find results using user criteria", async () => {
    const { edges, pageInfo } = await PaginationService.getPaginatedResults(
      { title: { $eq: "Terminator" } },
      {},
      { first: 1 },
    )
    expect(pageInfo.hasNextPage).toBeFalsy()
    expect(edges).toHaveLength(1)
    expect(edges[0].node.title).toBe("Terminator")
  })
})

// Helper function to create Tickets
const createTicket = (
  title: string,
  price: number,
  inventory: number,
  imageUrl: string,
  genre: string[],
  date: Date,
  movieId?: string,
): Ticket => {
  const ticket = new Ticket()
  ticket.title = title
  ticket.price = price
  ticket.inventory = inventory
  ticket.imageUrl = imageUrl
  ticket.genre = genre
  ticket.date = date
  ticket.movieId = movieId
  return ticket
}
