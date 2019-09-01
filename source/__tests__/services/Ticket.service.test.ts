import { Observable } from "rxjs"

import BonsaiDataService from "../../services/BonsaiData.service"
import RawTicket from "../../services/model/RawTicket"
import TicketService from "../../services/Ticket.service"

describe("Ticket.service", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should have correct initial state", () => {
    expect(TicketService.initialized).toBeFalsy()
    expect(TicketService.ticketInitObservable).toBeUndefined()
    expect(TicketService.cachedTickets).toHaveLength(0)
    expect(TicketService.onValue).toBeUndefined()
    expect(TicketService.onError).toBeUndefined()
    expect(TicketService.onDone).toBeUndefined()
  })

  it("should invoke onValue and onDone", done => {
    const batch = Promise.resolve([
      {
        _id: {
          $oid: "5b8701a2fc13ae6569000097",
        },
        title: null,
        genre: null,
        price: null,
        inventory: null,
        image: null,
        date: null,
      },
    ])
    const batchPromises: Promise<RawTicket[]>[] = [batch]
    const fetchTicketsMock = jest.spyOn(BonsaiDataService, "fetchTickets").mockImplementation(
      (): Promise<RawTicket[]>[] => {
        return batchPromises
      },
    )
    const tickets = Promise.resolve([])
    const initializeTicketsBatchMock = jest
      .spyOn(BonsaiDataService, "initializeTicketsBatch")
      .mockImplementation(() => tickets)

    const onValueMock = jest.fn()
    onValueMock.bind = () => onValueMock

    const onErrorMock = jest.fn()
    const onDoneMock = jest.fn(() => {
      expect(fetchTicketsMock).toHaveBeenCalledTimes(1)
      expect(initializeTicketsBatchMock).toHaveBeenCalledTimes(1)
      expect(initializeTicketsBatchMock).toHaveBeenCalledWith(batch)

      expect(onValueMock).toHaveBeenCalledTimes(1)
      expect(onErrorMock).not.toHaveBeenCalled()
      done()
    })
    Observable.create = jest.fn(fn => {
      return {
        subscribe: () => {
          fn({ next: onValueMock, error: onErrorMock, complete: onDoneMock })
        },
      }
    })

    TicketService.getTicketsInitObservable().subscribe()
    expect(TicketService.initialized).toBeTruthy()
    expect(TicketService.onValue).toBeDefined()
    expect(TicketService.onError).toBeDefined()
    expect(TicketService.onDone).toBeDefined()
  })
})
