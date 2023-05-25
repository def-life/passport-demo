import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.NODE_MONGO_CONNECTION_STRING, {dbName: "myDb"}).then(
  function success() {
    console.log("connected to mongodb");
  },
  function failure(err) {
    console.log("error connecting to mongodb", err);
  }
);

mongoose.connection.on("error", (err) => {
  console.log("An error occured", err);
  
});

mongoose.connection.on("disconnected ", (err) => {
    console.log("Disconnected from mongo", err);
  });

export default mongoose.connection
