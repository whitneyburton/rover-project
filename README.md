# Rover - Search Results

This repo contains a simple command-line program that reads and writes CSV data. For now we are working with a CSV of Rover review data for a variety of sitters (`reviews.csv`). This program allows takes that CSV data and transforms it to a readable CSV (`sitters.csv`) which includes:

- **sitter name**
- **sitter email**
- **sitter profile score**: 5 times the fraction of the English alphabet comprised by the distinct letters in the sitter's name
- **sitter ratings score**: the average of the sitters stay ratings
- **sitter search score**: a weighted average of the Profile Score and Ratings Score

## Setup

1. In your terminal, run:

   `git clone git@github.com:whitneyburton/sitters-search-results.git` to clone via SSH or

   `git clone https://github.com/whitneyburton/sitters-search-results.git` to clone via HTTPS.

2. Run `npm install` to install dependencies.
3. Run `npm start` to process the `reviews.csv` file. Results will be stored to `sitters.csv`.
4. To run the test suite, run `npm test`.

## Discussion Question

Imagine you are designing a Rover-like production web application based on the exercise you've just completed. The application will compute the search scores
for sitters, return a list of search results based on those scores, and display them to the user through a web UI.

**Question:** Describe a technical implementation for the frontend you would use to display a list of sitters and their scores. How would the frontend manage state as users interact with a page?

#### Tech stack

- [React](https://react.dev/) - a well known framework we can leverage for simple local state management via the `useState` hook, side effect management and associated UI updates triggered via the `useEffect` hook, and overall a fantastic option for us to create clean reusable components.
- [Tailwind CSS](https://tailwindcss.com/) - for styling
- [Radix UI](https://www.radix-ui.com/) - for humble building blocks for UI components - prioritizes accessibility and easily customizable

#### Component heirarchy

- **App** > top level parent component to handle global state and routing if necessary.
- **SearchButton** > component with button for users to click on to "retrieve" the data (aka retrieve the processed CSV sitter data)
- **SearchResults** > component that will iterate over the array of sitters data to render individual `SitterCard` components.
- **SitterCard** > component to display the sitter data - `email`, `name`, `profile_score`, `ratings_score`

#### Assumptions/questions

- Is it safe to assume that we don't need to render the `search_score` value for users? While this is used for determining the search results order, it's unnecessary for a user to be aware of and therefore can be hidden from the `SitterCard` UI.

#### State management

In order to manage state across this search tool, there will need to be a handful of places we implement React's `useState` hook. `App` would hold the local state for the search result data - triggered by a user clicking on the `SearchButton` button. Once that data is retrieved and stored to local state, a side effect will run in `SearchResults` via `useEffect` as the local state value of `sitterResults` within App will have changed and is included in the `useEffect` dependency array. The `SearchResults` component will iterate over this new data, rendering a `SitterCard` for each set of sitter data.

#### User interaction

State management would increase in complexity as features are added to allow users to interact more with the search results. For example, we could build on this project to allow users to filter the search results, or to sort them based on a value. First consideration that comes to mind is that we will likely need to return more data to the `sitters.csv` based on these needs.

For example, lets say a dog parent needs a sitter tonight - like in a couple of hours. They come to search and want to see who they can get ahold of the fastest. Currently, this CSV program doesn't work with/return the `response_time_minutes` value, but we could add more logic to our `processReviewsCsv` util so that we average those scores for a sitter as well, and allow dog owners to sort the results based on that value. This way, dog owners could find sitters who are most likely to respond to their requests right away.

Future possiblities:

1. If our CSV command line tool were eventually handled on the backend, we could consider bringing in a tool like [Tanstack Query](https://tanstack.com/query/latest) to fetch/cache/update data.
2. [Amplitude](https://amplitude.com/) for user analytic tracking - search terms, results, interaction overall with search feature/sitter cards
