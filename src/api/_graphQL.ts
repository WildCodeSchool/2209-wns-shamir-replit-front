import {
  ApolloClient,
  ApolloClientOptions,
  DefaultOptions,
  InMemoryCache,
} from "@apollo/client";

let fromFrontUrl = "http://localhost:5000";

if (process.env.REACT_APP_BACKEND_URL)
  fromFrontUrl = process.env.REACT_APP_BACKEND_URL;

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const params: ApolloClientOptions<unknown> = {
  uri: `${fromFrontUrl}/graphql`,
  cache: new InMemoryCache(),
  defaultOptions,
};

const token = localStorage.getItem("token");

if (token) params.headers = { Authorization: "Bearer " + token };
export const api = new ApolloClient(params);
