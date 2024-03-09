const studentModel = require("../model/studentModel");
const bcrypt = require("bcrypt");
const express = require("express");
const json = require("jsonwebtoken");
const blackList = require("../blackList");
const auth = require("../middleware/auth");
const secretKey = process.env.SECRET_KEY;


//create route for student.
const studentRoute = express.Router();

// register
studentRoute.post("/stsign", async (req, res) => {
  try {
    console.log("req", req.body);
    const { password, email } = req.body;
    const newPassword = await bcrypt.hash(password, 10);
    console.log(newPassword);
    const newStudent = await studentModel.create({
      ...req.body,
      password: newPassword,
    });
    console.log(newStudent);
    res
      .status(200)
      .send({ msg: "user has successfully registered", user: newStudent });
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
studentRoute.post("/stlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const preStudent = await studentModel.findOne({ email });

    if (!preStudent) {
      return res.status(401).send("user not found");
    }

    const verify = await bcrypt.compare(password, preStudent.password);
    if (!verify) {
      return res.status(401).send("incorrect password");
    }
    const token = json.sign(
      { id: preStudent._id, studentEmail: preStudent.email },
      `${secretKey}`
    );

    return res
      .status(200)
      .send({ msg: "Login Successfull", token, data: preStudent });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//logout
studentRoute.get("/stlogout", async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    blackList.push(token);
    res.send("User has Logged Out").status(200);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

//update user for cartPage
studentRoute.patch("/user/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const obj = req.body;
    const users = await studentModel.findById(id);
    let { cartProducts } = users;
    cartProducts.push(obj);
    console.log(cartProducts);
    const updatedcart = await studentModel.findByIdAndUpdate(
      id,
      { cartProducts },
      { new: true }
    );
    console.log(updatedcart);
    res.send({ msg: "product added to the cart", user: updatedcart });
  } catch (error) {
    res.send(error.message).status(500);
  }
});

//module exporter

module.exports = studentRoute;
