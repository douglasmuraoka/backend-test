import axios from "axios"
import BonsaiDataService from "../BonsaiData.service"
import TicketModel from "../../entities/Ticket"

const MOVIE_TICKETS_API_URL =
  "https://us-central1-bonsai-interview-endpoints.cloudfunctions.net/movieTickets"

describe("BonsaiData.service", () => {
  describe("fetchTickets", () => {
    afterAll(() => {
      jest.resetAllMocks()
    })

    it("should fetch with right params", () => {
      const getMock = jest.spyOn(axios, "get")

      const promises = BonsaiDataService.fetchTickets(655, 654)
      expect(promises).toHaveLength(2)

      expect(getMock).toHaveBeenCalledTimes(2)
      expect(getMock.mock.calls[0]).toEqual([
        MOVIE_TICKETS_API_URL,
        { params: { skip: 0, limit: 654 } },
      ])
      expect(getMock.mock.calls[1]).toEqual([
        MOVIE_TICKETS_API_URL,
        { params: { skip: 654, limit: 1 } },
      ])
    })
  })

  describe("initializeTicketsBatch", () => {
    afterAll(() => {
      jest.resetAllMocks()
    })

    it("should convert and persist documents", async () => {
      const sampleData = Promise.resolve([
        {
          _id: {
            $oid: "5b8701a1fc13ae6569000000",
          },
          title: "Long Live Death (Viva la muerte)",
          genre: "Drama|War",
          price: 28.704,
          inventory: 4,
          image: null,
          date: "2017-09-27T05:06:56Z",
        },
        {
          _id: {
            $oid: "000000000000000000000000",
          },
          title: "Foo Bar",
          genre: "Comedy|Adventure",
          price: 99.999,
          inventory: 9,
          image: "http://foo.bar",
          date: "2019-08-30T00:31:490Z",
        },
        {
          _id: {
            $oid: "000000000000000000000001",
          },
          title: null,
          genre: "Comedy|Adventure",
          price: 99.999,
          inventory: 9,
          image: "http://foo.bar",
          date: "2019-08-30T00:31:490Z",
        },
        {
          _id: {
            $oid: "000000000000000000000002",
          },
          title: "Invalid Price",
          genre: "Comedy|Adventure",
          price: null,
          inventory: 9,
          image: "http://foo.bar",
          date: "2019-08-30T00:31:490Z",
        },
        {
          _id: {
            $oid: "000000000000000000000003",
          },
          title: "Invalid Inventory",
          genre: "Comedy|Adventure",
          price: 99.999,
          inventory: null,
          image: "http://foo.bar",
          date: "2019-08-30T00:31:490Z",
        },
        {
          _id: {
            $oid: "000000000000000000000004",
          },
          title: "Invalid Date",
          genre: "Comedy|Adventure",
          price: 99.999,
          inventory: 9,
          image: "http://foo.bar",
          date: null,
        },
      ])

      const insertManyMock = jest.spyOn(TicketModel, "insertMany").mockImplementation()

      await BonsaiDataService.initializeTicketsBatch(sampleData)

      expect(insertManyMock).toHaveBeenCalledTimes(1)
      expect(insertManyMock).toHaveBeenCalledWith([
        {
          title: "Long Live Death (Viva la muerte)",
          genre: ["Drama", "War"],
          price: 28.704,
          inventory: 4,
          imageUrl: "N/A",
          date: "2017-09-27T05:06:56Z",
        },
        {
          title: "Foo Bar",
          genre: ["Comedy", "Adventure"],
          price: 99.999,
          inventory: 9,
          imageUrl: "http://foo.bar",
          date: "2019-08-30T00:31:490Z",
        },
      ])
    })
  })
})
