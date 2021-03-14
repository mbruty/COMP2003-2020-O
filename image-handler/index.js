const { ApolloServer, gql } = require("apollo-server-express");
const path = require("path");
const express = require("express");
const { Storage } = require("@google-cloud/storage");
const cors = require("cors");
const sharp = require("sharp");
const fetch = require("node-fetch");
const { json } = require("express");
require("dotenv").config();

const typeDefs = gql`
  input CropInput {
    x: Int,
    y: Int,
    width: Int,
    height: Int
  }

  input AuthInput {
    userid: String,
    authtoken: String
  }
  type Query {
    files: [String]
  }
  type Mutation {
    uploadFile(file: Upload!, crop: CropInput!, auth: AuthInput!, foodID: Int!): Boolean
  }
`;

const gc = new Storage({
  keyFilename: path.join(__dirname, "./comp2003-4313e0d1b519.json"),
  projectId: "comp2003",
});

const imgBucket = gc.bucket("tat-img");

const resolvers = {
  Query: {
    files: () => files,
  },
  Mutation: {
    uploadFile: async (_, { file, crop, auth, foodID }) => {
      const { createReadStream } = await file;
      const authcheck = await fetch("http://devapi.trackandtaste.com/authcheck", {
        method: "POST",
        headers: { 'userid': auth.userid, 'authtoken': auth.authtoken }
      });
      if(authcheck.status !== 200)
        return false;
      const transformer = sharp().resize({
        width: 400,
        height: 480,
        fit: sharp.fit.contain,
        position: sharp.strategy.centre
      })
      const extract = sharp().extract({
        width: crop.width,
        height: crop.height,
        top: crop.y,
        left: crop.x
      })
      await new Promise((res) => {
        createReadStream()
          .pipe(extract)
          .pipe(transformer)
          .pipe(
            imgBucket.file(`${foodID}.png`).createWriteStream({
              resumable: false,
              gzip: true,
            })
          ).on("finish", res)

      });


      console.log("here");
      return true;
    },
  },
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const app = express();

app.use(
  cors({
    credentials: true,
    origin: (origin, asd) => {
      asd(null, true);
    },
  })
);
server.applyMiddleware({ app });

const port = process.env.PORT || 8080;

console.log(port);
app.listen(port, () => {
  console.log(`🚀  Server ready at http://localhost:${port}/`);
});
