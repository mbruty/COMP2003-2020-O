import { createUploadLink } from "apollo-upload-client";
import { ApolloClient, InMemoryCache } from '@apollo/client';

const link = createUploadLink({
  uri: "http://localhost:8080/graphql",
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});