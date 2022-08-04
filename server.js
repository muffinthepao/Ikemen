require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const port = 3000;
const mongoConnectionStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@generalassembly.ljkj0.mongodb.net/?retryWrites=true&w=majority`;

//controllers
const pageController = require("./controllers/pages/page_controller");
const userController = require("./controllers/users/user_controller");

//Set view engine
app.set("view engine", "ejs");

//apply middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//page routes
app.get("/", pageController.showHome);
app.get("/food", pageController.showListings);
app.get("/food/:listing_id", pageController.showIndividualListing);

//user routes
app.get("/users/register", userController.showRegistrationForm);
app.post("/users/register", userController.register);
app.get("/users/login", userController.showLoginForm);
app.post("/users/login", userController.login);

app.listen(port, async () => {
  try {
    await mongoose.connect(mongoConnectionStr, { dbName: "ikemen" });
  } catch (err) {
    console.log(`Failed to connect to DB`);
    process.exit(1);
  }

  console.log(`Example app listening on port ${port}`);
});
