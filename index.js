import connection from "./config/db.js"
import express from "express";
import session from "express-session";
import MongoDBSession  from "connect-mongodb-session";
import authRoutes from "./routes/auth.js";
import rootRoutes from "./routes/root.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import passport from "passport";

dotenv.config();


const app = express();

// set view engine
app.set("view engine", "ejs");

const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session setup

const MongoDBStore = MongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.NODE_MONGO_CONNECTION_STRING,
  databaseName: "myDb",
  collection: "sessions"
});

store.on('error', function(error) {
  console.log(error);
});

app.use(
  session({
    secret: process.env.NODE_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sid",
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
    }
  })
);

app.use(passport.authenticate('session'));

// Routes

app.use("/", authRoutes);
app.use("/", rootRoutes);

// error handling middleware

app.use((err, req, res, next) => {
  console.log(err);
  if(err) {
    res.send("This is the error page ")
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
