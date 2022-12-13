const e = require("express");
var express = require("express");
var router = express.Router();
// const bcrypt = require("bcryptjs");//Talk to james about full site user auth with order
// const jwt = require("jsonwebtoken");
var { uuid } = require("uuidv4");
const { db } = require("../mongo");

router.get("/", function (req, res, next) {
    res.send("respond with a resource");
  });

router.post("/create-order", async function (req, res, next) {
    const incommingOrder = req.body.order
    const generateOrderID = uuid()
    const newOrder = {
       ...incommingOrder,   
       orderID: generateOrderID
    }

    console.log(newOrder)

    const addOrder = await db().collection("orders").insertOne(newOrder)

    const addOrderToUser = await db().collection("users").updateOne({"id": incommingOrder.userID},
    {$addToSet: {orderHistory: newOrder}})



    res.json({
        sucess: true,
        addedOrderOrders: addOrder,

        orderID: generateOrderID,
        orderSummary: incommingOrder
        
    })
})  

router.post("/shipping-billing", async function (req, res, next) {
    const incomminguserID = req.body.userID
    const incommingorderID = req.body.orderID
    const incommingshippingInfo = req.body.shippingInfo
    const incommingbillingInfo = req.body.billingInfo

    console.log(incomminguserID)
    console.log(incommingorderID)
    console.log(incommingshippingInfo)
    console.log(incommingshippingInfo)

    const addShipBillInfoUser = await db().collection("users").updateOne({"id": incomminguserID},
    {$set: {"billingInfo": incommingbillingInfo, "shippingInfo": [...incommingshippingInfo]}})
    const addShipBillInfoOrder = await db().collection("orders").updateOne({"orderID": incommingorderID}, 
    {$set:{"billingInfo": [...incommingbillingInfo], "shippingInfo": [...incommingshippingInfo]}})

    console.log(addShipBillInfoUser)
    console.log(addShipBillInfoOrder)


    res.json({
        sucess: true,
        incomminguserID,
        incommingshippingInfo,
        incommingbillingInfo,        
    })
})

router.post("/send-order", async function (req, res, next){
    const incommingOrder = req.body.completeOrder
    const generateOrderID = uuid()
    const newOrder = {
       ...incommingOrder,   
       orderID: generateOrderID
    }

    console.log(newOrder)

    const addOrder = await db().collection("orders").insertOne(newOrder)

    const addOrderToUser = await db().collection("users").updateOne({"id": incommingOrder.userID},
    {$addToSet: {orderHistory: newOrder}})



    res.json({
        sucess: true,
        addedOrderOrders: addOrder,

        orderID: generateOrderID,
        orderSummary: incommingOrder
        
    })
})

module.exports = router;


