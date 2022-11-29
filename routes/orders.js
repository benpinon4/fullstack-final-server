var express = require("express");
var router = express.Router();
// const bcrypt = require("bcryptjs");//Talk to james about full site user auth with order
// const jwt = require("jsonwebtoken");
var { uuid } = require("uuidv4");
const { db } = require("../mongo");

router.get("/", function (req, res, next) {
    res.send("respond with a resource");
  });

router.post("/orders", function (req, res, next) {
    res.send({
        sucess: true
    })
})  

module.exports = router;


order = [
    {
        user: "asd",
    },
    {
        orderList: "asd",
    }
]
