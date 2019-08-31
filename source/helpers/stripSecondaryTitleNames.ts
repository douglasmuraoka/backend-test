/**
 * Strips any secondary title name.
 *
 * Ex:
 * input: "Assassination  (Assassination, The) (Assassin, The)"
 * output: "Assassination"
 *
 * @param title The movie title
 */
const stripSecondaryTitleNames = (title: string): string => {
  const parenthesisIdx = title.indexOf("(")
  return parenthesisIdx === -1 ? title : title.substr(0, parenthesisIdx - 1)
}

export default stripSecondaryTitleNames
