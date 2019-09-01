import transformOmdbDataToMovie, {
  toDate,
  toFloat,
  toInt,
} from "../../helpers/transformOmdbDataToMovie"
import { Rating } from "../../entities/Movie"

describe("transformOmdbDataToMovie()", () => {
  describe("toDate", () => {
    test("valid date", () => expect(toDate("15 Jan 2014") instanceof Date).toBeTruthy())
    test("invalid date", () => expect(toDate("foo")).toEqual(null))
  })

  describe("toInt", () => {
    test("positive integer", () => expect(toInt("124")).toBe(124))
    test("negative integer", () => expect(toInt("-14")).toBe(-14))
    test("float value", () => expect(toInt("2.5")).toBe(2))
  })

  describe("toFloat", () => {
    test("positive float", () => expect(toFloat("4.19")).toBe(4.19))
    test("negative float", () => expect(toFloat("-9.459")).toBe(-9.459))
  })

  describe("transformOmdbDataToMovie", () => {
    test("complete movie data", () => {
      const result = transformOmdbDataToMovie({
        Title: "Guardians of the Galaxy Vol. 2",
        Year: "2017",
        Rated: "PG-13",
        Released: "05 May 2017",
        Runtime: "136 min",
        Genre: "Action, Adventure, Comedy, Sci-Fi",
        Director: "James Gunn",
        Writer: "James Gunn, Dan Abnett",
        Actors: "Chris Pratt, Zoe Saldana, Dave Bautista, Vin Diesel",
        Plot: "The Guardians struggle...",
        Language: "English",
        Country: "USA",
        Awards: "Nominated for 1 Oscar. Another 12 wins & 42 nominations.",
        Poster: "https://poster.jpg",
        Ratings: [
          {
            Source: "Internet Movie Database",
            Value: "7.6/10",
          },
          {
            Source: "Rotten Tomatoes",
            Value: "84%",
          },
          {
            Source: "Metacritic",
            Value: "67/100",
          },
        ],
        Metascore: "67",
        imdbRating: "7.6",
        imdbVotes: "496,865",
        imdbID: "tt3896198",
        Type: "movie",
        DVD: "22 Aug 2017",
        BoxOffice: "$389,804,217",
        Production: "Walt Disney Pictures",
        Website: "https://marvel.com/guardians",
        Response: "True",
      })

      expect(result.released instanceof Date).toBeTruthy()
      expect(result.dvdReleased instanceof Date).toBeTruthy()
      delete result.released
      delete result.dvdReleased

      expect(result).toEqual({
        title: "Guardians of the Galaxy Vol. 2",
        year: 2017,
        rated: "PG-13",
        runtime: 136,
        genre: ["Action", "Adventure", "Comedy", "Sci-Fi"],
        director: "James Gunn",
        writers: ["James Gunn", "Dan Abnett"],
        actors: ["Chris Pratt", "Zoe Saldana", "Dave Bautista", "Vin Diesel"],
        plot: "The Guardians struggle...",
        language: "English",
        country: "USA",
        awards: ["Nominated for 1 Oscar", "Another 12 wins & 42 nominations"],
        posterUrl: "https://poster.jpg",
        ratings: [
          {
            source: "Internet Movie Database",
            value: "7.6/10",
          } as Rating,
          {
            source: "Rotten Tomatoes",
            value: "84%",
          } as Rating,
          {
            source: "Metacritic",
            value: "67/100",
          } as Rating,
        ],
        metascore: 67,
        imdbRating: 7.6,
        imdbVotes: 496865,
        imdbID: "tt3896198",
        boxOffice: 389804217,
        production: "Walt Disney Pictures",
        website: "https://marvel.com/guardians",
      })
    })

    test("incomplete movie data", () => {
      const result = transformOmdbDataToMovie({
        Title: "Abyss: The Greatest Proposal Ever",
        Year: "2014",
        Rated: "N/A",
        Released: "N/A",
        Runtime: "21 min",
        Genre: "Short, Drama",
        Director: "Nicole Ayers",
        Writer: "Nicole Ayers (story), Nicole Ayers",
        Actors: "Rodney Benson, Carlo Campbell, Michael Gaudioso, Mike Gaudioso",
        Plot: "Abyss is a candid...",
        Language: "English",
        Country: "USA",
        Awards: "N/A",
        Poster: "N/A",
        Ratings: [],
        Metascore: "N/A",
        imdbRating: "N/A",
        imdbVotes: "N/A",
        imdbID: "tt3057526",
        Type: "movie",
        DVD: "N/A",
        BoxOffice: "N/A",
        Production: "N/A",
        Website: "N/A",
        Response: "True",
      })

      expect(result).toEqual({
        title: "Abyss: The Greatest Proposal Ever",
        year: 2014,
        rated: null,
        released: null,
        runtime: 21,
        genre: ["Short", "Drama"],
        director: "Nicole Ayers",
        writers: ["Nicole Ayers (story)", "Nicole Ayers"],
        actors: ["Rodney Benson", "Carlo Campbell", "Michael Gaudioso", "Mike Gaudioso"],
        plot: "Abyss is a candid...",
        language: "English",
        country: "USA",
        awards: null,
        posterUrl: null,
        ratings: null,
        metascore: null,
        imdbRating: null,
        imdbVotes: null,
        imdbID: "tt3057526",
        dvdReleased: null,
        boxOffice: null,
        production: null,
        website: null,
      })
    })
  })
})
