import OMDbData from "../services/model/OMDb.model"
import { Movie, Rating } from "../entities/Movie"
import transformGenres from "./transformGenres"

export const toInt = (str: string): number => Number.parseInt(str.replace(",", ""))
export const toFloat = (str: string): number => Number.parseFloat(str)
export const toDate = (str: string): Date | null => {
  const date = Date.parse(str)
  return Number.isNaN(date) ? null : new Date(date)
}
export const checkNA = (str: string, transform?: Function) =>
  str === "N/A" ? null : transform ? transform(str) : str

const transformOmdbDataToMovie = (data: OMDbData): Movie => {
  const movie = new Movie()
  movie.title = data.Title
  movie.year = data.Year ? toInt(data.Year) : null
  movie.rated = checkNA(data.Rated)
  movie.released = checkNA(data.Released, toDate)
  movie.runtime = data.Runtime === "N/A" ? null : toInt(data.Runtime.split(" ")[0])
  movie.genre = transformGenres(data.Genre, ",")
  movie.director = data.Director
  movie.writers = data.Writer.split(", ")
  movie.actors = data.Actors.split(", ")
  movie.plot = data.Plot
  movie.language = data.Language
  movie.country = data.Country
  movie.awards =
    data.Awards === "N/A"
      ? null
      : data.Awards.split(".")
          .map(award => award.trim())
          .filter(award => award)
  movie.posterUrl = checkNA(data.Poster)
  movie.ratings =
    data.Ratings.length === 0
      ? null
      : data.Ratings.map(({ Source, Value }) => {
          const rating = new Rating()
          rating.source = Source
          rating.value = Value
          return rating
        })
  movie.metascore = checkNA(data.Metascore, toInt)
  movie.imdbRating = checkNA(data.imdbRating, toFloat)
  movie.imdbVotes = checkNA(data.imdbVotes, toInt)
  movie.imdbID = data.imdbID
  movie.dvdReleased = checkNA(data.DVD, toDate)
  movie.boxOffice =
    data.BoxOffice === "N/A" ? null : Number.parseInt(data.BoxOffice.replace(/\D/g, ""))
  movie.production = checkNA(data.Production)
  movie.website = checkNA(data.Website)
  return movie
}

export default transformOmdbDataToMovie
