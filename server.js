import "express-async-errors"
import express from "express"
const app = express()

import morgan from "morgan"

import { dirname } from "path"
import { fileURLToPath } from "url"
// import { path } from "path" //error {} stupid!
import path from "path"

import helmet from "helmet"
import xss from "xss-clean"
import mongoSanitize from "express-mongo-sanitize"

import dotenv from "dotenv"
dotenv.config() //that is going to look for .env file in the root, exactly how we are going to set it up

//db and authentication
import connectDB from "./db/connect.js"

//routers
import authRouter from "./routes/authRoutes.js"
import jobsRouter from "./routes/jobsRoutes.js"

//middleware
import notFoundMiddleware from "./middleware/not-found.js"
import errorHandlerMiddleware from "./middleware/error-handler.js"
import authenticateUser from "./middleware/auth.js"

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
}

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.resolve(__dirname, "./client/build"))) //this is where our static assets are going to be located, static assets means they are publicly available/ by default ___dirname is not available
app.use(express.json()) //special build in middleware that will make json date available to us in controllers since we have poset request we will be looking for stuff and that stuff that JSON date will be passes to us using the express.json middleware

app.use(helmet()) //secures headers
app.use(xss()) //xss-clean makes sure that no one can inject malicious code into our application/ cross side scripting attacks
app.use(mongoSanitize()) //prevents from nosql query injection/ 'prevents mongodb operator injection'

// app.get("/", (req, res) => {
//   //   throw new Error("")
//   res.json({ msg: "Hi" })
// })
// app.get("/api/v1", (req, res) => {
//   res.json({ msg: "API" })
// })

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUser, jobsRouter)

app.get("*") //we gonna have access to that routes from our frontend application

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build, index.html"))
})

app.use(notFoundMiddleware) //so im using middleware this signals that im looking for all the http methods, and the same goes for route,all included, thats why we put it below the routes so express first is trying to match request to all routes, and then if nothing matches he goes with app.use

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

// it will have to be async coz connectDB is going to return a promise
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    //server will spin up only if we are successful
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
