import mongoose from "mongoose";
const MongoClient = require("mongodb").MongoClient;

//for hiding connection string
require("dotenv/config");

//connect to db
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      keepAlive: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB atlas!");
  } catch (error) {
    console.log("Error while trying connect to MongoDB!");
    console.log(error);
  }
};

const startServer = (app) => {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default { connectToMongoDB, startServer };
