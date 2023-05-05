const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const session = require("express-session");
const PORT = process.env.PORT || 8000;
const path = require("path");
const ejs = require("ejs");
/**
 * Middleware
 */
app.use(express.json());
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "!@*#$(&!#my_secret_()*$!@01293",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.get("/", (req, res) => {
  res.render("home");
});

/**
 * Login
 */
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  req.session.isAuth = true;
  res.redirect("/dashboard");
});

/**
 * Register
 */
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  res.end();
});

/**
 * Dashboard
 */

function isAuth(req, res, next) {
  if (req.session.isAuth) {
    next();
  } else res.redirect("/login");
}

app.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

/**
 * Logout
 */

app.get("/logout", (req, res) => {
  req.session.isAuth = false;
  res.redirect("/login");
});

app.listen(PORT, (err) => {
  if (err) console.log(`Error listening on ${PORT}`);
  else console.log(`Servers started on port  http://localhost:${PORT}`);
});
