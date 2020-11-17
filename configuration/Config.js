import mongoose from "mongoose";

//for hiding connection string
require("dotenv/config");

//connect to db
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
  // const port = process.env.PORT;
  // app.listen(port, () => {
  //   console.log(`Server is running on port ${port}`);
  // });
  app.listen(5000);
};

export default { connectToMongoDB, startServer };
