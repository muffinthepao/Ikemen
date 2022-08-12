require("dotenv").config();

const express = require("express");
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const session = require("express-session");

const hour = 3_600_000;
const app = express();
const port = process.env.PORT || 3000;
const mongoConnectionStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@generalassembly.ljkj0.mongodb.net/?retryWrites=true&w=majority`;

//controllers
const authController = require("./controllers/authentication/authentication_controller");
const authMiddleware = require("./middlewares/auth_middleware");
const pageController = require("./controllers/pages/page_controller");
const reviewController = require("./controllers/reviews/review_controller");
const savesController = require("./controllers/saves/saves_controller");

const userController = require("./controllers/users/user_controller");

//Set view engine
app.set("view engine", "ejs");

//apply middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(session({ //creates a session each time you access the page
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: false, maxAge: 1 * hour }
}))
app.use(authMiddleware.setAuthUserVar)


//listing routes
app.get("/", pageController.showHome);
app.get("/food", pageController.showListings);
app.get("/food/:listing_id", pageController.showIndividualListing);
app.get("/surprise", pageController.showSurprise);
app.get("/surprise/generate", pageController.randomListing)

//review routes
app.post("/food/:listing_id/review", authMiddleware.isAuthenticated ,reviewController.submitReview);
app.get("/food/:listing_id/review/:review_id", authMiddleware.isAuthenticated ,reviewController.showReview);
app.put("/food/:listing_id/review/:review_id/edit", authMiddleware.isAuthenticated ,reviewController.editReview);
app.delete("/food/:listing_id/review/:review_id/", authMiddleware.isAuthenticated ,reviewController.deleteReview);

//save routes
app.post("/food/:listing_id/save", authMiddleware.isAuthenticated , savesController.saveListing);
app.delete("/food/:listing_id/delete", authMiddleware.isAuthenticated , savesController.deleteSavedListing)

//authentication routes
app.get("/register", authController.showRegistrationForm);
app.post("/register", authController.register);
app.get("/login", authController.showLoginForm);
app.post("/login", authController.login);
app.post("/logout", authController.logout);

//user routes
app.get("/user/profile", userController.showProfile);
app.put("/user/profile/edit", userController.updateUserDetails);

app.listen(port, async () => {
  try {
    await mongoose.connect(mongoConnectionStr, { dbName: "ikemen" });
  } catch (err) {
    console.log(`Failed to connect to DB`);
    process.exit(1);
  }

  console.log(`Example app listening on port ${port}`);
});
