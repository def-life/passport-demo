import express from "express";
import passport from "../config/passport.js";
import loggedIn from "../middleware/loggedIn.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("landing")
})

router.get("/dashboard", loggedIn, (req, res) => {
    res.render("dashboard");
})

export default router;