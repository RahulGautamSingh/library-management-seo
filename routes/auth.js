const jwt = require("jsonwebtoken");
const express = require("express");
const multer = require("multer");

let refreshTokens = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const { createNewUser, findUser } = require("../controllers/userController");
const router = express.Router();

const multipart = multer({ storage: storage });

router.post("/signup", multipart.single("photoUrl"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  if (req.file !== undefined) req.body.photoUrl = req.file.path;
  let result = await createNewUser(req.body);

  if (result.status) {
    res.send(result.result);
  } else {
    res.status(500).send(result.result);
  }
});
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhlbGxvd29ybGRAZ21haWwuY29tIiwiaWF0IjoxNjIzNzUxMTEzLCJleHAiOjE2MjM3NTExNDN9.vxzFuIRtg7BNIVVxNbI66CYCUdhmEb6iFnF8r-BT-ZY
router.route("/login").post(async (req, res) => {
  let result = await findUser(req.body);
  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhlbGxvd29ybGRAZ21haWwuY29tIiwiaWF0IjoxNjIzNzUxMTEzLCJleHAiOjE2MjQzNTU5MTN9.4FwP9ZZ24DdiPvG-PzD-C9RqfjNDqM2xxfrs08WoLN8
  if (result.status) {
    let payload = {
      email: result.result.email,
    };
    console.log(payload);
    let accessToken = jwt.sign(payload, process.env.secret_token, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });

    let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
    });
    refreshTokens.push(refreshToken);
    res
      .status(200)
      .json({ access_token: accessToken, refresh_token: refreshToken });
  } else {
    res.status(500).send(result);
  }
});

router.route("/token").post(async (req, res) => {
  let { token } = req.body.body;
  token = token.slice(7);
  console.log(token, refreshTokens);
  if (!token || !refreshTokens.includes(token)) {
    res.send(401);
  } else {
    let accessToken = jwt.sign({}, process.env.secret_token, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
    res.status(200).json({ access_token: accessToken });
  }
});

router.route("/logout").post(async (req, res) => {
 refreshTokens = [];
 res.status(200).json({"message":"Logged out"})
});
module.exports = router;
