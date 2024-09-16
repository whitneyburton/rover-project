const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const fastcsv = require("fast-csv");

const calculateProfileScore = (name) => {
  if (!name) return 0;

  const distinctLetters = new Set();

  name
    .toLowerCase()
    .split("")
    .forEach(
      (letter) => letter >= "a" && letter <= "z" && distinctLetters.add(letter)
    );

  const alphabetFraction = distinctLetters.size / 26;
  const profileScore = 5 * alphabetFraction;

  return parseFloat(profileScore.toFixed(2));
};

const calculateRatingsScore = (ratings) => {
  if (
    !ratings ||
    !ratings.filter((number) => typeof number === "number").length
  )
    return 0;

  const ratingsTotal = ratings.reduce((a, b) => a + b, 0);
  const ratingsAverage = ratingsTotal / ratings.length;

  return parseFloat(ratingsAverage.toFixed(2));
};

const calculateSearchScore = (profileScore, ratingsScore, ratingsCount) => {
  if (
    typeof profileScore !== "number" ||
    typeof ratingsScore !== "number" ||
    typeof ratingsCount !== "number"
  )
    return 0;

  let searchScore;

  if (ratingsCount === 0) {
    searchScore = profileScore;
  } else if (ratingsCount >= 10) {
    searchScore = ratingsScore;
  } else {
    searchScore =
      profileScore + (ratingsScore - profileScore) * (ratingsCount / 10);
  }

  return parseFloat(searchScore.toFixed(2));
};

const processReviewsCsv = async (inputFile, outputFile) => {
  const sitters = [];

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on("data", (row) => {
      const { sitter_email: email, sitter: name, rating } = row;

      const preexistingSitter = sitters.find(
        (sitter) => sitter.email === email
      );

      preexistingSitter
        ? preexistingSitter.ratings.push(parseFloat(rating))
        : sitters.push({ email, name, ratings: [parseFloat(rating)] });
    })
    .on("end", () => {
      const result = sitters
        .map(({ name, ratings, email }) => {
          const profileScore = calculateProfileScore(name);
          const ratingsScore = calculateRatingsScore(ratings);
          const searchScore = calculateSearchScore(
            profileScore,
            ratingsScore,
            ratings.length
          );

          return {
            email,
            name,
            profile_score: profileScore,
            ratings_score: ratingsScore,
            search_score: searchScore,
          };
        })
        .sort(
          (a, b) =>
            b.search_score - a.search_score || a.name.localeCompare(b.name)
        );

      const writeStream = fs.createWriteStream(outputFile);
      fastcsv.write(result, { headers: true }).pipe(writeStream);
    });
};

const inputFile = path.join(__dirname, "../reviews.csv");
const outputFile = path.join(__dirname, "../sitters.csv");

processReviewsCsv(inputFile, outputFile);

exports.calculateProfileScore = calculateProfileScore;
exports.calculateRatingsScore = calculateRatingsScore;
exports.calculateSearchScore = calculateSearchScore;
