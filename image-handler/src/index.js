const { ApolloServer, gql } = require("apollo-server-express");
const { createWriteStream } = require("fs");
const path = require("path");
const express = require("express");
const { Storage } = require("@google-cloud/storage");

const files = [];

const typeDefs = gql`
  type Query {
    files: [String]
  }
  type Mutation {
    uploadFile(file: Upload!): Boolean
  }
`;

const gc = new Storage({
  keyFilename: path.join(__dirname, "../track-and-taste-cee43c7463f3.json"),
  projectId: "track-and-taste"
});

const imgBucket = gc.bucket("tat-image");

const resolvers = {
  Query: {
    files: () => files
  },
  Mutation: {
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename } = await file;

      await new Promise(res =>
        createReadStream()
          .pipe(
            imgBucket.file(filename).createWriteStream({
              resumable: false,
              gzip: true
            })
          )
          .on("finish", res)
      );

      files.push(filename);

      return true;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
app.get("*", (req, res, next) => {
  console.log(req)
  next();
})
server.applyMiddleware({ app });

app.listen(4000, () => {
  console.log(`🚀  Server ready at http://localhost:4000/`);
});