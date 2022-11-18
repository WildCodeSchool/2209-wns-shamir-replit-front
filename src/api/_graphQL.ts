import { ApolloClient, InMemoryCache } from "@apollo/client";

let fromFrontUrl = "http://localhost:5000";

if (process.env.BACKEND_URL) fromFrontUrl = process.env.BACKEND_URL;

export const api = new ApolloClient({
  uri: `${fromFrontUrl}/graphql`,
  cache: new InMemoryCache(),
});
