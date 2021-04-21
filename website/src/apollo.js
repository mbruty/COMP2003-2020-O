import { createUploadLink } from "apollo-upload-client";
import { ApolloClient, InMemoryCache } from '@apollo/client';

const link = createUploadLink({
  uri: "https://image-upload-4gqpkawhia-lz.a.run.app/graphql",
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});