import mongoose from "mongoose";
const { Schema } = mongoose;
const User = new Schema({
  username: {
    type: String
  },
  password: {
    type: String,
  },
  email: {
    type: String
  },
  providers: [
    {
      providerName: {
        type: String,
        required: true,
      },
      profileId: {
        type: String,
        required: true,
      },
    },
  ],
});

export default new mongoose.model("User", User);
