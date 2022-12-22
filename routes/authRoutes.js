import express from "express"

import authenticateUser from "../middleware/auth.js"

const router = express.Router()

import rateLimiter from "express-rate-limit"
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
})

// import rateLimiter from "express-rate-limit"

// const apiLimiter = rateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10, // in 15 min you can make 10 requests from that ip adress
//   message: "Too many requests from this IP, please try again in 15 minutes",
// }) //we place it in the routes we are going to use it

import { register, login, updateUser } from "../controllers/authController.js"
import auth from "../middleware/auth.js"

router.route("/register").post(apiLimiter, register)
router.route("/login").post(apiLimiter, login)
router.route("/updateUser").patch(authenticateUser, updateUser)

export default router

// you can use the rateLimiter in to the sever and cover all routes
