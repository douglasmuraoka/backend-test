/**
 * Representation of raw Ticket data, retrieved from Bonsai endpoint.
 *
 * Sample:
 * {
      "_id": {
        "$oid": "5b8701a1fc13ae6569000000"
      },
      "title": "Long Live Death (Viva la muerte)",
      "genre": "Drama|War",
      "price": 28.704,
      "inventory": 4,
      "image": "http://dummyimage.com/1459x751.png/cc0000/ffffff",
      "date": "2017-09-27T05:06:56Z"
    }
 */
export default interface RawTicket {
  _id: {
    $oid: string
  }

  title: string | null

  genre: string | null

  price: number | null

  inventory: number | null

  image: string | null

  date: string | null
}
