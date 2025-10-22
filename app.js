const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require('ejs-mate');
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const listingsRouter = require("./routes/listings.js"); // router
const reviewRouter = require("./routes/reviewroute.js"); // router
const userRouter = require("./routes/user.js"); // router

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "public")))
let sessionOption = {
  secret: "mysuppersecratestring",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
}
app.get("/", async (req, res) => {
  res.send("Hi, I am root");
});
app.use(session(sessionOption))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
//middleware of flash
app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.delet = req.flash("delete")
  res.locals.currUser = req.user;
  next()
})
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use((err, req, res, next) => {
  let { status = 500, message = "Some Thing Went Wrong" } = err;
  console.log("______ERROR________", err)
  res.status(status).send(message); 
})
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
