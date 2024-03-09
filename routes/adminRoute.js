
const adminModel = require('../model/adminModel')
const bcrypt = require("bcrypt");
const express = require("express");
const json = require("jsonwebtoken");
const blackList = require("../blackList");
const auth = require("../middleware/auth");
const secretKey = process.env.SECRET_KEY;


//create route for student.
const adminRoute = express.Router();

// register
adminRoute.post("/adsign",auth, async (req, res) => {
  try {
    console.log("req", req.body);
    const { password, email } = req.body;
    const newPassword = await bcrypt.hash(password, 10);
    console.log(newPassword);
    const newAdmin = await adminModel.create({
      ...req.body,
      password: newPassword,
    });
    console.log(newAdmin);
    res
      .status(200)
      .send({ msg: "user has successfully registered", user: newAdmin });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      // If the error is due to duplicate key on email field
      res.status(400).json({ message: "Email address already exists" });
    } else {
      // For other errors
      res.status(500).json({ message: "Internal server error",error:error.message });
    }
  }
});




//login
adminRoute.post("/adlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const preAdmin = await adminModel.findOne({ email });

    if (!preAdmin) {
      return res.status(401).send("user not found");
    }

    const verify = await bcrypt.compare(password, preAdmin.password);
    if (!verify) {
      return res.status(401).send("incorrect password");
    }
    const token = json.sign(
      { id: preAdmin._id, studentEmail: preAdmin.email },
      `${secretKey}`
    );

    return res
      .status(200)
      .send({ msg: "Login Successfull", token, data: preAdmin });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//logout
adminRoute.get("/adlogout", async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    blackList.push(token);
    res.send("User has Logged Out").status(200);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

//update user for cartPage


//module exporter

module.exports = adminRoute;
