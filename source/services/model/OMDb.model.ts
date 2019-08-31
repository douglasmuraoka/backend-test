export interface OMDbResponse {
  Response: string
}

export interface EmptyOMDbResponse extends OMDbResponse {
  Error: string
}

export interface Rating {
  Source: string

  Value: string
}

/**
 * Representation of raw Movie data, retrieved from OMDb.
 *
 * Sample:
 * {
    "Title": "Guardians of the Galaxy Vol. 2",
    "Year": "2017",
    "Rated": "PG-13",
    "Released": "05 May 2017",
    "Runtime": "136 min",
    "Genre": "Action, Adventure, Comedy, Sci-Fi",
    "Director": "James Gunn",
    "Writer": "James Gunn, Dan Abnett (based on the Marvel comics by), Andy Lanning (based on the Marvel comics by), Steve Englehart (Star-Lord created by), Steve Gan (Star-Lord created by), Jim Starlin (Gamora and Drax created by), Stan Lee (Groot created by), Larry Lieber (Groot created by), Jack Kirby (Groot created by), Bill Mantlo (Rocket Raccoon created by), Keith Giffen (Rocket Raccoon created by), Steve Gerber (Howard the Duck created by), Val Mayerik (Howard the Duck created by)",
    "Actors": "Chris Pratt, Zoe Saldana, Dave Bautista, Vin Diesel",
    "Plot": "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father the ambitious celestial being Ego.",
    "Language": "English",
    "Country": "USA",
    "Awards": "Nominated for 1 Oscar. Another 12 wins & 42 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BN2MwNjJlODAtMTc1MS00NjkwLTg2NDMtYzFjZmU2MGM1YWUwXkEyXkFqcGdeQXVyMTYzMDM0NTU@._V1_SX300.jpg",
    "Ratings": [{
      "Source": "Internet Movie Database",
      "Value": "7.6/10"
    }, {
      "Source": "Rotten Tomatoes",
      "Value": "84%"
    }, {
      "Source": "Metacritic",
      "Value": "67/100"
    }],
    "Metascore": "67",
    "imdbRating": "7.6",
    "imdbVotes": "496,865",
    "imdbID": "tt3896198",
    "Type": "movie",
    "DVD": "22 Aug 2017",
    "BoxOffice": "$389,804,217",
    "Production": "Walt Disney Pictures",
    "Website": "https://marvel.com/guardians",
    "Response": "True"
  }
 */
export default interface OMDbData extends OMDbResponse {
  Title: string

  Year: string

  Rated: string

  Released: string

  Runtime: string

  Genre: string

  Director: string

  Writer: string

  Actors: string

  Plot: string

  Language: string

  Country: string

  Awards: string

  Poster: string

  Ratings: Rating[]

  Metascore: string

  imdbRating: string

  imdbVotes: string

  imdbID: string

  Type: string

  DVD: string

  BoxOffice: string

  Production: string

  Website: string
}
