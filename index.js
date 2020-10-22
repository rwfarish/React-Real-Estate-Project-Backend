require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const PORT = 4000;
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/users");

const connect = () => {
  const un = process.env.MONGO_USER;
  const pw = process.env.MONGO_PASSWORD;
  return mongoose.connect(
    `mongodb+srv://${un}:${pw}@jrsmidpoint.j9kqf.mongodb.net/testdb?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
};

app.use("/users", userRoutes);
app.get("/", (req, res) => {
  return res.redirect("/users");
});

// routes - index
const { response } = require("express");

exports.usersRouter = require("./users");

app.get("/listings", async (req, res) => {
  try {
    console.log("get all listings");
    const listings = await ListingModel.find();
    response.status(200).send(listings);
  } catch (error) {
    response.status(500).send(error);
  }
});
//routes - users

// app imports
const { User } = require("../models");

// globals
const router = express.Router();
// localhost:3000/(route (empty string) 'on line 10').
router
  .route("")
  .get((req, res, next) =>
    User.find()
      .then((users) => res.render("index", { users }))
      .catch((err) => next(err))
  )
  .post((req, res, next) => {
    const newUser = new User(req.body);
    return newUser
      .save()
      .then(() => res.redirect("/"))
      .catch((err) => next(err));
  });

router.route("/new").get((req, res) => {
  return res.render("new");
});

router
  .route("/:id")
  .get((req, res, next) =>
    User.findById(req.params.id)
      .then((user) => res.render("show", { user }))
      .catch((err) => next(err))
  )
  .patch((req, res, next) =>
    User.findByIdAndUpdate(req.params.id, req.body)
      .then(() => res.redirect("/users"))
      .catch((err) => next(err))
  )
  .delete((req, res, next) =>
    User.findByIdAndRemove(req.params.id)
      .then(() => res.redirect("/users"))
      .catch((err) => next(err))
  );

router.get("/:id/edit", (req, res, next) =>
  User.findById(req.params.id)
    .then((user) => res.render("edit", { user }))
    .catch((err) => next(err))
);

module.exports = router;

//user - model

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

app.listen(PORT, () => console.log("server is running on ${PORT}"));
