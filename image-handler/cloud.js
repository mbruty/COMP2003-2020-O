const { ApolloServer, gql } = require("apollo-server-cloud-functions");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");

const files = [];

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Upload

  type Query {
    files: [String]
  }
  type Mutation {
    uploadFile(file: Upload!): Boolean
  }
`;

const gc = new Storage({
  keyFilename: path.join(__dirname, "./comp2003-4313e0d1b519.json"),
  projectId: "comp2003",
});

const imgBucket = gc.bucket("tat-img");

const transformer = sharp().resize({
  width: 200,
  height: 200,
  fit: sharp.fit.contain,
  position: sharp.strategy.centre,
});

const resolvers = {
  Query: {
    files: () => files,
  },
  Mutation: {
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename } = await file;
      console.log(_);
      await new Promise((res) =>
        createReadStream()
          .pipe(transformer)
          .pipe(
            imgBucket.file(filename).createWriteStream({
              resumable: false,
              gzip: true,
            })
          )
          .on("finish", res)
      );

      files.push(filename);

      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});
