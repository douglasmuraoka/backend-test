import axios from "axios"
import axiosResponseHandler from "../helpers/axiosResponseHandler"
import RawTicket from "./model/RawTicket"
import TicketModel from "../entities/Ticket"
import transformGenres from "../helpers/transformGenres"
import { BONSAI_MAX_TICKETS, BONSAI_TICKETS_BATCH_SIZE } from "../settings"

const MOVIE_TICKETS_API_URL =
  "https://us-central1-bonsai-interview-endpoints.cloudfunctions.net/movieTickets"

/**
 * Service responsible for fetching data from external source (Bonsai),
 * handling any type of conversions to Ticket entity and persisting into the database.
 */
class BonsaiDataService {
  /**
   * Fetches tickets data in batches and returns promises, where each
   * promise will be resolved into an array of tickets data.
   *
   * Amount of tickets retrieved and batch size are configurable via application
   * settings.
   */
  public fetchTickets(
    tickets: number = BONSAI_MAX_TICKETS,
    batchSize: number = BONSAI_TICKETS_BATCH_SIZE,
  ): Promise<RawTicket[]>[] {
    const requests: Promise<RawTicket[]>[] = []
    for (let i = 0; i < tickets; i = Math.min(tickets, i + batchSize)) {
      requests.push(
        axios
          .get(MOVIE_TICKETS_API_URL, {
            params: { skip: i, limit: Math.min(batchSize, tickets - i) },
          })
          .then(axiosResponseHandler),
      )
    }
    return requests
  }

  /**
   * Filters any invalid RawTicket entry, converts valid ones to a valid Mongo document format,
   * persists them in batches, and returns the list of persisted Tickets.
   *
   * @param ticketsBatch List of promises that will be resolved to a batch of RawTicket
   */
  async initializeTicketsBatch(ticketsBatch: Promise<RawTicket[]>) {
    const documents: Object[] = (await ticketsBatch)
      // Filters any ticket with no sufficient data
      .filter(
        ({ title, price, inventory, date }) =>
          title !== null && price !== null && inventory !== null && date !== null,
      )
      // Maps Ticket to a Mongo document, to be inserted
      .map(({ title, genre, price, inventory, image, date }) => ({
        title,
        genre: transformGenres(genre),
        price,
        inventory,
        imageUrl: image || "N/A",
        date,
      }))

    // Insert in batches, so we can get better performance
    return TicketModel.insertMany(documents)
  }
}

export default new BonsaiDataService()
