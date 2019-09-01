import stripSecondaryTitleNames from "../../helpers/stripSecondaryTitleNames"

describe("stripSecondaryTitleNames()", () => {
  it("should strip secondary titles", () => {
    expect(
      stripSecondaryTitleNames("Assassination (Ansatsu) (Assassination, The) (Assassin, The)"),
    ).toBe("Assassination")
  })

  it("should do nothing it there's no secondary title", () => {
    expect(stripSecondaryTitleNames("Robocop")).toBe("Robocop")
  })
})
