import axios from "axios"
import axiosResponseHandler from "../helpers/axiosResponseHandler"
import bluebird from "bluebird"
import MovieModel, { Movie } from "../entities/Movie"
import { OMDB_API_KEY } from "../settings"
import OMDbData, { OMDbResponse } from "./model/OMDb.model"
import stripSecondaryTitleNames from "../helpers/stripSecondaryTitleNames"
import TicketModel, { Ticket } from "../entities/Ticket"
import transformOmdbDataToMovie from "../helpers/transformOmdbDataToMovie"

const OMDB_API_URL = "http://www.omdbapi.com/"

/**
 * Service responsible for fetching and handling data fetched from OMDb API.
 * It also populates Movie collection by using fetched data.
 */
class OMDbService {
  /**
   * Fetches, parses and persists Movie data from OMDb.
   * It also updates Ticket with the Movie ID they are related to.
   */
  initializeOMDbData = async () => {
    // Using projection since we just need the title...
    const tickets = await TicketModel.find({}, { title: 1 })

    // For each term, fetches a movie by its title
    const termList: string[] = tickets.map(ticket => stripSecondaryTitleNames(ticket.title))
    const omdbData: OMDbResponse[] = await bluebird.map(
      termList,
      term =>
        // Promise wrapper to avoid breaking the entire iteration
        // when some request fails.
        new Promise(resolve => {
          this.fetchByTitle(term)
            .then(resolve)
            .catch(err => {
              resolve({ Response: "False", Error: err } as OMDbResponse)
            })
        }),
      {
        concurrency: 10,
      },
    )

    const moviesNotFound: Ticket[] = []
    const moviesToPersist: Movie[] = []

    tickets.forEach((ticket, idx) => {
      const response = omdbData[idx]
      if (response.Response === "True") {
        const data: OMDbData = response as OMDbData
        try {
          const movie: Movie = transformOmdbDataToMovie(data)
          moviesToPersist.push(movie)

          // Sets the movieId on Ticket
          ticket.movieId = movie.imdbID
          ticket.save() // No reason to be sync here
        } catch (err) {
          console.error("Error while transforming OMDb data:", err)
        }
      } else {
        moviesNotFound.push(ticket)
      }
    })
    // Still need to do something with the movies not found

    // Inserts all Movies at once
    await MovieModel.insertMany(moviesToPersist)
  }

  /**
   * Fetches OMDb data by the movie title.
   *
   * @param title The movie title
   */
  public fetchByTitle(title: string): Promise<OMDbResponse> {
    return axios
      .get(OMDB_API_URL, {
        params: {
          apikey: OMDB_API_KEY,
          t: title,
          type: "movie",
        },
      })
      .then(axiosResponseHandler)
  }
}

export default new OMDbService()
