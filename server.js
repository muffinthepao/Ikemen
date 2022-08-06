require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const port = 3000;
const mongoConnectionStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@generalassembly.ljkj0.mongodb.net/?retryWrites=true&w=majority`;

//controllers
const authController = require("./controllers/authentication/authentication_controller");
const pageController = require("./controllers/pages/page_controller");
const userController = require("./controllers/users/user_controller");

//Set view engine
app.set("view engine", "ejs");

//apply middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({ //creates a session each time you access the page
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: false, maxAge: 10000 }
}))


//page routes
app.get("/", pageController.showHome);
app.get("/food", pageController.showListings);
app.get("/food/:listing_id", pageController.showIndividualListing);

//authentication routes
app.get("/register", authController.showRegistrationForm);
app.post("/register", authController.register);
app.get("/login", authController.showLoginForm);
app.post("/login", authController.login);

//user routes
app.get("/user/profile",userController.showProfile);

app.listen(port, async () => {
  try {
    await mongoose.connect(mongoConnectionStr, { dbName: "ikemen" });
  } catch (err) {
    console.log(`Failed to connect to DB`);
    process.exit(1);
  }

  console.log(`Example app listening on port ${port}`);
});
