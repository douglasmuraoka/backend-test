import { Observable } from "rxjs"
import { Ticket } from "../entities/Ticket"
import BonsaiDataService from "./BonsaiData.service"

/**
 * Service responsible for fetching, initializing and storing into the database,
 * and publishing Tickets to subscribers as soon as they are ready to use.
 */
class TicketService {
  initialized: boolean = false
  ticketInitObservable: Observable<Ticket[]>
  cachedTickets: Ticket[] = []

  onValue: Function
  onError: Function
  onDone: Function

  /**
   * Creates (if needed) and returns the Ticket initialization observable.
   *
   * The observable is responsible for publishing arrays of Tickets as soon
   * as they are fetched, initialized, and persisted into the database.
   */
  public getTicketsInitObservable(): Observable<Ticket[]> {
    // If ticket is not yet initialized...
    if (!this.ticketInitObservable) {
      this.ticketInitObservable = Observable.create(
        (observer: { error: Function; next: Function; complete: Function }) => {
          // If this is the first subscriber, starts processing
          // Tickets data
          if (!this.initialized) {
            this.onValue = observer.next.bind(observer)
            this.onError = observer.error.bind(observer)
            this.onDone = observer.complete.bind(observer)
            this.initializeTicketProcessing()
          }
          // Late subscribers won't lose any data! :)
          else {
            console.log("Serving cached tickets...", this.cachedTickets)
            observer.next(this.cachedTickets)
          }
        },
      )
    }

    return this.ticketInitObservable
  }

  /**
   * Tickets data pipeline.
   * Fetch -> Initialize (validation, persistence)
   *
   * Once all promises are resolved, invokes "onDone".
   */
  private initializeTicketProcessing() {
    // This flag is needed to avoid running this code
    // whenever we get a new subscriber
    this.initialized = true

    Promise.all(
      BonsaiDataService.fetchTickets().map(async batch => {
        try {
          const tickets = await BonsaiDataService.initializeTicketsBatch(batch)

          // Caches Tickets, so next subscribers will receive this
          // entire array at once
          this.cachedTickets.push(...tickets)

          // Publishes Tickets to subscribers
          this.onValue(tickets)
        } catch (err) {
          console.error(err)
          this.onError(err)
        }
      }),
    ).then(() => {
      console.log("Tickets initialization DONE!")
      this.onDone()
    })
  }
}

export default new TicketService()
