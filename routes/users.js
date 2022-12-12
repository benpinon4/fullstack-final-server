var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var { uuid } = require("uuidv4");
const { db } = require("../mongo");

let user = {};
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const saltRounds = 5;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  user = {
    email,
    password: hash,
    orderHistory: [],
    id: uuid(),
  };

// Existing User Check //
  const retrieveUser = await db().collection("users").findOne({
    email: email,
  });

  if(retrieveUser === null){
    const addUser = await db().collection("users").insertOne(user);

    res.json({
      success: true,
      user,
    });
    return
  }

 if(retrieveUser !== undefined){
  console.log("Email Already Exists")
  res.json({
    success: false,
    message: "The email entered already exists"
    
  });
  
 }
// Existing User Check //

});

router.post("/login", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const retrieveUser = await db().collection("users").findOne({
    email: email,
  });

  if (retrieveUser === null) {
    res.json({
      success: false,
      message: "Your password and/or email are incorrect. Please try again."
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, retrieveUser.password);

  console.log(passwordMatch);

 
  if (passwordMatch === true) {
    let scope = retrieveUser.email.includes("@myshop.com") ? "admin" : "user";

    console.log(scope)

    const userData = {
      email: retrieveUser.email,
      date: new Date(),
      userID: retrieveUser.id,
      scope,
    }

    const payload = {
      userData,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }

    const secretKey = process.env.JWT_SECRET_KEY
    const token = jwt.sign(payload, secretKey)
    console.log(token)
    res.json({
      success: true,
      token: token,
      email: retrieveUser.email
    });
  }



  // console.log(retrieveUser);
});

router.get('/message', async function (req, res, next){
  try {
    const tokenToAuth = req.header(process.env.TOKEN_HEADER_KEY)
    const secretKey = process.env.JWT_SECRET_KEY
    
    const verified = jwt.verify(tokenToAuth, secretKey)

    console.log(verified)

    let userScope = ""

    if(verified.userData.scope === "user"){
      userScope = "Customer"
    }
    if(verified.userData.scope === "admin"){
      userScope = "Admin"
    }

    return res.json({
      success: true,
      verified: verified,
      message: "",
      user: userScope
    })
  }
 catch (e){
  return res.json({
    success: false,
    message: e.toString()
  })
  }
})
module.exports = router;
