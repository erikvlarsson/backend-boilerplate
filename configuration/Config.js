import mongoose from "mongoose";
const MongoClient = require("mongodb").MongoClient;

//for hiding connection string
require("dotenv/config");

//connect to db
// const connectToMongoDB = async () => {
//   const client = new MongoClient(process.env.DATABASE_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   client.connect((err) => {
//     console.log("CONNECTED!");
//     const collection = client.db("database0").collection("users");
//     // perform actions on the collection object
//     console.log(collection.find());
//     client.close();
//   });
// };
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      () => {
        console.log("Connected to MongoDB Atlas!");
      }
    );
  } catch (error) {
    console.log("Error while trying connect to MongoDB!");
  }
};

const startServer = (app) => {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default { connectToMongoDB, startServer };
