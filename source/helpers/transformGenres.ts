export const DEFAULT_GENRE_DELIMITER = "|"
export const DEFAULT_GENRE_STRING = "N/A"

const transformGenres = (
  rawGenresString?: string | null,
  delimiter = DEFAULT_GENRE_DELIMITER,
): string[] =>
  (rawGenresString || DEFAULT_GENRE_STRING)
    .split(delimiter)
    .map(str => str.trim())
    .filter(Boolean)

export default transformGenres
