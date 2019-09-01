import TicketModel, { Ticket } from "../entities/Ticket"

export interface PaginationOptions {
  first?: number
  after?: string
}

/**
 * Service responsible for querying and generating paginated results.
 */
class PaginationService {
  getPaginatedResults = async (
    userCriteria: Object,
    projection: Object,
    { first = 10, after }: PaginationOptions,
  ) => {
    const criteria = after
      ? {
          ...userCriteria,
          _id: {
            $gt: after, // Pagination core :)
          },
        }
      : userCriteria

    let tickets: Ticket[] = await TicketModel.find(criteria)
      .select(projection) // Uses projection to fetch only what we actually need
      .sort({ _id: 1 }) // Required in order to make pagination work
      .limit(first + 1) // Fetch one more entity on purpose, so we can know if there's next page
      .lean() // Returns POJOs, not documents {@see https://mongoosejs.com/docs/tutorials/lean.html}

    const hasNextPage = tickets.length > first
    if (hasNextPage) {
      // Removes the last element we have used to check next page
      tickets = tickets.slice(0, tickets.length - 1)
    }
    return {
      pageInfo: {
        hasNextPage,
      },
      edges: tickets.map(ticket => ({
        cursor: ticket._id.toString(),
        node: ticket,
      })),
    }
  }
}

export default new PaginationService()
