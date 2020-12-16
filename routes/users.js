var express = require("express");
var router = express.Router();
var User = require("../models/User");
var multer = require("multer");
var path = require("path");
var uploadPath = path.join(__dirname, "../", "public/upload");
console.log(uploadPath);
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// registration

router.get("/register", (req, res, next) => {
  res.render("register", { message: req.flash("Error") });
});

router.post("/register", upload.single("image"), (req, res, next) => {
  if (req.file && req.file.filename) {
    req.body.image = req.file.filename;
  }
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect("/users/login");
  });
});

// login
router.get("/login", (req, res, next) => {
  res.render("loginForm", { message: req.flash("Error") });
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;

  if (!email || !password) {
    req.flash("Error", "Email & Password required");
    return res.redirect("/users/login");
  }

  User.findOne({ email }, (err, user) => {
    //  condition 1
    if (err) return next(err);

    // condition 2
    if (!user) {
      req.flash("Error", "Email is not register");
      return res.redirect("/users/login");
    }
    // condition 3 - verify the password
    if (!user.validatePassword(password)) {
      req.flash("Error", "Password wrong");
      return res.redirect("/users/login");
    }
    // loggin User
    // creating a session on server side
    req.session.userId = user.id;
    req.session.admin = user.admin;
    res.redirect(req.session.returnTo || "/products");

    // res.send("welcome to product page")
    delete req.session.returnTo;
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/users/login");
});

module.exports = router;
