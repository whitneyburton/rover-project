const {
  calculateProfileScore,
  calculateRatingsScore,
  calculateSearchScore,
} = require("./index");

describe("calculateProfileScore", () => {
  it.each([{ name: "" }, { name: "123" }, { name: undefined }, { name: null }])(
    `returns 0 when it receives an input that has no letters of the alphabet: $name`,
    ({ name }) => {
      expect(calculateProfileScore(name)).toBe(0);
    }
  );

  it.each([
    { name: "Ilka A.", result: 0.77 },
    { name: "Leilani R.", result: 1.15 },
    { name: "Hubert Wolfeschlegelsteinhausenbergerdorff Sr.", result: 3.27 },
  ])("returns correct score for the name: $name", ({ name, result }) => {
    expect(calculateProfileScore(name)).toBe(result);
  });

  it("returns 5 for a name which includes all of the letters of the alphabet", () => {
    expect(calculateProfileScore("Abcdefghijklmnopqurs Tuvwxy Z.")).toBe(5);
  });
});

describe("calculateRatingsScore", () => {
  it.each([
    { ratings: [] },
    { ratings: ["Fido", "fetch!"] },
    { ratings: undefined },
    { ratings: null },
  ])(
    `returns 0 when it receives an input that is not an array of integers: $ratings`,
    ({ ratings }) => {
      expect(calculateRatingsScore(ratings)).toBe(0);
    }
  );

  it.each([
    { ratings: [0], result: 0 },
    { ratings: [5, 4, 4, 5, 3, 5], result: 4.33 },
    { ratings: [5, 5, 5, 5], result: 5 },
  ])(
    "returns the correct score for the array of ratings: $ratings",
    ({ ratings, result }) => {
      expect(calculateRatingsScore(ratings)).toBe(result);
    }
  );
});

describe("calculateSearchScore", () => {
  it.each([
    {
      profileScore: undefined,
      ratingsScore: undefined,
      ratingsCount: undefined,
    },
    { profileScore: "Hello", ratingsScore: "world", ratingsCount: "goodbye" },
    { profileScore: null, ratingsScore: () => true, ratingsCount: {} },
  ])(
    "handles invalid props: profile score = $profileScore, rating score = $ratingsScore, ratings count = $ratingsCount",
    ({ profileScore, ratingsScore, ratingsCount }) => {
      expect(
        calculateSearchScore(profileScore, ratingsScore, ratingsCount)
      ).toBe(0);
    }
  );

  it("defaults to the profile score when there are no ratings", () => {
    expect(calculateSearchScore(2.5, 5.0, 0)).toBe(2.5);
  });

  it("defaults to the ratings score if the sitter has 10 or more ratings", () => {
    expect(calculateSearchScore(2.5, 5.0, 10)).toBe(5.0);
    expect(calculateSearchScore(2.5, 4.2, 12)).toBe(4.2);
  });

  it("calculates the search score correctly if between 0 and 10 ratings", () => {
    expect(calculateSearchScore(2.5, 5.0, 0)).toBe(2.5);
    expect(calculateSearchScore(2.5, 5.0, 1)).toBe(2.75);
    expect(calculateSearchScore(2.5, 5.0, 2)).toBe(3);
    expect(calculateSearchScore(2.5, 5.0, 3)).toBe(3.25);
    expect(calculateSearchScore(2.5, 5.0, 4)).toBe(3.5);
    expect(calculateSearchScore(2.5, 5.0, 5)).toBe(3.75);
    expect(calculateSearchScore(2.5, 5.0, 6)).toBe(4);
    expect(calculateSearchScore(2.5, 5.0, 7)).toBe(4.25);
    expect(calculateSearchScore(2.5, 5.0, 8)).toBe(4.5);
    expect(calculateSearchScore(2.5, 5.0, 9)).toBe(4.75);
    expect(calculateSearchScore(2.5, 5.0, 10)).toBe(5);
    expect(calculateSearchScore(2.5, 5.0, 11)).toBe(5);
  });
});
