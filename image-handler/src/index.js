const { ApolloServer, gql } = require("apollo-server-express");
const path = require("path");
const express = require("express");
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");
const cookieParser = require("cookie-parser");
const cors = require("cors");
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
  projectId: "track-and-taste",
});

const imgBucket = gc.bucket("tat-image");

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

const context = ({ req, res }) => {
  // Set this header to the url when pushing to production
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // Do authentication here
  console.log(req.cookies);
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});
const app = express();
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: (origin, asd) => {
      asd(null, true);
    },
  })
);
server.applyMiddleware({ app });

app.listen(4000, () => {
  console.log(`🚀  Server ready at http://localhost:4000/`);
});
